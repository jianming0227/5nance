const mongoose = require('mongoose');
const express = require("express")
const router = express.Router()
const FinancialProfile = require("../models/FinancialProfile") // Your Mongoose model

// POST /api/input_form
router.post("/input_form", async (req, res) => {
  console.log("Request body:", req.body);
  try {
    const {
      userId,
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

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid or missing User ID." });
    }

    const newProfile = new FinancialProfile({
      user: userId,

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