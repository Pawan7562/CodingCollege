const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
