import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.preprocessing import StandardScaler, LabelEncoder
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score, classification_report
from imblearn.over_sampling import SMOTE
import joblib
import os
import ast

# Paths
MODEL_DIR = "./"
os.makedirs(MODEL_DIR, exist_ok=True)

# Load dataset
df = pd.read_csv('strategy_recommendation_training.csv')

# Clean up fields
df['return_rate'] = df['return_rate'].str.replace('%', '').astype(float)
df['goal_types'] = df['goal_types'].apply(ast.literal_eval)
df = df.drop(columns=['strategy_description'])

# Encode target
target_col = 'strategy_name'
label_encoder = LabelEncoder()
df[target_col] = label_encoder.fit_transform(df[target_col])
joblib.dump(label_encoder, os.path.join(MODEL_DIR, 'strategy_label_encoder.pkl'))

# Clean and encode features
# Safer detection of categorical columns
categorical_cols = [
    col for col in df.columns
    if df[col].dtype == 'object' and col != target_col
]

for col in categorical_cols:
    df[col] = df[col].astype(str).str.strip().str.lower().str.replace(' ', '_').str.replace(r'[<>^()]', '', regex=True)

# One-hot encode list-type column
goal_dummies = pd.get_dummies(df['goal_types'].explode()).groupby(level=0).sum()
df = df.drop(columns=['goal_types'])
df = pd.concat([df, goal_dummies], axis=1)

# Remove 'goal_types' from list since it's no longer in df
categorical_cols = [col for col in categorical_cols if col != 'goal_types']

# One-hot encode remaining categorical columns
df = pd.get_dummies(df, columns=categorical_cols)
df.columns = df.columns.str.replace(r'[\[\]<>()]', '', regex=True).str.replace(r'\s+', '_', regex=True)

# Split data
X = df.drop(columns=[target_col])
y = df[target_col]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Fill NaNs
X_train = X_train.fillna(X_train.median(numeric_only=True))
X_test = X_test.fillna(X_train.median(numeric_only=True))

# Handle imbalance with SMOTE
smote = SMOTE(random_state=42)
X_train_resampled, y_train_resampled = smote.fit_resample(X_train, y_train)

# Scale numeric features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train_resampled)
X_test_scaled = scaler.transform(X_test)

joblib.dump(scaler, os.path.join(MODEL_DIR, 'scaler.pkl'))
joblib.dump(X_train.columns.tolist(), os.path.join(MODEL_DIR, 'feature_columns.pkl'))

# Model and hyperparameter search
model = XGBClassifier(use_label_encoder=False, eval_metric='mlogloss', verbosity=0, random_state=42)

param_dist = {
    'n_estimators': [50, 100, 200],
    'max_depth': [3, 4, 5, 6],
    'learning_rate': [0.01, 0.05, 0.1, 0.2],
    'subsample': [0.6, 0.8, 1.0],
    'colsample_bytree': [0.6, 0.8, 1.0]
}

search = RandomizedSearchCV(
    model, param_distributions=param_dist, n_iter=10,
    scoring='accuracy', n_jobs=-1, cv=5, verbose=1, random_state=42
)

search.fit(X_train_scaled, y_train_resampled)

# Evaluate and save
best_model = search.best_estimator_
y_pred = best_model.predict(X_test_scaled)
accuracy = accuracy_score(y_test, y_pred)

print(f"Model accuracy on test set: {accuracy:.4f}")
print("\nClassification Report:")
print(classification_report(y_test, y_pred, target_names=label_encoder.inverse_transform(np.unique(y_test))))

joblib.dump(best_model, os.path.join(MODEL_DIR, 'strategy_model.pkl'))