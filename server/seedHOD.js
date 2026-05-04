// server/seedHOD.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const seedHOD = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    const email = 'dbatuscholorhub@gmail.com';
    const password = 'hodpassword123'; // The user can change this later

    // Check if HOD already exists
    let hod = await User.findOne({ email });

    if (hod) {
      console.log('HOD user already exists. Updating role to hod...');
      hod.role = 'hod';
      hod.isActive = true;
      hod.isVerified = true;
      await hod.save();
    } else {
      console.log('Creating new HOD user...');
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);

      hod = new User({
        name: 'Head of Department',
        email: email,
        password: hashedPassword,
        role: 'hod',
        department: 'Computer Engineering', // Default department
        isActive: true,
        isVerified: true
      });

      await hod.save();
      console.log('HOD user created successfully!');
    }

    console.log('---------------------------');
    console.log(`Login Email: ${email}`);
    console.log(`Login Password: ${password}`);
    console.log('---------------------------');

    process.exit(0);
  } catch (err) {
    console.error('Error seeding HOD:', err);
    process.exit(1);
  }
};

seedHOD();
