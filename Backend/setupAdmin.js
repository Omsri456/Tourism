require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');

const makeAdmin = async () => {
    try {
        await connectDB();
        
        const existingAdmin = await User.findOne({ email: 'admin@tourism.com' });
        
        if (existingAdmin) {
            existingAdmin.role = 'Admin';
            await existingAdmin.save();
            console.log('✅ Updated existing admin@tourism.com to Admin role');
        } else {
            const adminUser = await User.create({
                name: 'System Admin',
                email: 'admin@tourism.com',
                password: 'adminpassword123',
                role: 'Admin'
            });
            console.log('✅ Created new Admin account: admin@tourism.com / adminpassword123');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

makeAdmin();
