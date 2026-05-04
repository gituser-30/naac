// server/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const verifyJWT = require('../middleware/verifyJWT');
const logAction = require('../utils/auditLogger');

const { sendEmail } = require('../utils/emailService');

const router = express.Router();

router.post('/register', [
  body('name').trim().notEmpty(),
  body('email').isEmail().normalizeEmail(),
  body('department').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { name, email, department, designation } = req.body;
    
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    // HOD registration is disabled via this route
    user = new User({
      name, email, department, designation,
      role: 'teacher',
      isActive: false,
      isVerified: false
    });

    await user.save();

    // Notify Admin/HOD
    await sendEmail({
      to: 'dbatuscholarhub@gmail.com',
      subject: 'New Teacher Registration Pending Approval',
      html: `
        <h3>New Teacher Registration</h3>
        <p>A new teacher has registered for the portal:</p>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Department:</strong> ${department}</li>
          <li><strong>Designation:</strong> ${designation || 'N/A'}</li>
        </ul>
        <p>Please login to the HOD Dashboard to verify and set a password for this user.</p>
      `
    });

    await logAction({ user: null, action: 'REGISTER_PENDING', target: email });
    
    res.status(201).json({ 
      message: 'Registration successful. Please wait for HOD to verify your account and send your password.',
      pending: true 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    
    if (!user.isVerified || !user.isActive) {
        return res.status(403).json({ 
            message: 'Your account is pending HOD approval. You will receive an email once verified.' 
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const payload = { id: user.id, role: user.role, name: user.name, department: user.department };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

    await logAction({ user: { id: user.id, name: user.name, role: user.role }, action: 'LOGIN', target: 'System' });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, department: user.department } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/me', verifyJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
