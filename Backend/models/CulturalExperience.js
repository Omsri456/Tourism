const mongoose = require('mongoose');

const culturalExperienceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
        type: String,
        required: true,
        enum: ['Cultural Music', 'Traditional Dance', 'Tribal Crafts', 'Local Cuisine', 'Festivals', 'Tribal dance', 'Local food tour', 'Craft workshop', 'Village tourism', 'Other']
    },
    location: { type: String, required: true },
    duration: { type: String, required: true },
    price: { type: Number, required: true },
    organizerInfo: {
        name: { type: String },
        contact: { type: String }
    },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    images: [{ type: String }],
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('CulturalExperience', culturalExperienceSchema);
