const Stripe = require('stripe');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const User = require('../models/User');
const Course = require('../models/Course');
const sendEmail = require('../utils/sendEmail');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

const enrollUserInCourses = async (userId, courseIds) => {
  const user = await User.findById(userId);
  const newCourses = courseIds.filter(id => !user.enrolledCourses.map(e => e.toString()).includes(id));
  user.enrolledCourses.push(...newCourses);
  user.cart = user.cart.filter(id => !courseIds.includes(id.toString()));
  user.notifications.push({ message: `You have been enrolled in ${newCourses.length} course(s)!` });
  await user.save();
  await Course.updateMany({ _id: { $in: newCourses } }, { $addToSet: { enrolledStudents: userId } });
};

exports.createStripePayment = async (req, res) => {
  const user = await User.findById(req.user._id).populate('cart', 'title price');
  if (!user.cart.length) return res.status(400).json({ message: 'Cart is empty' });
  const totalAmount = user.cart.reduce((sum, c) => sum + c.price, 0);
  const lineItems = user.cart.map(course => ({
    price_data: {
      currency: 'usd',
      product_data: { name: course.title },
      unit_amount: Math.round(course.price * 100)
    },
    quantity: 1,
  }));
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/cart`,
    metadata: {
      userId: req.user._id.toString(),
      courseIds: JSON.stringify(user.cart.map(c => c._id.toString()))
    },
  });
  res.json({ sessionId: session.id, url: session.url });
};

exports.stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).json({ message: `Webhook Error: ${err.message}` });
  }
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { userId, courseIds } = session.metadata;
    const parsedCourseIds = JSON.parse(courseIds);
    const courses = parsedCourseIds.map(id => ({ course: id, price: 0 }));
    await Order.create({
      user: userId,
      courses,
      totalAmount: session.amount_total / 100,
      paymentMethod: 'stripe',
      paymentId: session.payment_intent,
      status: 'completed'
    });
    await enrollUserInCourses(userId, parsedCourseIds);
  }
  res.json({ received: true });
};

exports.createRazorpayOrder = async (req, res) => {
  const user = await User.findById(req.user._id).populate('cart', 'title price');
  if (!user.cart.length) return res.status(400).json({ message: 'Cart is empty' });
  const totalAmount = user.cart.reduce((sum, c) => sum + c.price, 0);
  const order = await razorpay.orders.create({
    amount: Math.round(totalAmount * 100),
    currency: 'INR',
    receipt: `receipt_${Date.now()}`
  });
  res.json({ orderId: order.id, amount: order.amount, currency: order.currency, keyId: process.env.RAZORPAY_KEY_ID });
};

exports.verifyRazorpayPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const sign = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSign = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(sign).digest('hex');
  if (expectedSign !== razorpay_signature) return res.status(400).json({ message: 'Payment verification failed' });
  const user = await User.findById(req.user._id).populate('cart', 'title price');
  const courseIds = user.cart.map(c => c._id.toString());
  const totalAmount = user.cart.reduce((sum, c) => sum + c.price, 0);
  await Order.create({
    user: req.user._id,
    courses: courseIds.map(id => ({ course: id, price: 0 })),
    totalAmount,
    paymentMethod: 'razorpay',
    paymentId: razorpay_payment_id,
    orderId: razorpay_order_id,
    status: 'completed'
  });
  await enrollUserInCourses(req.user._id.toString(), courseIds);
  res.json({ message: 'Payment verified and courses enrolled!' });
};

exports.enrollFree = async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  if (course.price > 0) return res.status(400).json({ message: 'This is not a free course' });
  const user = await User.findById(req.user._id);
  if (user.enrolledCourses.map(id => id.toString()).includes(req.params.courseId)) {
    return res.status(400).json({ message: 'Already enrolled' });
  }
  await Order.create({
    user: req.user._id,
    courses: [{ course: req.params.courseId, price: 0 }],
    totalAmount: 0,
    paymentMethod: 'free',
    status: 'completed'
  });
  await enrollUserInCourses(req.user._id.toString(), [req.params.courseId]);
  res.json({ message: 'Enrolled successfully!' });
};

exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate('courses.course', 'title thumbnail')
    .sort('-createdAt');
  res.json(orders);
};
