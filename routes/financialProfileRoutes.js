const express = require('express');
const router = express.Router();
const FinancialProfile = require('../models/FinancialProfile');

router.get('/api/financial-profile/:userId', async (req, res) => {
  try {
    const profile = await FinancialProfile.findOne({ user: req.params.userId });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

