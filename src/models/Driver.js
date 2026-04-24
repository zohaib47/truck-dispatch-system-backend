const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const DriverSchema = new mongoose.Schema({

  // ── Basic Info ──
  fullName:    { type: String, required: true },         
  email:       { type: String, required: true , unique: true },
  phone:       { type: String, required: true },         
  cnicNumber:  { type: String, required: true, unique: true }, 
  password:    { type: String, required: true, select: false  },
  role:        { type: String, default: 'Driver' },       
  experience:  { type: Number, required: true },        
  vehicleType: { type: String,
    enum: ['Car', 'Small Truck', 'Large Truck'],       
    required: true,  },

  status: {
    type: String,
    enum: ['Available', 'On Trip', 'Off Duty'],
    default: 'Available',
  },

  // ── Live Location (map ke liye) ──
  currentLocation: {
    lat:         { type: Number, default: 0 },
    lng:         { type: Number, default: 0 },
    lastUpdated: { type: Date,   default: Date.now },
  },

  // ── Reference to User account (agar login karta hai) ──
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

// Driver Schema hashing without manual next() call
DriverSchema.pre('save', async function() {
  // Agar password change nahi hua to yahin se wapas chale jao
  if (!this.isModified('password')) return;

  try {
    // Admin ki tarah simple 10 rounds ke sath hash karein
    this.password = await bcrypt.hash(this.password, 10);
  } catch (error) {
    // Agar koi error aaye to console mein dikh jaye
    console.error("Driver Hashing Error:", error);
    throw error; // Mongoose is error ko handle kar lega
  }
});

module.exports = mongoose.model('Driver', DriverSchema);