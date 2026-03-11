const express = require('express');
const router = express.Router();
const { getGuides, getGuideById, upsertGuideProfile } = require('../controllers/guideController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(getGuides);

router.route('/profile')
    .post(protect, upsertGuideProfile); // User must be authenticated to create a guide profile

router.route('/:id')
    .get(getGuideById);

module.exports = router;
