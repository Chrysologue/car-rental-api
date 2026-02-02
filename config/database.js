import mongoose from "mongoose";

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log(`Connected to Database successfully`);
  } catch (error) {
    console.log(`Error : ${error.message}`);
  }
};

export { connectToDB };
