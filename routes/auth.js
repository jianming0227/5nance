const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const User = require("../models/user"); // Adjust path if needed
const bcrypt = require("bcrypt");

const INACTIVITY_LIMIT_MS = 60 * 1000; // 1 min inactivity
const GRACE_PERIOD_MS = 30 * 1000;      // 30 seconds to decide before full logout

function inactivityChecker(req, res, next) {
  if (req.session.user) {
    const now = Date.now();
    const last = req.session.lastActivity || now;

      if (req.session.timedOutAt) {
        // Session was marked inactive - check if grace period expired
        if (now - req.session.timedOutAt > GRACE_PERIOD_MS) {
          // Destroy session after grace period
          req.session.destroy(err => {
            if (err) console.error('Error destroying session:', err);
            res.clearCookie('connect.sid');
            return res.status(440).json({ message: 'Session fully expired after countdown' });
          });
          return;
        }
        return res.status(440).json({ message: 'Session inactive, countdown running' });
    } 
    
    if (now - last > INACTIVITY_LIMIT_MS) {
      // User was inactive, mark session as timed out
      req.session.timedOutAt = Date.now();
      return res.status(440).json({ message: 'Session marked as inactive, countdown started' });
    }

    // User is active, reset last activity timer
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
// router.use(['/profile', '/auth/session'], inactivityChecker); //testing

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

router.get('/auth/session', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');

  const now = Date.now();

  if (!req.session || !req.session.user) {
    return res.status(440).json({ message: 'Session expired or not found' });
  }

  if (req.session.timedOutAt) {
    const gracePassed = now - req.session.timedOutAt > GRACE_PERIOD_MS;
    if (gracePassed) {
      req.session.destroy(err => {
        if (err) console.error('Error destroying session:', err);
        res.clearCookie('connect.sid');
        return res.status(440).json({ message: 'Session fully expired after countdown' });
      });
    } else {
      // Grace period running: show session-timeout.html
      return res.status(200).json({ loggedIn: false, gracePeriod: true });
    }
    return;
  }

  // Active session
  return res.status(200).json({ loggedIn: true });
});


router.post('/auth/resume-session', (req, res) => {
  if (req.session && req.session.user && req.session.timedOutAt) {
    // Resume the session
    req.session.lastActivity = Date.now();
    delete req.session.timedOutAt; // clear grace period marker
    return res.json({ success: true });
  }
  res.json({ success: false });
});

// refresh activity
router.post('/auth/ping', (req, res) => {
  if (req.session && req.session.user && !req.session.timedOutAt) {
    req.session.lastActivity = Date.now();
    req.session.touch();
    return res.status(200).json({ message: 'Activity recorded' });
  }
  res.status(401).json({ message: 'Inactive or expired' });
});


// Profile
router.get('/profile', (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: 'Not authenticated' });
  res.json({ user: req.session.user });
});

module.exports = router;