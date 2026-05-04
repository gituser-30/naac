// server/routes/criteria.js
const express = require('express');
const Submission = require('../models/Submission');
const verifyJWT = require('../middleware/verifyJWT');
const logAction = require('../utils/auditLogger');
const router = express.Router();

router.use(verifyJWT);

// GET /api/criteria/progress
router.get('/progress', async (req, res) => {
    try {
        const submissions = await Submission.find({ userId: req.user.id });
        const progress = {};
        for(let i=1; i<=7; i++) {
            const cSubs = submissions.filter(s => s.criterionId === i);
            progress[i] = {
                total: cSubs.length,
                verified: cSubs.filter(s => s.status === 'verified').length,
                submitted: cSubs.filter(s => s.status === 'submitted').length
            };
        }
        res.json(progress);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/criteria/:cId
router.get('/:cId', async (req, res) => {
    try {
        const submissions = await Submission.find({ 
            userId: req.user.id, 
            criterionId: req.params.cId 
        });
        res.json(submissions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/criteria/:cId/:subC
router.get('/:cId/:subC', async (req, res) => {
    try {
        const submission = await Submission.findOne({
            userId: req.user.id,
            criterionId: req.params.cId,
            subCriterion: req.params.subC
        });
        if (!submission) return res.json(null);
        res.json(submission);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/criteria/:cId/:subC
router.post('/:cId/:subC', async (req, res) => {
    try {
        const { formData, status, academicYear } = req.body;
        
        let submission = await Submission.findOne({
            userId: req.user.id,
            criterionId: req.params.cId,
            subCriterion: req.params.subC
        });

        if (submission) {
            if (submission.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
            if (submission.status === 'verified') return res.status(400).json({ message: 'Cannot edit verified submission' });
            
            submission.formData = formData || submission.formData;
            submission.status = status || submission.status;
            submission.academicYear = academicYear || submission.academicYear;
            await submission.save();
            await logAction({ user: req.user, action: 'UPDATE_SUBMISSION', target: `Criterion ${req.params.cId}.${req.params.subC}` });
        } else {
            submission = new Submission({
                userId: req.user.id,
                criterionId: req.params.cId,
                subCriterion: req.params.subC,
                formData, status, academicYear
            });
            await submission.save();
            await logAction({ user: req.user, action: 'CREATE_SUBMISSION', target: `Criterion ${req.params.cId}.${req.params.subC}` });
        }
        res.json(submission);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE /api/criteria/:cId/:subC
router.delete('/:cId/:subC', async (req, res) => {
    try {
        const submission = await Submission.findOne({
            userId: req.user.id,
            criterionId: req.params.cId,
            subCriterion: req.params.subC
        });
        if (!submission) return res.status(404).json({ message: 'Not found' });
        if (submission.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
        
        await Submission.deleteOne({ _id: submission._id });
        await logAction({ user: req.user, action: 'DELETE_SUBMISSION', target: `Criterion ${req.params.cId}.${req.params.subC}` });
        res.json({ message: 'Deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
