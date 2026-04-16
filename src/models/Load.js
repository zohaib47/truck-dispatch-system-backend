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
    ref: 'User' 
  },

  pickupLocation: { type: String, required: true },
  dropLocation: { type: String, required: true },
  weight: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'assigned', 'dispatched', 'delivered'], 
    default: 'pending' 
  },
  assignedTo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' // Driver ki ID yahan ayegi
  },
  quoteAmount: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Load', LoadSchema);