const mongoose = require('mongoose');
require('dotenv').config();

const connectToDB = async function () {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Successfully connected to MongoDB Atlas');
  } catch (e) {
    console.log('Failed to connect to MongoDB Atlas', e);
  }
};

module.exports = { connectToDB };
