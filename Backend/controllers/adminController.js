const User = require('../models/User');
const Booking = require('../models/Booking');
const CulturalExperience = require('../models/CulturalExperience');
const Accommodation = require('../models/Accommodation');
const Transport = require('../models/Transport');
const Destination = require('../models/Destination');
const GuideProfile = require('../models/GuideProfile');

// @desc    Get complete platform statistics for Admin Dashboard
// @route   GET /api/admin/stats
// @access  Private (Admin only)
const getPlatformStats = async (req, res) => {
    try {
        const stats = {
            users: await User.countDocuments(),
            bookings: await Booking.countDocuments(),
            experiences: await CulturalExperience.countDocuments(),
            accommodations: await Accommodation.countDocuments(),
            transports: await Transport.countDocuments(),
            destinations: await Destination.countDocuments(),
            guides: await GuideProfile.countDocuments(),
            
            // Helpful breakdowns
            recentBookings: await Booking.find().sort({ createdAt: -1 }).limit(5)
                .populate('tourist', 'name')
                .populate('experience', 'title')
                .populate('guide', 'user')
        };
        
        // Calculate total confirmed revenue (assuming all completed bookings are paid)
        const confirmedBookings = await Booking.find({ status: 'confirmed' });
        stats.totalRevenue = confirmedBookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);
        
        // Count roles
        stats.userRoles = {
            tourists: await User.countDocuments({ role: 'Tourist' }),
            organizers: await User.countDocuments({ role: 'Organizer' }),
            guides: await User.countDocuments({ role: 'Guide' }),
            admins: await User.countDocuments({ role: 'Admin' })
        };

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getPlatformStats
};
