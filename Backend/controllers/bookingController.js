const Booking = require('../models/Booking');
const CulturalExperience = require('../models/CulturalExperience');
const GuideProfile = require('../models/GuideProfile');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (Tourist/Guide — not Organizer)
const createBooking = async (req, res) => {
    try {
        const { bookingType, experienceId, guideId, date, numberOfPeople, specialRequests } = req.body;

        let totalPrice = 0;
        let bookingData = {
            tourist: req.user._id,
            bookingType,
            date,
            numberOfPeople: Number(numberOfPeople),
            specialRequests: specialRequests || '',
        };

        if (bookingType === 'experience') {
            if (!experienceId) return res.status(400).json({ message: 'Experience ID is required' });
            const experience = await CulturalExperience.findById(experienceId);
            if (!experience) return res.status(404).json({ message: 'Experience not found' });

            totalPrice = experience.price * Number(numberOfPeople);
            bookingData.experience = experienceId;
        } else if (bookingType === 'guide') {
            if (!guideId) return res.status(400).json({ message: 'Guide ID is required' });
            const guide = await GuideProfile.findById(guideId);
            if (!guide) return res.status(404).json({ message: 'Guide not found' });
            
            totalPrice = Number(numberOfPeople) * (guide.pricePerDay || 500);
            bookingData.guide = guideId;
        } else {
            return res.status(400).json({ message: 'Invalid booking type' });
        }

        bookingData.totalPrice = totalPrice;

        const booking = await Booking.create(bookingData);
        res.status(201).json(booking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all bookings made by the logged-in tourist
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ tourist: req.user._id })
            .populate('experience', 'title location images price duration')
            .populate({
                path: 'guide',
                populate: { path: 'user', select: 'name' }
            })
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all bookings for the organizer's experiences
// @route   GET /api/bookings/organizer
// @access  Private (Organizer)
const getOrganizerBookings = async (req, res) => {
    try {
        // Find all experiences owned by this organizer
        const myExperienceIds = await CulturalExperience
            .find({ organizer: req.user._id })
            .select('_id');

        const ids = myExperienceIds.map(e => e._id);

        const bookings = await Booking.find({ experience: { $in: ids } })
            .populate('tourist', 'name email')
            .populate('experience', 'title location price')
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all bookings for the guide
// @route   GET /api/bookings/guide
// @access  Private (Guide)
const getGuideBookings = async (req, res) => {
    try {
        const guideProfile = await GuideProfile.findOne({ user: req.user._id });
        if (!guideProfile) {
            return res.status(404).json({ message: 'Guide profile not found' });
        }

        const bookings = await Booking.find({ guide: guideProfile._id })
            .populate('tourist', 'name email')
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update booking status (confirm / cancel)
// @route   PUT /api/bookings/:id/status
// @access  Private (Organizer)
const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!['confirmed', 'cancelled'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const booking = await Booking.findById(req.params.id).populate('experience').populate('guide');
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        // Verify authorization based on booking type
        if (booking.bookingType === 'experience') {
            if (!booking.experience || booking.experience.organizer.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to update this booking' });
            }
        } else if (booking.bookingType === 'guide') {
            if (!booking.guide || booking.guide.user.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to update this booking' });
            }
        }

        booking.status = status;
        await booking.save();
        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createBooking, getMyBookings, getOrganizerBookings, getGuideBookings, updateBookingStatus };
