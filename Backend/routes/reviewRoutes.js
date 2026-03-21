const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware'); // Assuming this exists, common pattern

router.post('/', protect, reviewController.createReview);
router.get('/:targetId/:targetModel', reviewController.getTargetReviews);

module.exports = router;
