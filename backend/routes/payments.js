const express = require('express');
const router = express.Router();

// Placeholder routes for payments
router.get('/', (req, res) => {
  res.json({ success: true, message: 'Payments endpoint - coming soon' });
});

module.exports = router;
