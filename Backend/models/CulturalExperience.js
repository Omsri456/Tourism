const mongoose = require('mongoose');

const culturalExperienceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
        type: String,
        required: true,
        enum: ['Tribal dance', 'Local food tour', 'Craft workshop', 'Village tourism', 'Other']
    },
    location: { type: String, required: true },
    duration: { type: String, required: true },
    price: { type: Number, required: true },
    organizerInfo: {
        name: { type: String, required: true },
        contact: { type: String, required: true }
    },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    images: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('CulturalExperience', culturalExperienceSchema);
