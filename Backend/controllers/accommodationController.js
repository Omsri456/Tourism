const Accommodation = require('../models/Accommodation');

// @desc    Get accommodations
// @route   GET /api/accommodations
// @access  Public
const getAccommodations = async (req, res) => {
    try {
        const { type, location, minPrice, maxPrice } = req.query;
        let query = {};
        
        if (type) query.type = type;
        if (location) query.location = { $regex: location, $options: 'i' };
        if (minPrice || maxPrice) {
            query.pricePerNight = {};
            if (minPrice) query.pricePerNight.$gte = Number(minPrice);
            if (maxPrice) query.pricePerNight.$lte = Number(maxPrice);
        }

        const accommodations = await Accommodation.find(query);
        res.json(accommodations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single accommodation by ID
// @route   GET /api/accommodations/:id
// @access  Public
const getAccommodationById = async (req, res) => {
    try {
        const accommodation = await Accommodation.findById(req.params.id)
            .populate('nearbyDestinations', 'name category');
            
        if (accommodation) {
            res.json(accommodation);
        } else {
            res.status(404).json({ message: 'Accommodation not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create an accommodation
// @route   POST /api/accommodations
// @access  Private/Admin
const createAccommodation = async (req, res) => {
    try {
        const accommodation = new Accommodation(req.body);
        const createdAccommodation = await accommodation.save();
        res.status(201).json(createdAccommodation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getAccommodations,
    getAccommodationById,
    createAccommodation
};
