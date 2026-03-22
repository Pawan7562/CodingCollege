const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  duration: { type: Number, default: 30 },
  questions: [{
    question: { type: String, required: true },
    options: [String],
    correctAnswer: { type: Number, required: true },
    explanation: String,
    marks: { type: Number, default: 1 },
  }],
  totalMarks: { type: Number, default: 0 },
  passingMarks: { type: Number, default: 0 },
  attempts: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    answers: [Number],
    score: Number,
    percentage: Number,
    passed: Boolean,
    completedAt: { type: Date, default: Date.now },
  }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
