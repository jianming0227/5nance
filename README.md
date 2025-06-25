# 💸 5NANCE – A Financial Planning Platform

5NANCE is a web application that empowers users to plan their financial goals with intelligent insights and tools. It includes investment goal setting, personalized strategy recommendations, and market analytics to help users make smarter financial decisions.

---

## 🚀 Features

- 🎯 **Goal-Based Investment Planning**
- 📊 **Investment Strategy Recommendation**
- 🌐 **Market Insight Dashboard**
- 🧮 **ROI/Investment Calculator**

📽️ **Walkthrough Video**: [Watch Here](https://drive.google.com/file/d/1_LAAf4tS5Iid-TYX5k3RHVXfcUNLUY7H/view?usp=sharing)

---

## 🛠 Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript
- Bootstrap 5

### Backend
- Node.js
- Express
- MongoDB Atlas
- Passport (Google OAuth)
- EmailJS, Nodemailer, Multer

### AI Investment Model (Python)
- XGBoost
- Pandas, NumPy
- Scikit-learn
- SMOTE (imbalanced-learn)
- Joblib

---

## ⚙️ Getting Started

### 📁 Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd frontend

cd backend
npm install
# Create a .env file with:
# MONGO_URI=your_mongodb_uri
node server.js

pip install pandas numpy scikit-learn xgboost imbalanced-learn joblib
# Use or train model and load with joblib

Contribution workflow
git clone https://github.com/jianming0227/5nance.git
cd 5nance
git checkout -b feature/your-feature
git add . && git commit -m "your message"
git push origin feature/your-feature
