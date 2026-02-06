const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true, required: true },
  name: { type: String, trim: true, required: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
});

module.exports = mongoose.model('User', userSchema);
