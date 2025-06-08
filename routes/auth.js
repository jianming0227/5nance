const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const User = require("../models/user"); // Adjust path if needed
const bcrypt = require("bcrypt");

router.post('/signup', authController.signup);

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    res.json({ message: "Login successful", profile: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;