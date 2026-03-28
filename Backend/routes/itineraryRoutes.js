const express = require('express');
const router = express.Router();
const itineraryController = require('../controllers/itineraryController');

// @route   POST /api/itinerary/generate
// @desc    Generate customized itinerary based on user input
// @access  Public
router.post('/generate', itineraryController.generateItinerary);

module.exports = router;
