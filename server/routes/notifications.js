// server/routes/notifications.js
const express = require('express');
const verifyJWT = require('../middleware/verifyJWT');
const Notification = require('../models/Notification');
const router = express.Router();

router.use(verifyJWT);

// GET /api/notifications/
router.get('/', async (req, res) => {
    try {
        const notifications = await Notification.find({ toUserId: req.user.id }).sort({ createdAt: -1 });
        const unread = notifications.filter(n => !n.isRead).length;
        res.json({ unread, notifications });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// PATCH /api/notifications/:id/read
router.patch('/:id/read', async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) return res.status(404).json({ message: 'Not found' });
        if (notification.toUserId.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
        
        notification.isRead = true;
        await notification.save();
        res.json(notification);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// PATCH /api/notifications/read-all
router.patch('/read-all', async (req, res) => {
    try {
        await Notification.updateMany({ toUserId: req.user.id, isRead: false }, { isRead: true });
        res.json({ message: 'All notifications marked as read' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
