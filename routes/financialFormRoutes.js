const express = require("express")
const router = express.Router()
const FinancialProfile = require("../models/FinancialProfile") // Your Mongoose model

// POST /api/input_form
router.post("/input_form", async (req, res) => {
  try {
    const {
      employment_status,
      monthly_income,
      monthly_expenses,
      goal_types,
      target_amount,
      target_duration,
      risk_tolerance,
      investment_experience,
      savings_investment,
      existing_loans,
      financial_discipline,
      submitted_at,
    } = req.body

    const newProfile = new FinancialProfile({
      employment_status,
      monthly_income,
      monthly_expenses,
      goal_types,
      target_amount,
      target_duration,
      risk_tolerance,
      investment_experience,
      savings_investment,
      existing_loans,
      financial_discipline,
      submitted_at,
      // optionally: user: req.user._id  ← if tracking user login
    })

    await newProfile.save()
    res.status(201).json({ message: "Financial profile submitted successfully." })
  } catch (err) {
    console.error("Error saving profile:", err)
    res.status(500).json({ message: "Failed to save profile." })
  }
})

module.exports = router