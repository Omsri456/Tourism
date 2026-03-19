const express = require('express');
const router = express.Router();
const {
    createBooking,
    getMyBookings,
    getOrganizerBookings,
    getGuideBookings,
    updateBookingStatus
} = require('../controllers/bookingController');
const { protect, isOrganizer, isGuide, canBookExperience } = require('../middleware/authMiddleware');

// Tourist creates a booking (not Organizers — they host, not book)
router.post('/', protect, canBookExperience, createBooking);

// Tourist views their own bookings
router.get('/my', protect, getMyBookings);

// Organizer views bookings for their experiences
router.get('/organizer', protect, isOrganizer, getOrganizerBookings);

// Guide views bookings for their profile
router.get('/guide', protect, isGuide, getGuideBookings);

// Organizer or Guide confirms or cancels a booking
router.put('/:id/status', protect, updateBookingStatus);

module.exports = router;
