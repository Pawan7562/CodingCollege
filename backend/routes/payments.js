const express = require('express');
<<<<<<< HEAD
const { protect } = require('../middleware/auth');

const router = express.Router();

// Placeholder routes - will be implemented later
router.get('/', protect, (req, res) => {
  res.json({ message: 'Payments routes - to be implemented' });
});
=======
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
>>>>>>> efb84c1ad6217944445d6b2bf48b8ad3d0887842

module.exports = router;
