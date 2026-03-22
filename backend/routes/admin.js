const express = require('express');
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

module.exports = router;
