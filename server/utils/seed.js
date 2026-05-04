// server/utils/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const seedHOD = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
        });

        const existingHOD = await User.findOne({ role: 'hod' });
        if (existingHOD) {
            console.log('HOD user already exists');
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash('hodpassword123', salt);

        const hodUser = new User({
            name: 'Principal HOD',
            email: 'hod@college.edu',
            password: hashedPassword,
            role: 'hod',
            department: 'Administration',
            designation: 'Head of Department'
        });

        await hodUser.save();
        console.log('HOD account created successfully: hod@college.edu / hodpassword123');
        process.exit(0);

    } catch (error) {
        console.error('Error seeding HOD:', error);
        process.exit(1);
    }
};

seedHOD();
