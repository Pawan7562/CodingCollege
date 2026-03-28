const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
<<<<<<< HEAD
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['student', 'instructor', 'admin'],
    default: 'student'
  },
  avatar: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot be more than 500 characters']
  },
  expertise: [{
    type: String
  }],
  socialLinks: {
    website: String,
    linkedin: String,
    twitter: String,
    github: String
  },
  enrolledCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  createdCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  cart: [{
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  refreshTokens: [{
    token: String,
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 604800 // 7 days
    }
  }],
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  lastLogin: Date,
  loginCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isBanned: {
    type: Boolean,
    default: false
  },
  banReason: String,
  preferences: {
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      }
    },
    language: {
      type: String,
      default: 'en'
    }
  },
  subscription: {
    type: {
      type: String,
      enum: ['free', 'premium', 'pro'],
      default: 'free'
    },
    startDate: Date,
    endDate: Date,
    status: {
      type: String,
      enum: ['active', 'cancelled', 'expired'],
      default: 'active'
    }
  }
}, {
  timestamps: true
});

// Encrypt password using bcrypt
userSchema.pre('save', async function(next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) {
    next();
  }

  // Hash password with cost of 12
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Generate refresh token
userSchema.methods.getRefreshToken = function() {
  const refreshToken = jwt.sign({ id: this._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE,
  });
  
  // Add refresh token to user's refreshTokens array
  this.refreshTokens.push({ token: refreshToken });
  return refreshToken;
};

// Add refresh token
userSchema.methods.addRefreshToken = function(token) {
  this.refreshTokens.push({ token });
};

// Remove refresh token
userSchema.methods.removeRefreshToken = function(token) {
  this.refreshTokens = this.refreshTokens.filter(rt => rt.token !== token);
};

// Clear all refresh tokens
userSchema.methods.clearRefreshTokens = function() {
  this.refreshTokens = [];
};

// Generate email verification token
userSchema.methods.getEmailVerificationToken = function() {
  const verificationToken = crypto.randomBytes(20).toString('hex');
  
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
  
  this.emailVerificationExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  return verificationToken;
};

// Update last login
userSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  this.loginCount += 1;
};

// Check if user is enrolled in course
userSchema.methods.isEnrolledInCourse = function(courseId) {
  return this.enrolledCourses.some(course => course.toString() === courseId.toString());
};

// Check if user is course creator
userSchema.methods.isCourseCreator = function(courseId) {
  return this.createdCourses.some(course => course.toString() === courseId.toString());
};

// Get user stats
userSchema.methods.getStats = function() {
  return {
    totalEnrollments: this.enrolledCourses.length,
    totalCreated: this.createdCourses.length,
    totalWishlist: this.wishlist.length,
    loginCount: this.loginCount,
    lastLogin: this.lastLogin
  };
};

// Generate reset password token
userSchema.methods.getResetPasswordToken = function() {
  const resetToken = crypto.randomBytes(20).toString('hex');

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Cascade delete courses when user is deleted
userSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
  await this.constructor.model('Course').deleteMany({ instructor: this._id });
  next();
});

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'refreshTokens.token': 1 });
userSchema.index({ createdAt: -1 });

const User = mongoose.model('User', userSchema);

module.exports = User;
=======

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, minlength: 6, default: '' },
  role:     { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
  avatar:   { type: String, default: '' },
  bio:      { type: String, default: '' },
  phone:    { type: String, default: '' },

  // OAuth
  googleId:     { type: String, default: '' },
  githubId:     { type: String, default: '' },
  authProvider: { type: String, enum: ['local', 'google', 'github'], default: 'local' },

  // Email verification
  isEmailVerified:   { type: Boolean, default: false },
  emailOTP:          { type: String, default: '' },
  emailOTPExpire:    { type: Date },

  // Phone verification
  isPhoneVerified: { type: Boolean, default: false },
  phoneOTP:        { type: String, default: '' },
  phoneOTPExpire:  { type: Date },

  // ── Teacher application ─────────────────────────────────────────────
  teacherApplication: {
    status:     { type: String, enum: ['none', 'pending', 'approved', 'rejected'], default: 'none' },
    expertise:  { type: String, default: '' },
    experience: { type: String, default: '' },
    linkedin:   { type: String, default: '' },
    github:     { type: String, default: '' },
    youtube:    { type: String, default: '' },
    website:    { type: String, default: '' },
    whyTeach:   { type: String, default: '' },
    appliedAt:  { type: Date },
    reviewedAt: { type: Date },
    rejectionReason: { type: String, default: '' },
  },

  // Enrolled / cart / wishlist
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  wishlist:        [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  cart:            [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  notifications: [{
    message:   String,
    read:      { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  }],
  resetPasswordToken:  String,
  resetPasswordExpire: Date,
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
>>>>>>> efb84c1ad6217944445d6b2bf48b8ad3d0887842
