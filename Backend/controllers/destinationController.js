const Destination = require('../models/Destination');

// @desc    Get all destinations
// @route   GET /api/destinations
// @access  Public
const getDestinations = async (req, res) => {
    try {
        const { category, search } = req.query;
        let query = {};
        
        if (category) {
            query.category = category;
        }
        
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const destinations = await Destination.find(query);
        res.json(destinations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single destination by ID
// @route   GET /api/destinations/:id
// @access  Public
const getDestinationById = async (req, res) => {
    try {
        const destination = await Destination.findById(req.params.id)
            .populate('nearbyAttractions', 'name images');
            
        if (destination) {
            res.json(destination);
        } else {
            res.status(404).json({ message: 'Destination not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a destination
// @route   POST /api/destinations
// @access  Private/Admin
const createDestination = async (req, res) => {
    try {
        const destination = new Destination(req.body);
        const createdDestination = await destination.save();
        res.status(201).json(createdDestination);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getDestinations,
    getDestinationById,
    createDestination
};
