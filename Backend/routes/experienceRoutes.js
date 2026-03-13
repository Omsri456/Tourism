const express = require('express');
const router = express.Router();
const {
    getExperiences,
    getExperienceById,
    getMyExperiences,
    createExperience,
    updateExperience,
    deleteExperience,
} = require('../controllers/experienceController');
const { protect, isOrganizer } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes
router.route('/')
    .get(getExperiences)
    .post(protect, isOrganizer, upload.single('image'), createExperience);

// Organizer-only: get own experiences (must be before /:id)
router.get('/mine', protect, isOrganizer, getMyExperiences);

// Public: get by ID | Protected: update and delete (owner only)
router.route('/:id')
    .get(getExperienceById)
    .put(protect, isOrganizer, upload.single('image'), updateExperience)
    .delete(protect, isOrganizer, deleteExperience);

module.exports = router;
