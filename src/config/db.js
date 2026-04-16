const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    console.log("mongodb connection failed", error)
    process.exit(1); // Agar connect na ho to app band ho jaye
  }
};

module.exports = connectDB;