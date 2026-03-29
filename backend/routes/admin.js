const express = require('express');
const router = express.Router();

// Placeholder routes for admin
router.get('/', (req, res) => {
  res.json({ success: true, message: 'Admin endpoint - coming soon' });
});

module.exports = router;
