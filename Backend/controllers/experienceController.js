const CulturalExperience = require('../models/CulturalExperience');

// @desc    Get all cultural experiences
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

// @desc    Get experiences created by the logged-in organizer
// @route   GET /api/experiences/mine
// @access  Private (Organizer/Admin)
const getMyExperiences = async (req, res) => {
    try {
        const experiences = await CulturalExperience.find({ organizer: req.user._id })
            .sort({ createdAt: -1 });
        res.json(experiences);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a cultural experience
// @route   POST /api/experiences
// @access  Private (Organizer/Admin)
const createExperience = async (req, res) => {
    try {
        const experienceData = {
            ...req.body,
            organizer: req.user._id,
            organizerInfo: {
                name: req.user.name,
                contact: req.user.email,
            }
        };
        
        // If an image was uploaded, add its path to the images array
        if (req.file) {
            experienceData.images = [`/uploads/${req.file.filename}`];
        }

        const experience = new CulturalExperience(experienceData);
        const createdExperience = await experience.save();
        res.status(201).json(createdExperience);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a cultural experience
// @route   PUT /api/experiences/:id
// @access  Private (Owner Organizer/Admin)
const updateExperience = async (req, res) => {
    try {
        const experience = await CulturalExperience.findById(req.params.id);

        if (!experience) {
            return res.status(404).json({ message: 'Experience not found' });
        }

        // Only the owner or an admin can update
        if (experience.organizer.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Not authorized to edit this experience' });
        }

        // Update fields from request body
        const { title, description, category, location, duration, price } = req.body;
        if (title)       experience.title = title;
        if (description) experience.description = description;
        if (category)    experience.category = category;
        if (location)    experience.location = location;
        if (duration)    experience.duration = duration;
        if (price)       experience.price = price;

        // If a new image was uploaded, replace the images array
        if (req.file) {
            experience.images = [`/uploads/${req.file.filename}`];
        }

        const updatedExperience = await experience.save();
        res.json(updatedExperience);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a cultural experience
// @route   DELETE /api/experiences/:id
// @access  Private (Owner Organizer/Admin)
const deleteExperience = async (req, res) => {
    try {
        const experience = await CulturalExperience.findById(req.params.id);

        if (!experience) {
            return res.status(404).json({ message: 'Experience not found' });
        }

        // Only the owner or an admin can delete
        if (experience.organizer.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Not authorized to delete this experience' });
        }

        await experience.deleteOne();
        res.json({ message: 'Experience deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getExperiences,
    getExperienceById,
    getMyExperiences,
    createExperience,
    updateExperience,
    deleteExperience,
};
