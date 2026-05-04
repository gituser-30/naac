// server/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: false, // HOD will set this later
    select: false
  },
  role: {
    type: String,
    enum: ['teacher', 'hod'],
    default: 'teacher'
  },
  department: {
    type: String,
    required: true
  },
  designation: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: false // Account disabled until HOD approval
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
