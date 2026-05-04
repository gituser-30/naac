// server/models/Submission.js
const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  criterionId: {
    type: Number,
    required: true,
    min: 1,
    max: 7
  },
  subCriterion: {
    type: String,
    required: true
  },
  formData: {
    type: mongoose.Schema.Types.Mixed
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'verified', 'needs_revision'],
    default: 'draft'
  },
  academicYear: {
    type: String
  },
  hodComment: {
    type: String,
    default: ''
  }
}, { timestamps: true });

// Compound index for uniqueness
SubmissionSchema.index({ userId: 1, criterionId: 1, subCriterion: 1 }, { unique: true });

module.exports = mongoose.model('Submission', SubmissionSchema);
