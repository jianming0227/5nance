import sys
import json
import joblib
import numpy as np
import pandas as pd
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load model artifacts
label_encoder = joblib.load(os.path.join(BASE_DIR, 'strategy_label_encoder.pkl'))
scaler = joblib.load(os.path.join(BASE_DIR, 'scaler.pkl'))
feature_columns = joblib.load(os.path.join(BASE_DIR, 'feature_columns.pkl'))
model = joblib.load(os.path.join(BASE_DIR, 'strategy_model.pkl'))

strategy_descriptions = {
    "Conservative Bonds": "Stable bond investments for capital preservation and steady income.",
    "Balanced Growth Portfolio": "A mix of index funds and bonds optimized for long-term growth.",
    "Stable Income": "Dividend-focused strategy for consistent income.",
    "Aggressive Stocks": "High-growth stock portfolio targeting maximum returns.",
    "Moderate Indexing": "Indexed fund strategy for balanced growth and risk.",
    "Crypto Risk Play": "A high-risk cryptocurrency strategy for aggressive investors."
}

def prepare_input(user_data):
    input_dict = dict.fromkeys(feature_columns, 0)

    for key, val in user_data.items():
        if isinstance(val, str):
            encoded_key = f"{key}_{val.strip().lower().replace(' ', '_').replace('>', '').replace('<', '')}"
            if encoded_key in input_dict:
                input_dict[encoded_key] = 1
        elif isinstance(val, (int, float)) and key in input_dict:
            input_dict[key] = val
        elif isinstance(val, list):
            for item in val:
                list_key = f"{key}_{item.strip().lower().replace(' ', '_')}"
                if list_key in input_dict:
                    input_dict[list_key] = 1

    df = pd.DataFrame([input_dict])
    return df.reindex(columns=feature_columns, fill_value=0)

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Usage: python predict.py <user_data.json>"}))
        return

    try:
        with open(sys.argv[1], 'r') as f:
            user_data = json.load(f)
    except Exception as e:
        print(json.dumps({"error": f"Failed to read or parse JSON file: {e}"}))
        return

    required_fields = ["risk_tolerance", "target_duration"]
    for field in required_fields:
        if field not in user_data:
            print(json.dumps({"error": f"Missing required field: {field}"}))
            return

    default_return_rates = {
        "low": 4.0,
        "moderate": 6.0,
        "high": 8.0
    }

    risk_key = user_data["risk_tolerance"].strip().lower()
    if "return_rate" in user_data:
        return_rate = float(str(user_data["return_rate"]).replace('%', ''))
    else:
        return_rate = default_return_rates.get(risk_key, 6.0)

    user_input = {
        "risk_tolerance": user_data["risk_tolerance"],
        "duration_years": float(user_data["target_duration"]),
        "return_rate": return_rate
    }
    user_input.update(user_data)

    X = prepare_input(user_input)
    X_scaled = scaler.transform(X)

    y_pred_encoded = model.predict(X_scaled)
    y_pred_label = label_encoder.inverse_transform(y_pred_encoded)[0]

    result = {
        "strategy_name": y_pred_label,
        "strategy_description": strategy_descriptions.get(y_pred_label, "No description available."),
        "risk_tolerance": user_input["risk_tolerance"],
        "duration_year": user_input["duration_years"],
        "return_rate": user_input["return_rate"]
    }

    print(json.dumps(result))

if __name__ == "__main__":
    main()
