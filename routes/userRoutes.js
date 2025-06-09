const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Mongoose model

// PUT /api/update-profile
router.put('/update-profile', async (req, res) => {
  const {
    _id, name, email, contact, dob, country, state, city
  } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        name,
        email,
        contact,
        dob,
        country,
        state,
        city
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({ message: 'Profile updated successfully.', user: updatedUser });
  } catch (err) {
    console.error('Update Error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

router.get('/get-current-user', async (req, res) => {
  try {
    // Replace with your actual session or token logic
    const userId = req.session.userId || req.user?.id; // Adapt based on your auth
    if (!userId) return res.status(401).json({ message: 'Not authenticated.' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    res.json(user);
  } catch (err) {
    console.error('Fetch Error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
