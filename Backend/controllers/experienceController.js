const CulturalExperience = require('../models/CulturalExperience');

// @desc    Get cultural experiences
// @route   GET /api/experiences
// @access  Public
const getExperiences = async (req, res) => {
    try {
        const { category, location } = req.query;
        let query = {};
        
        if (category) query.category = category;
        if (location) query.location = { $regex: location, $options: 'i' };

        const experiences = await CulturalExperience.find(query).populate('organizer', 'name');
        res.json(experiences);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single cultural experience by ID
// @route   GET /api/experiences/:id
// @access  Public
const getExperienceById = async (req, res) => {
    try {
        const experience = await CulturalExperience.findById(req.params.id)
            .populate('organizer', 'name email');
            
        if (experience) {
            res.json(experience);
        } else {
            res.status(404).json({ message: 'Experience not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a cultural experience
// @route   POST /api/experiences
// @access  Private (Organizer/Admin)
const createExperience = async (req, res) => {
    try {
        const experience = new CulturalExperience({
            ...req.body,
            organizer: req.user._id
        });
        const createdExperience = await experience.save();
        res.status(201).json(createdExperience);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getExperiences,
    getExperienceById,
    createExperience
};
