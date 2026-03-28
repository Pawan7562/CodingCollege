const express = require('express');
<<<<<<< HEAD
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
=======
const router = express.Router();
const asyncHandler = require('express-async-handler');
const passport = require('passport');
const { protect } = require('../middleware/auth');
const { uploadAvatar } = require('../middleware/upload');
const {
  register, login, getMe, updateProfile, changePassword,
  verifyEmailOTP, resendEmailOTP,
  sendPhoneOTP, verifyPhoneOTP,
  oauthCallback,
  addToWishlist, addToCart, removeFromCart, markNotificationRead,
} = require('../controllers/authController');

// Local auth
router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));
router.post('/verify-email', asyncHandler(verifyEmailOTP));
router.post('/resend-otp', asyncHandler(resendEmailOTP));

// Protected
router.get('/me', protect, asyncHandler(getMe));
router.put('/profile', protect, uploadAvatar.single('avatar'), asyncHandler(updateProfile));
router.put('/change-password', protect, asyncHandler(changePassword));
router.post('/send-phone-otp', protect, asyncHandler(sendPhoneOTP));
router.post('/verify-phone', protect, asyncHandler(verifyPhoneOTP));
router.post('/wishlist/:courseId', protect, asyncHandler(addToWishlist));
router.post('/cart/:courseId', protect, asyncHandler(addToCart));
router.delete('/cart/:courseId', protect, asyncHandler(removeFromCart));
router.put('/notifications/read', protect, asyncHandler(markNotificationRead));

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL}/login?error=google_failed`, session: false }),
  oauthCallback
);

// GitHub OAuth
router.get('/github', passport.authenticate('github', { scope: ['user:email'], session: false }));
router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: `${process.env.CLIENT_URL}/login?error=github_failed`, session: false }),
  oauthCallback
);
>>>>>>> efb84c1ad6217944445d6b2bf48b8ad3d0887842

module.exports = router;
