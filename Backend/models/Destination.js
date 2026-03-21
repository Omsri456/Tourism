const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { 
        type: String, 
        required: true,
        enum: ['Nature tourism', 'Waterfalls', 'Wildlife and national parks', 'Tribal culture and heritage', 'Adventure tourism', 'Other']
    },
    locationCoords: {
        lat: { type: Number },
        lng: { type: Number }
    },
    bestTimeToVisit: { type: String },
    entryFee: { type: String, default: 'Free' },
    images: [{ type: String }],
    nearbyAttractions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Destination' }],
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Destination', destinationSchema);
