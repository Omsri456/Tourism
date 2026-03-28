const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// @route   POST /api/chat
// @desc    Handle AI queries
// @access  Public
router.post('/', chatController.handleChat);

module.exports = router;
