const express = require('express');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const {
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
} = require('../controllers/courses');

const router = express.Router();

// Public routes
router.get('/', optionalAuth, getCourses);
router.get('/:id', optionalAuth, getCourse);

// Protected routes
router.post('/:id/ratings', protect, addRating);
router.get('/enrolled/my-courses', protect, getEnrolledCourses);
router.get('/:id/content', protect, getCourseContent);

// Admin routes
router.post('/', protect, authorize('admin'), createCourse);
router.put('/:id', protect, authorize('admin'), updateCourse);
router.delete('/:id', protect, authorize('admin'), deleteCourse);

// Lesson management (Admin only)
router.post('/:id/lessons', protect, authorize('admin'), addLesson);
router.put('/:id/lessons/:lessonId', protect, authorize('admin'), updateLesson);
router.delete('/:id/lessons/:lessonId', protect, authorize('admin'), deleteLesson);

module.exports = router;
