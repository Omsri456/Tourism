const GuideProfile = require('../models/GuideProfile');

// @desc    Get all verified guides
// @route   GET /api/guides
// @access  Public
const getGuides = async (req, res) => {
    try {
        const { location, language } = req.query;
        let query = { isVerified: true }; // Only show verified guides to public by default
        
        if (location) query.location = { $regex: location, $options: 'i' };
        if (language) query.languagesSpoken = { $regex: language, $options: 'i' };

        const guides = await GuideProfile.find(query).populate('user', 'name email');
        res.json(guides);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single guide profile by ID
// @route   GET /api/guides/:id
// @access  Public
const getGuideById = async (req, res) => {
    try {
        const guide = await GuideProfile.findById(req.params.id)
            .populate('user', 'name email');
            
        if (guide) {
            res.json(guide);
        } else {
            res.status(404).json({ message: 'Guide not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create/Update current user's guide profile
// @route   POST /api/guides/profile
// @access  Private (Guide)
const upsertGuideProfile = async (req, res) => {
    try {
        // Find existing profile
        let profile = await GuideProfile.findOne({ user: req.user._id });
        
        const profileData = { ...req.body };
        if (req.file) {
            profileData.profileImage = `/uploads/${req.file.filename}`;
        }

        if (profile) {
            // Update
            profile = await GuideProfile.findOneAndUpdate(
                { user: req.user._id },
                { $set: profileData },
                { new: true }
            );
            return res.json(profile);
        }

        // Create
        profile = new GuideProfile({
            ...profileData,
            user: req.user._id,
        });
        await profile.save();
        res.status(201).json(profile);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getGuides,
    getGuideById,
    upsertGuideProfile
};
