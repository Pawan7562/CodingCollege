const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { protect } = require('../middleware/auth');
const { uploadPDF } = require('../middleware/upload');
const { submitAssignment, gradeAssignment } = require('../controllers/assignmentController');

router.post('/:id/submit', protect, uploadPDF.single('file'), asyncHandler(submitAssignment));
router.put('/:id/grade', protect, asyncHandler(gradeAssignment));

module.exports = router;
