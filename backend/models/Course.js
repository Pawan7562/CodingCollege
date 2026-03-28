const mongoose = require('mongoose');

<<<<<<< HEAD
const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a course title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a course description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'Short description cannot be more than 200 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please add a course price'],
    min: [0, 'Price cannot be negative']
  },
  discountedPrice: {
    type: Number,
    min: [0, 'Discounted price cannot be negative']
  },
  thumbnail: {
    type: String,
    required: [true, 'Please add a course thumbnail']
  },
  previewVideo: {
    type: String
  },
  category: {
    type: String,
    required: [true, 'Please add a course category'],
    enum: [
      'Web Development',
      'Mobile Development',
      'Data Science',
      'Machine Learning',
      'Artificial Intelligence',
      'Cloud Computing',
      'DevOps',
      'Cybersecurity',
      'Blockchain',
      'Game Development',
      'UI/UX Design',
      'Digital Marketing',
      'Business',
      'Photography',
      'Music',
      'Other'
    ]
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  language: {
    type: String,
    default: 'English'
  },
  duration: {
    type: Number, // in hours
    required: [true, 'Please add course duration']
  },
  lessons: [{
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    videoUrl: {
      type: String,
      required: true
    },
    duration: {
      type: Number, // in minutes
      required: true
    },
    order: {
      type: Number,
      required: true
    },
    isPreview: {
      type: Boolean,
      default: false
    },
    resources: [{
      name: String,
      url: String,
      type: {
        type: String,
        enum: ['pdf', 'code', 'link', 'image'],
        default: 'pdf'
      }
    }]
  }],
  notes: {
    pdfNotes: [{
      title: String,
      url: String,
      size: String
    }],
    codeNotes: [{
      title: String,
      content: String,
      language: String
    }],
    explanationNotes: [{
      title: String,
      content: String
    }]
  },
  requirements: [{
    type: String
  }],
  whatYouWillLearn: [{
    type: String
  }],
  instructor: {
    name: {
      type: String,
      required: true
    },
    bio: {
      type: String
    },
    avatar: {
      type: String
    },
    experience: String
  },
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    review: {
      type: String,
      maxlength: [500, 'Review cannot be more than 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  totalEnrollments: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate average rating
courseSchema.methods.calculateAverageRating = function() {
  if (this.ratings.length === 0) {
    this.averageRating = 0;
    this.totalReviews = 0;
    return;
  }
  
  const sum = this.ratings.reduce((acc, rating) => acc + rating.rating, 0);
  this.averageRating = sum / this.ratings.length;
  this.totalReviews = this.ratings.length;
};

// Update the updatedAt field on save
courseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});
=======
const lectureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  videoUrl: String,
  videoPublicId: String,
  duration: Number,
  order: Number,
  notes: {
    pdf: [{ name: String, url: String, publicId: String }],
    code: { type: String, default: '' },
    explanation: { type: String, default: '' },
  },
  isFree: { type: Boolean, default: false },
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  shortDescription: { type: String, default: '' },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  thumbnail: { type: String, default: '' },
  thumbnailPublicId: String,
  price: { type: Number, required: true, default: 0 },
  originalPrice: { type: Number, default: 0 },
  category: { type: String, required: true },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  language: { type: String, default: 'English' },
  tags: [String],
  lectures: [lectureSchema],
  requirements: [String],
  whatYouLearn: [String],
  enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  ratings: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  totalDuration: { type: Number, default: 0 },
  totalLectures: { type: Number, default: 0 },
}, { timestamps: true });

courseSchema.index({ title: 'text', description: 'text', tags: 'text' });
>>>>>>> efb84c1ad6217944445d6b2bf48b8ad3d0887842

module.exports = mongoose.model('Course', courseSchema);
