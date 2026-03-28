const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { protect, isAdmin } = require('../middleware/auth');
const {
  applyAsTeacher,
  getMyApplicationStatus,
  getTeacherApplications,
  approveTeacher,
  rejectTeacher,
} = require('../controllers/teacherController');

// Student routes (protected)
router.post('/apply', protect, asyncHandler(applyAsTeacher));
router.get('/my-status', protect, asyncHandler(getMyApplicationStatus));

// Admin routes
router.get('/applications', protect, isAdmin, asyncHandler(getTeacherApplications));
router.put('/applications/:id/approve', protect, isAdmin, asyncHandler(approveTeacher));
router.put('/applications/:id/reject', protect, isAdmin, asyncHandler(rejectTeacher));

module.exports = router;
