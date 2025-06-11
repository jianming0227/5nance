const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Mongoose model

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

// router.get('/get-current-user', async (req, res) => {
//   try {
//     // Replace with your actual session or token logic
//     const userId = localStorage.getItem("userId"); // Adapt based on your auth
//     if (!userId) return res.status(401).json({ message: 'Not authenticated.' });

//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ message: 'User not found.' });

//     res.json(user);
//   } catch (err) {
//     console.error('Fetch Error:', err);
//     res.status(500).json({ message: 'Server error.' });
//   }
// });

// //viewProfile
// // GET /api/user/:id - Get user profile by ID
// router.get('/profile/:id', async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     res.json(user); // send the whole user document
//   } catch (err) {
//     console.error("Fetch user profile error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// //editProfile (PUT /api/profile/:id)
// router.get('/profile/:id', async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id).lean();

//     if (!user) return res.status(404).json({ message: 'User not found' });

//     res.json(user);
//   } catch (err) {
//     console.error('Error fetching user:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

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


module.exports = router;