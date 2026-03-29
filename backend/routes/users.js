const express = require('express');
const router = express.Router();

// Placeholder routes for users
router.get('/', (req, res) => {
  res.json({ success: true, message: 'Users endpoint - coming soon' });
});

module.exports = router;
