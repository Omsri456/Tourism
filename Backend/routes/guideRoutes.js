const express = require('express');
const router = express.Router();
const { getGuides, getGuideById, getGuideProfile, upsertGuideProfile } = require('../controllers/guideController');
const { protect, isGuide } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
    .get(getGuides);

router.route('/profile')
    .get(protect, isGuide, getGuideProfile)
    .post(protect, isGuide, upload.single('profileImage'), upsertGuideProfile); // Only Guides can manage profiles

router.route('/:id')
    .get(getGuideById);

module.exports = router;
