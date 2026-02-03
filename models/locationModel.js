const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    contactNumber: { type: String, required: true },
    email: { type: String, lowercase: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Location', locationSchema);
