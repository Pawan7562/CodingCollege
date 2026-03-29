const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  instructor: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  price: {
    type: Number,
    default: 0
  },
  thumbnail: String,
  category: String,
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  duration: Number,
  lessons: [{
    title: String,
    content: String,
    duration: Number,
    order: Number
  }],
  enrolledStudents: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  rating: {
    type: Number,
    default: 0
  },
  reviews: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    rating: Number,
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isPublished: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Course', courseSchema);
