const express = require('express');
const router = express.Router();
const { getGuides, getGuideById, upsertGuideProfile } = require('../controllers/guideController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
    .get(getGuides);

router.route('/profile')
    .post(protect, upload.single('profileImage'), upsertGuideProfile); // User must be authenticated to create a guide profile, can upload profileImage

router.route('/:id')
    .get(getGuideById);

module.exports = router;
