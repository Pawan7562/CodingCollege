const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a quiz title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  instructions: {
    type: String,
    maxlength: [1000, 'Instructions cannot be more than 1000 characters']
  },
  timeLimit: {
    type: Number, // in minutes
    required: [true, 'Please add time limit'],
    min: [1, 'Time limit must be at least 1 minute']
  },
  maxAttempts: {
    type: Number,
    default: 3,
    min: [1, 'Max attempts must be at least 1']
  },
  passingScore: {
    type: Number,
    required: [true, 'Please add passing score'],
    min: [0, 'Passing score cannot be negative']
  },
  questions: [{
    question: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['multiple-choice', 'true-false', 'short-answer', 'essay'],
      required: true
    },
    options: [{
      text: String,
      isCorrect: {
        type: Boolean,
        default: false
      }
    }],
    correctAnswer: String, // for short-answer and essay questions
    explanation: String,
    points: {
      type: Number,
      required: true,
      min: [1, 'Points must be at least 1']
    },
    order: {
      type: Number,
      required: true
    }
  }],
  attempts: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    startedAt: {
      type: Date,
      required: true
    },
    submittedAt: Date,
    timeTaken: Number, // in minutes
    answers: [{
      questionIndex: Number,
      answer: mongoose.Schema.Types.Mixed, // can be string, array, or object
      isCorrect: Boolean,
      points: Number
    }],
    score: {
      type: Number,
      min: 0
    },
    totalPoints: Number,
    percentage: Number,
    passed: Boolean,
    attemptNumber: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['in-progress', 'submitted', 'graded'],
      default: 'in-progress'
    }
  }],
  shuffleQuestions: {
    type: Boolean,
    default: false
  },
  shuffleOptions: {
    type: Boolean,
    default: false
  },
  showResults: {
    type: Boolean,
    default: true
  },
  showCorrectAnswers: {
    type: Boolean,
    default: true
  },
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

// Calculate quiz results
quizSchema.methods.calculateResults = function(attempt) {
  let totalScore = 0;
  let totalPoints = 0;
  
  attempt.answers.forEach(answer => {
    const question = this.questions[answer.questionIndex];
    if (question) {
      totalPoints += question.points;
      
      if (question.type === 'multiple-choice' || question.type === 'true-false') {
        const correctOptions = question.options.filter(opt => opt.isCorrect);
        const selectedOptions = Array.isArray(answer.answer) ? answer.answer : [answer.answer];
        
        let isCorrect = true;
        if (correctOptions.length !== selectedOptions.length) {
          isCorrect = false;
        } else {
          for (const option of selectedOptions) {
            const correctOption = correctOptions.find(opt => opt.text === option);
            if (!correctOption) {
              isCorrect = false;
              break;
            }
          }
        }
        
        answer.isCorrect = isCorrect;
        answer.points = isCorrect ? question.points : 0;
        totalScore += answer.points;
      } else if (question.type === 'short-answer') {
        const isCorrect = answer.answer && answer.answer.trim().toLowerCase() === 
                          question.correctAnswer.trim().toLowerCase();
        answer.isCorrect = isCorrect;
        answer.points = isCorrect ? question.points : 0;
        totalScore += answer.points;
      } else if (question.type === 'essay') {
        // Essay questions need manual grading
        answer.isCorrect = null;
        answer.points = 0;
      }
    }
  });
  
  attempt.score = totalScore;
  attempt.totalPoints = totalPoints;
  attempt.percentage = totalPoints > 0 ? (totalScore / totalPoints) * 100 : 0;
  attempt.passed = attempt.percentage >= this.passingScore;
};

// Update the updatedAt field on save
quizSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Quiz', quizSchema);
