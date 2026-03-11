const express = require('express');
const router = express.Router();
const { getTransports, createTransport } = require('../controllers/transportController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getTransports)
    .post(protect, admin, createTransport);

module.exports = router;
