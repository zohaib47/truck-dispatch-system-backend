const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({

  // ── Basic Info ──
  fullName:    { type: String, required: true },          // Poora naam
  phone:       { type: String, required: true },          // Phone number
  cnicNumber:  { type: String, required: true, unique: true }, // ID Card number (13 digits)

  // ── Role ──
  role:        { type: String, default: 'Driver' },       // Hamesha "Driver" rahega

  // ── Experience ──
  experience:  { type: Number, required: true },          // Years mein (e.g. 5)

  // ── Vehicle Type ──
  vehicleType: {
    type: String,
    enum: ['Car', 'Small Truck', 'Large Truck'],          // Sirf yeh 3 options
    required: true,
  },

  // ── Status ──
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

module.exports = mongoose.model('Driver', DriverSchema);