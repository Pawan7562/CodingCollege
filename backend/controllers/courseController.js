const Course = require('../models/Course');
const Review = require('../models/Review');
const Progress = require('../models/Progress');
const User = require('../models/User');
const { cloudinary } = require('../middleware/upload');

exports.getAllCourses = async (req, res) => {
  const { search, category, level, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;
  const query = { isPublished: true };
  if (search) query.$text = { $search: search };
  if (category && category !== 'All') query.category = category;
  if (level && level !== 'All') query.level = level;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  let sortObj = {};
  if (sort === 'price_asc') sortObj = { price: 1 };
  else if (sort === 'price_desc') sortObj = { price: -1 };
  else if (sort === 'rating') sortObj = { ratings: -1 };
  else if (sort === 'newest') sortObj = { createdAt: -1 };
  else sortObj = { createdAt: -1 };

  const total = await Course.countDocuments(query);
  const courses = await Course.find(query)
    .sort(sortObj)
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .populate('instructor', 'name avatar')
    .select('-lectures.notes.code');
  res.json({ courses, total, pages: Math.ceil(total / limit), currentPage: Number(page) });
};

exports.getCourseById = async (req, res) => {
  const course = await Course.findById(req.params.id).populate('instructor', 'name avatar bio');
  if (!course) return res.status(404).json({ message: 'Course not found' });
  const reviews = await Review.find({ course: course._id })
    .populate('user', 'name avatar')
    .sort('-createdAt')
    .limit(20);
  res.json({ course, reviews });
};

exports.createCourse = async (req, res) => {
  const { title, description, shortDescription, price, originalPrice, category, level, language, tags, requirements, whatYouLearn } = req.body;
  const course = await Course.create({
    title, description, shortDescription, price, originalPrice, category, level, language,
    tags: tags ? JSON.parse(tags) : [],
    requirements: requirements ? JSON.parse(requirements) : [],
    whatYouLearn: whatYouLearn ? JSON.parse(whatYouLearn) : [],
    instructor: req.user._id,
    thumbnail: req.file ? req.file.path : '',
    thumbnailPublicId: req.file ? req.file.filename : '',
  });
  res.status(201).json(course);
};

exports.updateCourse = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  const { title, description, shortDescription, price, originalPrice, category, level, language, tags, requirements, whatYouLearn, isPublished, isFeatured } = req.body;
  if (title) course.title = title;
  if (description) course.description = description;
  if (shortDescription !== undefined) course.shortDescription = shortDescription;
  if (price !== undefined) course.price = price;
  if (originalPrice !== undefined) course.originalPrice = originalPrice;
  if (category) course.category = category;
  if (level) course.level = level;
  if (language) course.language = language;
  if (tags) course.tags = JSON.parse(tags);
  if (requirements) course.requirements = JSON.parse(requirements);
  if (whatYouLearn) course.whatYouLearn = JSON.parse(whatYouLearn);
  if (isPublished !== undefined) course.isPublished = isPublished === 'true' || isPublished === true;
  if (isFeatured !== undefined) course.isFeatured = isFeatured === 'true' || isFeatured === true;
  if (req.file) {
    if (course.thumbnailPublicId) await cloudinary.uploader.destroy(course.thumbnailPublicId);
    course.thumbnail = req.file.path;
    course.thumbnailPublicId = req.file.filename;
  }
  await course.save();
  res.json(course);
};

exports.deleteCourse = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  if (course.thumbnailPublicId) await cloudinary.uploader.destroy(course.thumbnailPublicId);
  await course.deleteOne();
  res.json({ message: 'Course deleted' });
};

exports.addLecture = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  const { title, description, codeNotes, explanationNotes, isFree, order } = req.body;
  const lecture = {
    title,
    description: description || '',
    videoUrl: req.file ? req.file.path : req.body.videoUrl || '',
    videoPublicId: req.file ? req.file.filename : '',
    isFree: isFree === 'true' || isFree === true,
    order: order || course.lectures.length + 1,
    notes: { code: codeNotes || '', explanation: explanationNotes || '', pdf: [] },
  };
  course.lectures.push(lecture);
  course.totalLectures = course.lectures.length;
  await course.save();
  res.status(201).json(course);
};

exports.updateLecture = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  const lecture = course.lectures.id(req.params.lectureId);
  if (!lecture) return res.status(404).json({ message: 'Lecture not found' });
  const { title, description, codeNotes, explanationNotes, isFree } = req.body;
  if (title) lecture.title = title;
  if (description) lecture.description = description;
  if (codeNotes !== undefined) lecture.notes.code = codeNotes;
  if (explanationNotes !== undefined) lecture.notes.explanation = explanationNotes;
  if (isFree !== undefined) lecture.isFree = isFree === 'true' || isFree === true;
  if (req.file) {
    if (lecture.videoPublicId) await cloudinary.uploader.destroy(lecture.videoPublicId, { resource_type: 'video' });
    lecture.videoUrl = req.file.path;
    lecture.videoPublicId = req.file.filename;
  }
  await course.save();
  res.json(course);
};

exports.deleteLecture = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  const lecture = course.lectures.id(req.params.lectureId);
  if (lecture && lecture.videoPublicId) await cloudinary.uploader.destroy(lecture.videoPublicId, { resource_type: 'video' });
  course.lectures.pull(req.params.lectureId);
  course.totalLectures = course.lectures.length;
  await course.save();
  res.json({ message: 'Lecture deleted' });
};

exports.addReview = async (req, res) => {
  const { rating, comment } = req.body;
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  const enrolled = await User.findOne({ _id: req.user._id, enrolledCourses: req.params.id });
  if (!enrolled) return res.status(403).json({ message: 'You must be enrolled to review' });
  const existingReview = await Review.findOne({ user: req.user._id, course: req.params.id });
  if (existingReview) return res.status(400).json({ message: 'You already reviewed this course' });
  const review = await Review.create({ user: req.user._id, course: req.params.id, rating, comment });
  const allReviews = await Review.find({ course: req.params.id });
  course.ratings = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;
  course.numReviews = allReviews.length;
  await course.save();
  await review.populate('user', 'name avatar');
  res.status(201).json(review);
};

exports.getProgress = async (req, res) => {
  const progress = await Progress.findOne({ user: req.user._id, course: req.params.id });
  res.json(progress || { completedLectures: [], progressPercentage: 0 });
};

exports.updateProgress = async (req, res) => {
  const { lectureId } = req.body;
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  let progress = await Progress.findOne({ user: req.user._id, course: req.params.id });
  if (!progress) progress = await Progress.create({ user: req.user._id, course: req.params.id, completedLectures: [] });
  if (!progress.completedLectures.map(id => id.toString()).includes(lectureId)) progress.completedLectures.push(lectureId);
  progress.lastWatched = lectureId;
  progress.progressPercentage = Math.round((progress.completedLectures.length / (course.totalLectures || 1)) * 100);
  if (progress.progressPercentage === 100 && !progress.completedAt) progress.completedAt = new Date();
  await progress.save();
  res.json(progress);
};

exports.getFeaturedCourses = async (req, res) => {
  const courses = await Course.find({ isPublished: true, isFeatured: true })
    .populate('instructor', 'name avatar')
    .limit(6);
  res.json(courses);
};

exports.getCategories = async (req, res) => {
  const categories = await Course.distinct('category', { isPublished: true });
  res.json(categories);
};
