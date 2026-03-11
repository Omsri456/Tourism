const express = require('express');
const router = express.Router();
const { getExperiences, getExperienceById, createExperience } = require('../controllers/experienceController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(getExperiences)
    .post(protect, createExperience); // Organizers can create

router.route('/:id')
    .get(getExperienceById);

module.exports = router;
