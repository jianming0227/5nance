const User = require('../models/user');
const bcrypt = require("bcrypt");


exports.signup = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10); // 10 salt rounds

    const { name, email, password, contact, country, state, city, dob, avatar } = req.body;

    // Optional: Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      contact,
      country,
      state,
      city,
      dob,
      avatar
    });

    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
