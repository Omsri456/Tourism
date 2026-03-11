const express = require('express');
const router = express.Router();
const { getAccommodations, getAccommodationById, createAccommodation } = require('../controllers/accommodationController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getAccommodations)
    .post(protect, admin, createAccommodation);

router.route('/:id')
    .get(getAccommodationById);

module.exports = router;
