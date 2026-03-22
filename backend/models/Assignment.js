const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add an assignment title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add an assignment description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  instructions: {
    type: String,
    required: [true, 'Please add assignment instructions']
  },
  attachments: [{
    name: String,
    url: String,
    type: {
      type: String,
      enum: ['pdf', 'image', 'video', 'document', 'other'],
      default: 'document'
    }
  }],
  maxScore: {
    type: Number,
    required: [true, 'Please add maximum score'],
    min: [1, 'Maximum score must be at least 1']
  },
  dueDate: {
    type: Date,
    required: [true, 'Please add a due date']
  },
  submissionType: {
    type: String,
    enum: ['file', 'text', 'link', 'code'],
    required: true
  },
  allowedFileTypes: [{
    type: String
  }],
  maxFileSize: {
    type: Number, // in MB
    default: 10
  },
  submissions: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    submittedAt: {
      type: Date,
      default: Date.now
    },
    isLate: {
      type: Boolean,
      default: false
    },
    content: {
      text: String,
      link: String,
      code: String,
      files: [{
        name: String,
        url: String,
        size: String
      }]
    },
    score: {
      type: Number,
      min: 0
    },
    feedback: {
      type: String,
      maxlength: [1000, 'Feedback cannot be more than 1000 characters']
    },
    gradedAt: Date,
    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['submitted', 'graded', 'returned'],
      default: 'submitted'
    }
  }],
  isPublished: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
assignmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Assignment', assignmentSchema);
