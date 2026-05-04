// server/routes/hod.js
const express = require('express');
const verifyJWT = require('../middleware/verifyJWT');
const roleGuard = require('../middleware/roleGuard');
const User = require('../models/User');
const Submission = require('../models/Submission');
const Document = require('../models/Document');
const AuditLog = require('../models/AuditLog');
const Notification = require('../models/Notification');
const logAction = require('../utils/auditLogger');
const bcrypt = require('bcryptjs');
const { sendEmail } = require('../utils/emailService');
const router = express.Router();

router.use(verifyJWT);
router.use(roleGuard('hod'));

// GET /api/hod/pending-teachers
router.get('/pending-teachers', async (req, res) => {
    try {
        const pending = await User.find({ role: 'teacher', isVerified: false });
        res.json(pending);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/hod/verify-teacher/:uid
router.post('/verify-teacher/:uid', async (req, res) => {
    try {
        const { password } = req.body;
        if (!password) return res.status(400).json({ message: 'Password is required' });

        const teacher = await User.findById(req.params.uid);
        if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

        const salt = await bcrypt.genSalt(12);
        teacher.password = await bcrypt.hash(password, salt);
        teacher.isVerified = true;
        teacher.isActive = true;
        await teacher.save();

        // Send email to teacher
        await sendEmail({
            to: teacher.email,
            subject: 'Account Verified - NAAC Portal Credentials',
            html: `
                <h3>Account Verified</h3>
                <p>Hello ${teacher.name}, your account on the NAAC Documentation Portal has been verified by the HOD.</p>
                <p>You can now login using the following credentials:</p>
                <ul>
                    <li><strong>Email:</strong> ${teacher.email}</li>
                    <li><strong>Password:</strong> ${password}</li>
                </ul>
                <p>Please change your password after your first login.</p>
                <p><a href="${process.env.CLIENT_URL}/login">Login Now</a></p>
            `
        });

        await logAction({ user: req.user, action: 'VERIFY_TEACHER', target: teacher.email });
        res.json({ message: 'Teacher verified and email sent.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/hod/teachers
router.get('/teachers', async (req, res) => {
    try {
        const teachers = await User.find({ role: 'teacher' }).select('-password');
        const submissions = await Submission.find();
        
        const teacherData = teachers.map(t => {
            const tSubs = submissions.filter(s => s.userId.toString() === t._id.toString());
            let c1c7 = {};
            for(let i=1; i<=7; i++) {
                const c = tSubs.filter(s => s.criterionId === i);
                if(c.length === 0) c1c7[`c${i}`] = 'draft';
                else if(c.some(s => s.status === 'verified')) c1c7[`c${i}`] = 'verified';
                else if(c.some(s => s.status === 'needs_revision')) c1c7[`c${i}`] = 'needs_revision';
                else if(c.some(s => s.status === 'submitted')) c1c7[`c${i}`] = 'submitted';
                else c1c7[`c${i}`] = 'draft';
            }
            return { ...t.toObject(), progress: c1c7 };
        });
        
        res.json(teacherData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/hod/teacher/:uid
router.get('/teacher/:uid', async (req, res) => {
    try {
        const user = await User.findById(req.params.uid).select('-password');
        if (!user) return res.status(404).json({ message: 'Teacher not found' });
        
        const submissions = await Submission.find({ userId: req.params.uid });
        const documents = await Document.find({ userId: req.params.uid });
        
        res.json({ user, submissions, documents });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// PATCH /api/hod/verify/:submissionId
router.patch('/verify/:submissionId', async (req, res) => {
    try {
        const { status, comment } = req.body;
        const submission = await Submission.findById(req.params.submissionId);
        if (!submission) return res.status(404).json({ message: 'Submission not found' });
        
        submission.status = status;
        submission.hodComment = comment || '';
        await submission.save();

        await logAction({ user: req.user, action: 'VERIFY', target: `Submission ${submission._id}` });
        
        // Notify Teacher
        const notif = new Notification({
            toUserId: submission.userId,
            fromUserId: req.user.id,
            message: `Your submission for C${submission.criterionId}.${submission.subCriterion} was marked as ${status}.`
        });
        await notif.save();

        res.json(submission);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/hod/notify/:teacherId
router.post('/notify/:teacherId', async (req, res) => {
    try {
        const { message } = req.body;
        const teacher = await User.findById(req.params.teacherId);
        if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

        const notif = new Notification({
            toUserId: teacher._id,
            fromUserId: req.user.id,
            message
        });
        await notif.save();
        
        await logAction({ user: req.user, action: 'NOTIFY', target: teacher.name });
        res.json(notif);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/hod/auditlog
router.get('/auditlog', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const total = await AuditLog.countDocuments();
        const logs = await AuditLog.find().sort({ timestamp: -1 }).skip(skip).limit(limit);

        res.json({ logs, total, page, pages: Math.ceil(total / limit) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// PATCH /api/hod/teacher/:uid/toggle
router.patch('/teacher/:uid/toggle', async (req, res) => {
    try {
        const user = await User.findById(req.params.uid);
        if (!user) return res.status(404).json({ message: 'Teacher not found' });
        
        user.isActive = !user.isActive;
        await user.save();
        
        await logAction({ user: req.user, action: 'TOGGLE_ACCOUNT', target: user.name });
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
