const express = require('express');
const router = express.Router();
const { getAccommodations, getAccommodationById, createAccommodation } = require('../controllers/accommodationController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
    .get(getAccommodations)
    .post(protect, admin, upload.single('image'), createAccommodation);

router.route('/:id')
    .get(getAccommodationById);

module.exports = router;
