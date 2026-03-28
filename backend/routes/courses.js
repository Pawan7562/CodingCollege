const express = require('express');
<<<<<<< HEAD
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
=======
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { protect, isTeacherOrAdmin } = require('../middleware/auth');
const { uploadThumbnail, uploadVideo, uploadPDF } = require('../middleware/upload');
const {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  addLecture,
  updateLecture,
  deleteLecture,
  addReview,
  getProgress,
  updateProgress,
  getFeaturedCourses,
  getCategories
} = require('../controllers/courseController');
const { getAssignmentsByCourse, submitAssignment } = require('../controllers/assignmentController');
const { getQuizzesByCourse, submitQuiz } = require('../controllers/adminController');

router.get('/', asyncHandler(getAllCourses));
router.get('/featured', asyncHandler(getFeaturedCourses));
router.get('/categories', asyncHandler(getCategories));
router.get('/:id', asyncHandler(getCourseById));
router.post('/', protect, isTeacherOrAdmin, uploadThumbnail.single('thumbnail'), asyncHandler(createCourse));
router.put('/:id', protect, isTeacherOrAdmin, uploadThumbnail.single('thumbnail'), asyncHandler(updateCourse));
router.delete('/:id', protect, isTeacherOrAdmin, asyncHandler(deleteCourse));
router.post('/:id/lectures', protect, isTeacherOrAdmin, uploadVideo.single('video'), asyncHandler(addLecture));
router.put('/:id/lectures/:lectureId', protect, isTeacherOrAdmin, uploadVideo.single('video'), asyncHandler(updateLecture));
router.delete('/:id/lectures/:lectureId', protect, isTeacherOrAdmin, asyncHandler(deleteLecture));
router.post('/:id/reviews', protect, asyncHandler(addReview));
router.get('/:id/progress', protect, asyncHandler(getProgress));
router.put('/:id/progress', protect, asyncHandler(updateProgress));
router.get('/:courseId/assignments', protect, asyncHandler(getAssignmentsByCourse));
router.post('/assignments/:id/submit', protect, asyncHandler(submitAssignment));
router.get('/:courseId/quizzes', protect, asyncHandler(getQuizzesByCourse));
router.post('/quizzes/:quizId/submit', protect, asyncHandler(submitQuiz));
>>>>>>> efb84c1ad6217944445d6b2bf48b8ad3d0887842

module.exports = router;
