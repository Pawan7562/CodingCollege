const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { protect } = require('../middleware/auth');
const {
  createStripePayment,
  stripeWebhook,
  createRazorpayOrder,
  verifyRazorpayPayment,
  enrollFree,
  getMyOrders
} = require('../controllers/paymentController');

router.post('/stripe/create-session', protect, asyncHandler(createStripePayment));
router.post('/stripe/webhook', express.raw({ type: 'application/json' }), asyncHandler(stripeWebhook));
router.post('/razorpay/create-order', protect, asyncHandler(createRazorpayOrder));
router.post('/razorpay/verify', protect, asyncHandler(verifyRazorpayPayment));
router.post('/enroll-free/:courseId', protect, asyncHandler(enrollFree));
router.get('/my-orders', protect, asyncHandler(getMyOrders));

module.exports = router;
