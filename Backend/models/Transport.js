const mongoose = require('mongoose');

const transportSchema = new mongoose.Schema({
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    modeOfTransport: { 
        type: String, 
        required: true,
        enum: ['Bus', 'Train', 'Taxi/Cab', 'Auto-rickshaw', 'Other']
    },
    estimatedTime: { type: String },
    approximateCost: { type: Number },
    suggestedRoute: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Transport', transportSchema);
