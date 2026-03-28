const express = require('express');
<<<<<<< HEAD
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Placeholder routes - will be implemented later
router.get('/', protect, (req, res) => {
  res.json({ message: 'Assignments routes - to be implemented' });
});
=======
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { protect } = require('../middleware/auth');
const { uploadPDF } = require('../middleware/upload');
const { submitAssignment, gradeAssignment } = require('../controllers/assignmentController');

router.post('/:id/submit', protect, uploadPDF.single('file'), asyncHandler(submitAssignment));
router.put('/:id/grade', protect, asyncHandler(gradeAssignment));
>>>>>>> efb84c1ad6217944445d6b2bf48b8ad3d0887842

module.exports = router;
