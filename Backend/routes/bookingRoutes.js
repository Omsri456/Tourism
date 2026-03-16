const express = require('express');
const router = express.Router();
const {
    createBooking,
    getMyBookings,
    getOrganizerBookings,
    updateBookingStatus
} = require('../controllers/bookingController');
const { protect, isOrganizer, canBookExperience } = require('../middleware/authMiddleware');

// Tourist creates a booking (not Organizers — they host, not book)
router.post('/', protect, canBookExperience, createBooking);

// Tourist views their own bookings
router.get('/my', protect, getMyBookings);

// Organizer views bookings for their experiences
router.get('/organizer', protect, isOrganizer, getOrganizerBookings);

// Organizer confirms or cancels a booking
router.put('/:id/status', protect, isOrganizer, updateBookingStatus);

module.exports = router;
