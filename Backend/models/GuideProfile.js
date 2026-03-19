const mongoose = require('mongoose');

const guideProfileSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    location: { type: String, required: true },
    languagesSpoken: [{ type: String }],
    yearsOfExperience: { type: Number, required: true },
    areasOfExpertise: [{ type: String }],
    isVerified: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    contactInfo: {
        phone: String,
        email: String
    },
    bio: { type: String },
    pricePerDay: { type: Number, default: 500 }
}, { timestamps: true });

module.exports = mongoose.model('GuideProfile', guideProfileSchema);
