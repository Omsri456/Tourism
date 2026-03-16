require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Booking = require('./models/Booking');
const connectDB = require('./config/db');

const checkDB = async () => {
    await connectDB();
    const users = await User.find({}, 'name email role');
    console.log("--- USERS ---");
    console.log(users);
    
    const bookings = await Booking.find({}).populate('tourist', 'name').lean();
    console.log("\n--- BOOKINGS ---");
    console.log(bookings);
    
    process.exit();
};

checkDB();
