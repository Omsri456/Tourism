const express = require('express');
const router = express.Router();
const { getExperiences, getExperienceById, createExperience } = require('../controllers/experienceController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
    .get(getExperiences)
    .post(protect, upload.single('image'), createExperience); // Organizers can create with single image upload

router.route('/:id')
    .get(getExperienceById);

module.exports = router;
