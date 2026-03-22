const mongoose = require('mongoose');

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

module.exports = mongoose.model('Course', courseSchema);
