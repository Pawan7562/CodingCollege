const express = require('express');
const {
  register,
  login,
  getMe
} = require('../controllers/auth');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', require('../middleware/auth').protect, getMe);

module.exports = router;
