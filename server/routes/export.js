// server/routes/export.js
const express = require('express');
const verifyJWT = require('../middleware/verifyJWT');
const roleGuard = require('../middleware/roleGuard');
const { generatePDF, generateSingleSubmissionPDF } = require('../utils/pdfGenerator');
const { generateTeacherExcel, generateConsolidatedExcel, generateSingleSubmissionExcel } = require('../utils/excelGenerator');
const User = require('../models/User');
const Submission = require('../models/Submission');
const Document = require('../models/Document');
const logAction = require('../utils/auditLogger');
const router = express.Router();

router.use(verifyJWT);

// ---- SPECIFIC routes FIRST (must come before /:userId) ----

// GET /api/export/consolidated
router.get('/consolidated', roleGuard('hod'), async (req, res) => {
    try {
        const teachers = await User.find({ role: 'teacher' });
        const submissions = await Submission.find();
        const documents = await Document.find();

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=NAAC_Consolidated_${new Date().toISOString().split('T')[0]}.xlsx`);

        await logAction({ user: req.user, action: 'EXPORT_CONSOLIDATED', target: 'All Teachers' });
        await generateConsolidatedExcel(teachers, submissions, documents, res);
    } catch (err) {
        console.error(err);
        if (!res.headersSent) res.status(500).json({ message: 'Server error during Consolidated Excel generation' });
    }
});

// GET /api/export/pdf/submission/:submissionId
router.get('/pdf/submission/:submissionId', async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.submissionId);
        if (!submission) return res.status(404).json({ message: 'Submission not found' });
        
        if (submission.userId.toString() !== req.user.id && req.user.role !== 'hod') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const user = await User.findById(submission.userId);
        const documents = await Document.find({ submissionId: submission._id });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=NAAC_Verified_C${submission.criterionId}_${submission.subCriterion}.pdf`);
        
        await logAction({ user: req.user, action: 'EXPORT_SINGLE_PDF', target: `Sub: ${submission.subCriterion}` });
        await generateSingleSubmissionPDF(submission, user, documents, res);
    } catch (err) {
        console.error(err);
        if (!res.headersSent) res.status(500).json({ message: 'Server error during PDF generation' });
    }
});

// GET /api/export/excel/submission/:submissionId
router.get('/excel/submission/:submissionId', async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.submissionId);
        if (!submission) return res.status(404).json({ message: 'Submission not found' });
        
        if (submission.userId.toString() !== req.user.id && req.user.role !== 'hod') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const user = await User.findById(submission.userId);
        const documents = await Document.find({ submissionId: submission._id });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=NAAC_Verified_C${submission.criterionId}_${submission.subCriterion}.xlsx`);

        await logAction({ user: req.user, action: 'EXPORT_SINGLE_EXCEL', target: `Sub: ${submission.subCriterion}` });
        await generateSingleSubmissionExcel(submission, user, documents, res);
    } catch (err) {
        console.error(err);
        if (!res.headersSent) res.status(500).json({ message: 'Server error during Excel generation' });
    }
});

// ---- GENERIC :userId routes LAST ----

// GET /api/export/pdf/:userId
router.get('/pdf/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        if (userId !== req.user.id && req.user.role !== 'hod') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const submissions = await Submission.find({ userId: user._id });
        const documents = await Document.find({ userId: user._id });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=NAAC_${user.name.replace(/\s+/g, '_')}.pdf`);
        
        await logAction({ user: req.user, action: 'EXPORT_PDF', target: user.name });
        await generatePDF(user, submissions, documents, res);
    } catch (err) {
        console.error("PDF Export Error:", err);
        if (!res.headersSent) res.status(500).json({ message: 'Server error during PDF generation', error: err.message });
    }
});

// GET /api/export/excel/:userId
router.get('/excel/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        if (userId !== req.user.id && req.user.role !== 'hod') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const submissions = await Submission.find({ userId: user._id });
        const documents = await Document.find({ userId: user._id });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=NAAC_${user.name.replace(/\s+/g, '_')}.xlsx`);

        await logAction({ user: req.user, action: 'EXPORT_EXCEL', target: user.name });
        await generateTeacherExcel(user, submissions, documents, res);
    } catch (err) {
        console.error("Excel Export Error:", err);
        if (!res.headersSent) res.status(500).json({ message: 'Server error during Excel generation', error: err.message });
    }
});

module.exports = router;
