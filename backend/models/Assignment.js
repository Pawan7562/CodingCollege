const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  course: {
    type: mongoose.Schema.ObjectId,
    ref: 'Course',
    required: true
  },
  instructor: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  dueDate: Date,
  submissions: [{
    student: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    content: String,
    submittedAt: {
      type: Date,
      default: Date.now
    },
    grade: Number,
    feedback: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Assignment', assignmentSchema);
