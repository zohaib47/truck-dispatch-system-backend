const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./src/models/Admin'); // Path check kar lena
require('dotenv').config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Purane admins ko delete karna (Optional, taake duplicate na ho)
    await Admin.deleteMany({ email: 'zohaib@admin.com' });

    // Naya Admin create karna
    const admin = new Admin({
      name: "zohaib Admin",
      email: "zohaib@admin.com",
      password: "123456", // Model ka pre-save hook isay hash kar dega
      role: "admin"
    });

    await admin.save();
    console.log("✅ Admin Seeded Successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding Error:", error);
    process.exit(1);
  }
};

seedAdmin();