const Course = require('../models/Course');
const Assignment = require('../models/Assignment');
const Quiz = require('../models/Quiz');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
  try {
    let query = {};
    
    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }
    
    // Filter by level
    if (req.query.level) {
      query.level = req.query.level;
    }
    
    // Search by title or description
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    // Only show published courses for public access
    if (!req.user || req.user.role !== 'admin') {
      query.isPublished = true;
    }
    
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Sorting
    let sort = {};
    if (req.query.sort) {
      const sortField = req.query.sort;
      sort[sortField] = req.query.order === 'desc' ? -1 : 1;
    } else {
      sort.createdAt = -1;
    }
    
    const courses = await Course.find(query)
      .populate('instructor', 'name avatar')
      .skip(skip)
      .limit(limit)
      .sort(sort);
    
    const total = await Course.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: courses,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name avatar bio experience')
      .populate('ratings.user', 'name avatar');
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    // Check if course is published (unless user is admin)
    if (!course.isPublished && (!req.user || req.user.role !== 'admin')) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create course
// @route   POST /api/courses
// @access  Private/Admin
const createCourse = async (req, res) => {
  try {
    const courseData = req.body;
    
    const course = await Course.create(courseData);
    
    res.status(201).json({
      success: true,
      data: course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Admin
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: updatedCourse
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    // Delete related assignments and quizzes
    await Assignment.deleteMany({ course: req.params.id });
    await Quiz.deleteMany({ course: req.params.id });
    
    await course.remove();
    
    res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add lesson to course
// @route   POST /api/courses/:id/lessons
// @access  Private/Admin
const addLesson = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    const lesson = req.body;
    
    // Set order if not provided
    if (!lesson.order) {
      lesson.order = course.lessons.length + 1;
    }
    
    course.lessons.push(lesson);
    await course.save();
    
    res.status(200).json({
      success: true,
      data: course.lessons[course.lessons.length - 1]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update lesson
// @route   PUT /api/courses/:id/lessons/:lessonId
// @access  Private/Admin
const updateLesson = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    const lesson = course.lessons.id(req.params.lessonId);
    
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }
    
    Object.assign(lesson, req.body);
    await course.save();
    
    res.status(200).json({
      success: true,
      data: lesson
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete lesson
// @route   DELETE /api/courses/:id/lessons/:lessonId
// @access  Private/Admin
const deleteLesson = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    course.lessons.pull(req.params.lessonId);
    await course.save();
    
    res.status(200).json({
      success: true,
      message: 'Lesson deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add rating to course
// @route   POST /api/courses/:id/ratings
// @access  Private
const addRating = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const courseId = req.params.id;
    const userId = req.user.id;
    
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    // Check if user is enrolled
    if (!course.enrolledStudents.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'You must be enrolled to rate this course'
      });
    }
    
    // Check if user has already rated
    const existingRating = course.ratings.find(r => r.user.toString() === userId);
    
    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
      existingRating.review = review;
    } else {
      // Add new rating
      course.ratings.push({
        user: userId,
        rating,
        review
      });
    }
    
    // Calculate average rating
    course.calculateAverageRating();
    await course.save();
    
    res.status(200).json({
      success: true,
      message: 'Rating added successfully',
      data: {
        averageRating: course.averageRating,
        totalReviews: course.totalReviews
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get enrolled courses
// @route   GET /api/courses/enrolled
// @access  Private
const getEnrolledCourses = async (req, res) => {
  try {
    const user = await req.user.populate({
      path: 'enrolledCourses',
      populate: {
        path: 'instructor',
        select: 'name avatar'
      }
    });
    
    res.status(200).json({
      success: true,
      data: user.enrolledCourses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get course content (for enrolled students)
// @route   GET /api/courses/:id/content
// @access  Private
const getCourseContent = async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user.id;
    
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    // Check if user is enrolled or is admin
    if (!course.enrolledStudents.includes(userId) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You must be enrolled to access course content'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        lessons: course.lessons,
        notes: course.notes
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  addLesson,
  updateLesson,
  deleteLesson,
  addRating,
  getEnrolledCourses,
  getCourseContent
};
