const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  contact: String,
  dob: String,
  country: String,
  state: String,
  city: String,
  avatar: String,
});

module.exports = mongoose.model('User', userSchema);