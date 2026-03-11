const express = require('express');
const router = express.Router();
const { getDestinations, getDestinationById, createDestination } = require('../controllers/destinationController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getDestinations)
    .post(protect, admin, createDestination);

router.route('/:id')
    .get(getDestinationById);

module.exports = router;
