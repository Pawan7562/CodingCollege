const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
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
    type: mongoose.Schema.ObjectId,
    ref: 'Course'
  }],
  createdCourses: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Course'
  }],
  wishlist: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Course'
  }],
  progress: [{
    course: {
      type: mongoose.Schema.ObjectId,
      ref: 'Course'
    },
    completedLessons: [Number],
    percentage: {
      type: Number,
      default: 0
    },
    lastAccessed: {
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
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Encrypt password using bcrypt
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT access token
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Generate JWT refresh token
userSchema.methods.getRefreshToken = function() {
  const refreshToken = jwt.sign({ id: this._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE,
  });
  
  this.refreshTokens.push({ token: refreshToken });
  return refreshToken;
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
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  return verificationToken;
};

// Update last login
userSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  this.loginCount += 1;
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

// Cascade delete courses when user is deleted
userSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
  await this.constructor.model('Course').deleteMany({ instructor: this._id });
  next();
});

module.exports = mongoose.model('User', userSchema);
