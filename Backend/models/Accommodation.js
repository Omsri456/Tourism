const mongoose = require('mongoose');

const accommodationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { 
        type: String, 
        required: true,
        enum: ['Hotel', 'Resort', 'Guest House', 'Homestay', 'Eco-lodge', 'Tribal Homestay', 'Other']
    },
    location: { type: String, required: true },
    pricePerNight: { type: Number, required: true },
    images: [{ type: String }],
    facilities: [{ type: String }],
    contactInfo: {
        phone: String,
        email: String,
        website: String
    },
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    nearbyDestinations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Destination' }]
}, { timestamps: true });

module.exports = mongoose.model('Accommodation', accommodationSchema);
