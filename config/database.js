const mongoose = require("mongoose");

const connectToDB = async () => {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  try {
    await mongoose.connect(MONGODB_URI);

    console.log(`Connected to MongoDB: ${mongoose.connection.name}`);
    return mongoose.connection;
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    throw error;
  }
};

module.exports = { connectToDB };
