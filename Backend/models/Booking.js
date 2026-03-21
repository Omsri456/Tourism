const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    // Who booked
    tourist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // What was booked
    bookingType: {
        type: String,
        enum: ['experience', 'guide', 'accommodation'],
        required: true
    },
    experience: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CulturalExperience',
        default: null
    },
    guide: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GuideProfile',
        default: null
    },
    accommodation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Accommodation',
        default: null
    },
    // Booking details
    date: {
        type: Date,
        required: false
    },
    checkInDate: {
        type: Date,
        required: false
    },
    checkOutDate: {
        type: Date,
        required: false
    },
    numberOfPeople: {
        type: Number,
        required: true,
        min: 1
    },
    totalPrice: {
        type: Number,
        required: true
    },
    specialRequests: {
        type: String,
        default: ''
    },
    // Status managed by organizer/guide
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
