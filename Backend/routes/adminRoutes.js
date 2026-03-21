const express = require('express');
const router = express.Router();
const { getPlatformStats } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// Admin stats route
router.get('/stats', protect, admin, getPlatformStats);

module.exports = router;
