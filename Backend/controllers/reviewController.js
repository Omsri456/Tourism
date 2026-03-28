const Review = require('../models/Review');
const GuideProfile = require('../models/GuideProfile');
const Accommodation = require('../models/Accommodation');
const CulturalExperience = require('../models/CulturalExperience');
const Destination = require('../models/Destination');
const Transport = require('../models/Transport');

const getModelByName = (modelName) => {
    switch(modelName) {
        case 'GuideProfile': return GuideProfile;
        case 'Accommodation': return Accommodation;
        case 'CulturalExperience': return CulturalExperience;
        case 'Destination': return Destination;
        case 'Transport': return Transport;
        default: return null;
    }
};

exports.createReview = async (req, res) => {
    try {
        const { targetId, targetModel, rating, comment } = req.body;
        const userId = req.user.id;

        const Model = getModelByName(targetModel);
        if (!Model) {
            return res.status(400).json({ message: 'Invalid target model' });
        }

        const targetEntity = await Model.findById(targetId);
        if (!targetEntity) {
            return res.status(404).json({ message: 'Target not found' });
        }

        // Check if user already reviewed this target
        const existingReview = await Review.findOne({ user: userId, targetId, targetModel });
        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this item' });
        }

        const review = new Review({
            user: userId,
            targetId,
            targetModel,
            rating,
            comment
        });

        await review.save();

        // Update target rating
        const allReviews = await Review.find({ targetId, targetModel });
        const avgRating = allReviews.reduce((acc, curr) => acc + curr.rating, 0) / allReviews.length;

        targetEntity.rating = Math.round(avgRating * 10) / 10;
        targetEntity.reviewsCount = allReviews.length;
        await targetEntity.save();

        res.status(201).json({ message: 'Review added successfully', review });
    } catch (error) {
        console.error('Create Review Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getTargetReviews = async (req, res) => {
    try {
        const { targetId, targetModel } = req.params;
        
        const reviews = await Review.find({ targetId, targetModel })
            .populate('user', 'name email profileImage')
            .sort({ createdAt: -1 });
            
        res.json(reviews);
    } catch (error) {
        console.error('Get Reviews Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
