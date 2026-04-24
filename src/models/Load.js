const mongoose = require('mongoose');

const LoadSchema = new mongoose.Schema({
  title: { type: String, required: true },
  admin: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  assignedTo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' // Driver ki User ID
  },
  pickupLocation: { type: String, required: true },
  dropLocation: { type: String, required: true },
  weight: { type: String },
  truckType: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'assigned', 'picked-up', 'completed'], 
    default: 'pending' 
  },
  price: { type: Number },
  quoteAmount: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Load', LoadSchema);