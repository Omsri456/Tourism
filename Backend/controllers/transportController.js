const Transport = require('../models/Transport');

// @desc    Get transport options
// @route   GET /api/transport
// @access  Public
const getTransports = async (req, res) => {
    try {
        const { origin, destination, mode } = req.query;
        let query = {};
        
        if (origin) query.origin = { $regex: origin, $options: 'i' };
        if (destination) query.destination = { $regex: destination, $options: 'i' };
        if (mode) query.modeOfTransport = mode;

        const transports = await Transport.find(query);
        res.json(transports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a transport route
// @route   POST /api/transport
// @access  Private/Admin
const createTransport = async (req, res) => {
    try {
        const transport = new Transport(req.body);
        const createdTransport = await transport.save();
        res.status(201).json(createdTransport);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getTransports,
    createTransport
};
