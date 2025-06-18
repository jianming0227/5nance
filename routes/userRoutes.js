const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Mongoose model
const FinancialProfile = require('../models/FinancialProfile');

// PUT /api/update-profile
router.put('/profile/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean(); // use lean() if you want plain object

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Fetch user profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/user/:id
router.delete('/user/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    // Delete user
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Delete related financial profiles
    await FinancialProfile.deleteMany({ user: userId });
    // Destroy session and clear cookie
    req.session.destroy(err => {
      res.clearCookie('connect.sid');
      if (err) {
        return res.status(500).json({ message: 'Account deleted, but failed to clear session.' });
      }
      // Respond with redirect instruction
      res.json({ message: 'Account deleted successfully', redirect: '/index.html' });
    });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;