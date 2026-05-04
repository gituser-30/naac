// server/routes/upload.js
const express = require('express');
const { cloudinary, upload } = require('../config/cloudinary');
const Document = require('../models/Document');
const Submission = require('../models/Submission');
const verifyJWT = require('../middleware/verifyJWT');
const logAction = require('../utils/auditLogger');
const router = express.Router();

router.use(verifyJWT);

// POST /api/upload/:criterionId
router.post('/:criterionId', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
        
        const { submissionId, subCriterion } = req.body;
        if (!submissionId || !subCriterion) return res.status(400).json({ message: 'Missing submission info' });

        const submission = await Submission.findById(submissionId);
        if (!submission) return res.status(404).json({ message: 'Submission not found' });
        if (submission.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

        const newDoc = new Document({
            submissionId,
            userId: req.user.id,
            criterionId: req.params.criterionId,
            subCriterion,
            originalName: req.file.originalname,
            cloudinaryPublicId: req.file.filename,
            cloudinaryUrl: req.file.path,
            mimeType: req.file.mimetype,
            size: req.file.size
        });

        await newDoc.save();
        await logAction({ user: req.user, action: 'UPLOAD_FILE', target: req.file.originalname });

        res.json({ url: newDoc.cloudinaryUrl, document: newDoc });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error during upload' });
    }
});

// GET /api/upload/list/:submissionId
router.get('/list/:submissionId', async (req, res) => {
    try {
        const documents = await Document.find({ submissionId: req.params.submissionId });
        if (documents.length > 0 && documents[0].userId.toString() !== req.user.id && req.user.role !== 'hod') {
            return res.status(403).json({ message: 'Forbidden' });
        }
        res.json(documents);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE /api/upload/file/:docId
router.delete('/file/:docId', async (req, res) => {
    try {
        const document = await Document.findById(req.params.docId);
        if (!document) return res.status(404).json({ message: 'Document not found' });
        
        if (document.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

        await cloudinary.uploader.destroy(document.cloudinaryPublicId);
        await Document.findByIdAndDelete(document._id);
        
        await logAction({ user: req.user, action: 'DELETE_FILE', target: document.originalName });
        res.json({ message: 'File deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/upload/file/:docId
router.get('/file/:docId', async (req, res) => {
    try {
        const document = await Document.findById(req.params.docId);
        if (!document) return res.status(404).json({ message: 'Document not found' });
        
        if (document.userId.toString() !== req.user.id && req.user.role !== 'hod') {
            return res.status(403).json({ message: 'Forbidden' });
        }
        
        res.json({ url: document.cloudinaryUrl });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
