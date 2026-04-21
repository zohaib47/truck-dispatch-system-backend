const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    companyName: { type: String },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    vehicleCount: { type: String },
    message: { type: String },
    status: { type: String, default: 'New' }, // Admin track kar sakay
    createdAt: { 
        type: Date,
        default: Date.now,
        expires: 172800
         }
});

module.exports = mongoose.model('Contact', contactSchema);