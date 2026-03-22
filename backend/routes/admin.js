const express = require('express');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Placeholder routes - will be implemented later
router.get('/dashboard', protect, authorize('admin'), (req, res) => {
  res.json({ message: 'Admin dashboard - to be implemented' });
});

module.exports = router;
