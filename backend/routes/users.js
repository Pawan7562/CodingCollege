const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  enrollCourse,
  addToWishlist,
  removeFromWishlist,
  getProgress,
  updateLessonProgress
} = require('../controllers/users');

const router = express.Router();

// Admin routes
router.route('/')
  .get(protect, authorize('admin'), getUsers);

router.route('/:id')
  .get(protect, authorize('admin'), getUser)
  .put(protect, authorize('admin'), updateUser)
  .delete(protect, authorize('admin'), deleteUser);

// Student routes
router.post('/enroll/:courseId', protect, enrollCourse);
router.post('/wishlist/:courseId', protect, addToWishlist);
router.delete('/wishlist/:courseId', protect, removeFromWishlist);
router.get('/progress/:courseId', protect, getProgress);
router.post('/progress/:courseId/lesson', protect, updateLessonProgress);

module.exports = router;
