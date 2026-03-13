const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret');
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

// Only Organizers and Admins can create experiences
const isOrganizer = (req, res, next) => {
    if (req.user && (req.user.role === 'Organizer' || req.user.role === 'Admin')) {
        next();
    } else {
        res.status(403).json({ message: 'Access denied: Only Organizers can create experiences' });
    }
};

// Only Guides and Admins can manage guide profiles
const isGuide = (req, res, next) => {
    if (req.user && (req.user.role === 'Guide' || req.user.role === 'Admin')) {
        next();
    } else {
        res.status(403).json({ message: 'Access denied: Only Guides can manage guide profiles' });
    }
};

// Tourists and Guides can book experiences; Organizers cannot
const canBookExperience = (req, res, next) => {
    if (req.user && (req.user.role === 'Tourist' || req.user.role === 'Guide' || req.user.role === 'Admin')) {
        next();
    } else {
        res.status(403).json({ message: 'Access denied: Organizers cannot book experiences they host' });
    }
};

// Tourists and Organizers can book guides; Guides cannot book other guides
const canBookGuide = (req, res, next) => {
    if (req.user && (req.user.role === 'Tourist' || req.user.role === 'Organizer' || req.user.role === 'Admin')) {
        next();
    } else {
        res.status(403).json({ message: 'Access denied: Guides cannot book other guides' });
    }
};

module.exports = { protect, admin, isOrganizer, isGuide, canBookExperience, canBookGuide };

