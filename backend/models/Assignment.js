const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  dueDate: Date,
  maxMarks: { type: Number, default: 100 },
  submissions: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    answer: String,
    fileUrl: String,
    submittedAt: { type: Date, default: Date.now },
    marks: Number,
    feedback: String,
    status: { type: String, enum: ['submitted', 'graded'], default: 'submitted' },
  }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);
