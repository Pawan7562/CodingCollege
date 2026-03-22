const User = require('../models/User');
const Course = require('../models/Course');

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find({})
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments();

    res.status(200).json({
      success: true,
      data: users,
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

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('enrolledCourses', 'title thumbnail price')
      .populate('wishlist', 'title thumbnail price');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user (Admin only)
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
  try {
    const { name, email, role, avatar } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.remove();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Enroll in course
// @route   POST /api/users/enroll/:courseId
// @access  Private
const enrollCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.user.id;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user is already enrolled
    const user = await User.findById(userId);
    if (user.enrolledCourses.includes(courseId)) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course'
      });
    }

    // Add course to user's enrolled courses
    user.enrolledCourses.push(courseId);
    await user.save();

    // Add user to course's enrolled students
    course.enrolledStudents.push(userId);
    course.totalEnrollments += 1;
    await course.save();

    // Initialize progress for this course
    user.progress.push({
      course: courseId,
      completedLessons: [],
      completedAssignments: [],
      completedQuizzes: [],
      percentage: 0,
      lastAccessed: new Date()
    });
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Successfully enrolled in course'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add to wishlist
// @route   POST /api/users/wishlist/:courseId
// @access  Private
const addToWishlist = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.user.id;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if already in wishlist
    const user = await User.findById(userId);
    if (user.wishlist.includes(courseId)) {
      return res.status(400).json({
        success: false,
        message: 'Course already in wishlist'
      });
    }

    // Add to wishlist
    user.wishlist.push(courseId);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Course added to wishlist'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Remove from wishlist
// @route   DELETE /api/users/wishlist/:courseId
// @access  Private
const removeFromWishlist = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.user.id;

    const user = await User.findById(userId);

    // Remove from wishlist
    user.wishlist = user.wishlist.filter(id => id.toString() !== courseId);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Course removed from wishlist'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user progress
// @route   GET /api/users/progress/:courseId
// @access  Private
const getProgress = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.user.id;

    const user = await User.findById(userId).populate('progress.course');
    
    const progress = user.progress.find(p => p.course.toString() === courseId);

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Progress not found for this course'
      });
    }

    res.status(200).json({
      success: true,
      data: progress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update lesson progress
// @route   POST /api/users/progress/:courseId/lesson
// @access  Private
const updateLessonProgress = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const { lessonId } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    
    let progress = user.progress.find(p => p.course.toString() === courseId);
    
    if (!progress) {
      // Create new progress entry
      progress = {
        course: courseId,
        completedLessons: [lessonId],
        completedAssignments: [],
        completedQuizzes: [],
        percentage: 0,
        lastAccessed: new Date()
      };
      user.progress.push(progress);
    } else {
      // Add lesson to completed lessons if not already there
      if (!progress.completedLessons.includes(lessonId)) {
        progress.completedLessons.push(lessonId);
      }
      progress.lastAccessed = new Date();
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Lesson progress updated'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  enrollCourse,
  addToWishlist,
  removeFromWishlist,
  getProgress,
  updateLessonProgress
};
