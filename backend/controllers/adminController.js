const User = require('../models/User');
const Course = require('../models/Course');
const Order = require('../models/Order');
const Assignment = require('../models/Assignment');
const Quiz = require('../models/Quiz');

exports.getDashboardStats = async (req, res) => {
  const [totalUsers, totalCourses, totalOrders, recentOrders] = await Promise.all([
    User.countDocuments({ role: 'student' }),
    Course.countDocuments(),
    Order.countDocuments({ status: 'completed' }),
    Order.find({ status: 'completed' })
      .sort('-createdAt')
      .limit(10)
      .populate('user', 'name email')
      .populate('courses.course', 'title'),
  ]);
  const revenueResult = await Order.aggregate([
    { $match: { status: 'completed' } },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } }
  ]);
  const totalRevenue = revenueResult[0]?.total || 0;
  const monthlyRevenue = await Order.aggregate([
    {
      $match: {
        status: 'completed',
        createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) }
      }
    },
    {
      $group: {
        _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
        revenue: { $sum: '$totalAmount' },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);
  res.json({ totalUsers, totalCourses, totalOrders, totalRevenue, recentOrders, monthlyRevenue });
};

exports.getAllUsers = async (req, res) => {
  const { page = 1, limit = 20, search } = req.query;
  const query = search
    ? { $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] }
    : {};
  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .select('-password')
    .sort('-createdAt')
    .skip((page - 1) * limit)
    .limit(Number(limit));
  res.json({ users, total, pages: Math.ceil(total / limit) });
};

exports.updateUserRole = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true }).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

exports.deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ message: 'User deleted' });
};

exports.getAllCourses = async (req, res) => {
  const courses = await Course.find().populate('instructor', 'name').sort('-createdAt');
  res.json(courses);
};

exports.getAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate('user', 'name email')
    .populate('courses.course', 'title')
    .sort('-createdAt');
  res.json(orders);
};

exports.createQuiz = async (req, res) => {
  const { title, courseId, duration, questions, passingMarks } = req.body;
  const totalMarks = questions.reduce((sum, q) => sum + (q.marks || 1), 0);
  const quiz = await Quiz.create({
    title,
    course: courseId,
    duration,
    questions,
    totalMarks,
    passingMarks: passingMarks || Math.ceil(totalMarks * 0.6),
    createdBy: req.user._id
  });
  res.status(201).json(quiz);
};

exports.getQuizzesByCourse = async (req, res) => {
  const quizzes = await Quiz.find({ course: req.params.courseId });
  res.json(quizzes);
};

exports.submitQuiz = async (req, res) => {
  const { answers } = req.body;
  const quiz = await Quiz.findById(req.params.quizId);
  if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
  let score = 0;
  const correctAnswers = [];
  quiz.questions.forEach((q, i) => {
    const isCorrect = answers[i] === q.correctAnswer;
    if (isCorrect) score += q.marks || 1;
    correctAnswers.push(q.correctAnswer);
  });
  const percentage = Math.round((score / quiz.totalMarks) * 100);
  const passed = score >= quiz.passingMarks;
  const existing = quiz.attempts.findIndex(a => a.student.toString() === req.user._id.toString());
  const attempt = { student: req.user._id, answers, score, percentage, passed };
  if (existing > -1) quiz.attempts[existing] = attempt;
  else quiz.attempts.push(attempt);
  await quiz.save();
  res.json({ score, totalMarks: quiz.totalMarks, percentage, passed, correctAnswers });
};

exports.sendNotificationToAll = async (req, res) => {
  const { message } = req.body;
  await User.updateMany({ role: 'student' }, { $push: { notifications: { message } } });
  res.json({ message: 'Notification sent to all students' });
};
