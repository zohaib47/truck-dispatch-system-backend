const mongoose = require('mongoose');

const truckSchema = new mongoose.Schema({
    truckName: { 
        type: String, 
        required: true, 
        trim: true 
    },
    plateNumber: { 
        type: String, 
        required: true, 
        unique: true, 
        uppercase: true 
    },
    truckType: {
        type: String,
        required: true,
        enum: ['Mini Truck', 'Small Truck', 'Medium Truck', 'Heavy Duty (22 Wheeler)', 'Trailer'],
    },
    capacity: {
        value: { type: Number, required: true }, // Weight kitna utha sakta hai
        unit: { type: String, default: 'tons' }
    },
    ownerName: { 
        type: String, 
        default: 'Company Owned' 
    },
    status: {
        type: String,
        enum: ['Available', 'On Trip', 'Maintenance'],
        default: 'Available'
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Kis admin ne add kiya
    }
}, { timestamps: true });

module.exports = mongoose.model('Truck', truckSchema);