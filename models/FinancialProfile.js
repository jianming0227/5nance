const mongoose = require("mongoose");
const { Schema } = mongoose;

const financialProfileSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // make optional for now
  },
  employment_status: String,
  monthly_income: String,
  monthly_expenses: String,
  goal_types: [String],
  target_amount: Number,
  target_duration: Number,
  risk_tolerance: String,
  investment_experience: String,
  savings_investment: String,
  existing_loans: String,
  financial_discipline: String,
  submitted_at: Date,
});

module.exports = mongoose.model("FinancialProfile", financialProfileSchema);
