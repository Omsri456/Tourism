const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
    targetModel: {
        type: String,
        required: true,
        enum: ['GuideProfile', 'Accommodation', 'CulturalExperience', 'Destination', 'Transport']
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
