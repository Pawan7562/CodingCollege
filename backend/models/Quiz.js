const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  course: {
    type: mongoose.Schema.ObjectId,
    ref: 'Course',
    required: true
  },
  questions: [{
    question: {
      type: String,
      required: true
    },
    options: [{
      type: String,
      required: true
    }],
    correctAnswer: {
      type: Number,
      required: true
    }
  }],
  timeLimit: Number, // in minutes
  passingScore: {
    type: Number,
    default: 70
  },
  attempts: [{
    student: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    answers: [Number],
    score: Number,
    passed: Boolean,
    submittedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Quiz', quizSchema);
