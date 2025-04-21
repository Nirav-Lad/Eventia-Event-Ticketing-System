const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); // to use the variables from .env

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/event-ticketing-app');
    console.log('MongoDB Connected...');
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
