const express = require('express');
const {
  register,
  verifyEmail,
  login,
  refreshToken,
  logout,
  logoutAll,
  getMe,
  updateDetails,
  updatePassword,
  forgotPassword,
  resetPassword,
  changeRole,
  getSessions,
  revokeSession
} = require('../controllers/auth');
const {
  validateRegister,
  validateLogin,
  validateUpdateDetails,
  validateUpdatePassword,
  validateForgotPassword,
  validateResetPassword
} = require('../middleware/validation');

const router = express.Router();

// Public routes
router.post('/register', validateRegister, register);
router.get('/verify-email/:token', verifyEmail);
router.post('/login', validateLogin, login);
router.post('/refresh', refreshToken);
router.post('/forgotpassword', validateForgotPassword, forgotPassword);
router.put('/resetpassword/:resettoken', validateResetPassword, resetPassword);

// Protected routes
router.get('/me', require('../middleware/auth').protect, getMe);
router.put('/updatedetails', require('../middleware/auth').protect, validateUpdateDetails, updateDetails);
router.put('/updatepassword', require('../middleware/auth').protect, validateUpdatePassword, updatePassword);
router.post('/logout', require('../middleware/auth').protect, logout);
router.post('/logout-all', require('../middleware/auth').protect, logoutAll);
router.get('/sessions', require('../middleware/auth').protect, getSessions);
router.delete('/sessions/:tokenId', require('../middleware/auth').protect, revokeSession);

// Admin only routes
router.put('/change-role/:userId', 
  require('../middleware/auth').protect, 
  require('../middleware/auth').authorize('admin'), 
  changeRole
);

module.exports = router;
