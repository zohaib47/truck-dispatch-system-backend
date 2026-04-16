const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  licenseNumber: { type: String, required: true },
  truckType: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
  currentLocation: {
    lat: {
        type: Number,
        default: 0
    },
    lng: {
        type: Number,
        default: 0
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}
});

module.exports = mongoose.model('Driver', DriverSchema);