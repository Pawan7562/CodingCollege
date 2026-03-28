const express = require('express');
<<<<<<< HEAD
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Placeholder routes - will be implemented later
router.get('/dashboard', protect, authorize('admin'), (req, res) => {
  res.json({ message: 'Admin dashboard - to be implemented' });
});
=======
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { protect, isAdmin } = require('../middleware/auth');
const {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllCourses,
  getAllOrders,
  createQuiz,
  sendNotificationToAll
} = require('../controllers/adminController');
const { createAssignment, getAllAssignments, gradeAssignment } = require('../controllers/assignmentController');

router.use(protect, isAdmin);
router.get('/stats', asyncHandler(getDashboardStats));
router.get('/users', asyncHandler(getAllUsers));
router.put('/users/:id/role', asyncHandler(updateUserRole));
router.delete('/users/:id', asyncHandler(deleteUser));
router.get('/courses', asyncHandler(getAllCourses));
router.get('/orders', asyncHandler(getAllOrders));
router.post('/assignments', asyncHandler(createAssignment));
router.get('/assignments', asyncHandler(getAllAssignments));
router.put('/assignments/:id/grade', asyncHandler(gradeAssignment));
router.post('/quizzes', asyncHandler(createQuiz));
router.post('/notifications', asyncHandler(sendNotificationToAll));
>>>>>>> efb84c1ad6217944445d6b2bf48b8ad3d0887842

module.exports = router;
