// models/Strategy.js

const mongoose = require("mongoose");

const strategySchema = new mongoose.Schema({
  strategy_name: String,
  risk_level: String,
  duration_years: Number,
  return_rate: Number,
  strategy_description: String,
});

module.exports = mongoose.model("Strategy", strategySchema);

