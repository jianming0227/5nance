
// routes/strategyRoutes.js

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Load InputForm model (or import from your main file if modularized)
const FinancialProfile = require("../models/FinancialProfile");
const Strategy = require("../models/Strategy");

// GET /api/strategies - Fetch all strategies from MongoDB
router.get('/strategies', async (req, res) => {
  try {
    const strategies = await Strategy.find({});
    console.log("✅ Strategies fetched from DB:", strategies);
    res.json(strategies);
  } catch (err) {
    console.error('❌ Error fetching strategies:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
