const express = require('express');
const router = express.Router();
const { getGuides, getGuideById, upsertGuideProfile } = require('../controllers/guideController');
const { protect, isGuide } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
    .get(getGuides);

router.route('/profile')
    .post(protect, isGuide, upload.single('profileImage'), upsertGuideProfile); // Only Guides can manage profiles

router.route('/:id')
    .get(getGuideById);

module.exports = router;
