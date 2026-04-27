const mongoose = require('mongoose');

const connectDB = async () => {
  try {
   // Temporarily testing ke liye
const conn = await mongoose.connect("mongodb://zohaib_db_truck:ZohaibDB1122@ac-zljgiyr-shard-00-00.by2dn2j.mongodb.net:27017,ac-zljgiyr-shard-00-01.by2dn2j.mongodb.net:27017,ac-zljgiyr-shard-00-02.by2dn2j.mongodb.net:27017/?ssl=true&replicaSet=atlas-dj3o5l-shard-0&authSource=admin&appName=Cluster0");
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    console.log("mongodb connection failed", error)
    process.exit(1); // Agar connect na ho to app band ho jaye
  }
};

module.exports = connectDB;