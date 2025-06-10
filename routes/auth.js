const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const User = require("../models/user"); // Adjust path if needed
const bcrypt = require("bcrypt");

// Inactivity middleware
// const INACTIVITY_LIMIT_MS = 30 * 60 * 1000; // 30 minutes
const INACTIVITY_LIMIT_MS = 60 * 1000; // 1 minute(testing)
function inactivityChecker(req, res, next) {
  if (req.session.user) {
    const now = Date.now();
    const last = req.session.lastActivity || now;
    if (now - last > INACTIVITY_LIMIT_MS) {
      // expired: destroy session and clear cookie
      return req.session.destroy(err => {
        if (err) console.error('Error destroying session:', err);
        res.clearCookie('connect.sid');
        // send login timeout status to client
        return res.status(440).json({ message: 'Session expired due to inactivity' });
      });
    }
    req.session.lastActivity = now;
  }
  next();
}

// Signup
router.post('/signup', authController.signup);

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // set session
    req.session.user = { _id: user._id, email: user.email, name: user.name };
    req.session.lastActivity = Date.now();
    res.json({ message: 'Login successful', profile: req.session.user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Protected endpoints with inactivity check
router.use(['/logout', '/profile', '/auth/session'], inactivityChecker);

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
});

// Profile
router.get('/profile', (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: 'Not authenticated' });
  res.json({ user: req.session.user });
});

// Session status
router.get('/auth/session', (req, res) => {
  if (req.session.user) return res.json({ loggedIn: true });
  res.json({ loggedIn: false });
});

module.exports = router;