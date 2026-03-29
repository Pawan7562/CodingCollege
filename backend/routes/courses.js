const express = require('express');
const router = express.Router();

// Placeholder routes for courses
router.get('/', (req, res) => {
  res.json({ success: true, message: 'Courses endpoint - coming soon' });
});

module.exports = router;
