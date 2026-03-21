require('dotenv').config({ path: './Backend/.env' });
const mongoose = require('mongoose');
const User = require('./Backend/models/User');
const connectDB = require('./Backend/config/db');

const makeAdmin = async () => {
    try {
        await connectDB();
        
        // Let's create a default admin or promote an existing user
        // We will create a fresh admin account that you can always use
        const existingAdmin = await User.findOne({ email: 'admin@tourism.com' });
        
        if (existingAdmin) {
            existingAdmin.role = 'Admin';
            await existingAdmin.save();
            console.log('✅ Updated existing admin@tourism.com to Admin role');
        } else {
            const adminUser = await User.create({
                name: 'System Admin',
                email: 'admin@tourism.com',
                password: 'adminpassword123', // Will be hashed automatically by the model
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
