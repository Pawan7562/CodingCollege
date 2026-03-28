const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '30d' });

const generate6Digit = () => Math.floor(100000 + Math.random() * 900000).toString();

// ─── Register ────────────────────────────────────────────────────────────────
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: 'Please provide all fields' });

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Email already registered' });

  const otp = generate6Digit();
  const user = await User.create({
    name, email, password,
    emailOTP: otp,
    emailOTPExpire: new Date(Date.now() + 10 * 60 * 1000),
    isEmailVerified: false,
    authProvider: 'local',
  });

  try {
    await sendEmail({
      to: email,
      subject: 'CodingCollege - Verify Your Email',
      html: `
        <div style="font-family:Inter,sans-serif;max-width:500px;margin:auto;background:#111827;color:#f9fafb;padding:32px;border-radius:12px">
          <h1 style="color:#3b82f6;font-size:24px;margin-bottom:8px">CodingCollege</h1>
          <h2 style="font-size:20px;margin-bottom:16px">Verify your email address</h2>
          <p style="color:#9ca3af;margin-bottom:24px">Hi ${name}, use this OTP to verify your email:</p>
          <div style="background:#1f2937;border:2px solid #3b82f6;border-radius:12px;padding:28px;text-align:center;margin-bottom:24px">
            <span style="font-size:44px;font-weight:900;letter-spacing:14px;color:#3b82f6">${otp}</span>
          </div>
          <p style="color:#6b7280;font-size:13px">This OTP expires in 10 minutes. Do not share it with anyone.</p>
        </div>
      `,
    });
  } catch (e) {
    console.log('Email send failed (check SMTP config):', e.message);
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log(`\n🔑 [DEV] Email OTP for ${email}: ${otp}\n`);
  }

  res.status(201).json({
    message: 'Account created! Check your email for the OTP.',
    userId: user._id,
    email: user.email,
    requireEmailVerification: true,
  });
};

// ─── Verify Email OTP ─────────────────────────────────────────────────────────
exports.verifyEmailOTP = async (req, res) => {
  const { userId, otp } = req.body;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (user.isEmailVerified) return res.status(400).json({ message: 'Email already verified' });
  if (user.emailOTP !== otp) return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
  if (user.emailOTPExpire < new Date()) return res.status(400).json({ message: 'OTP expired. Please request a new one.' });

  user.isEmailVerified = true;
  user.emailOTP = '';
  user.emailOTPExpire = undefined;
  await user.save();

  const token = generateToken(user._id);
  res.json({
    token,
    user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, isEmailVerified: true, isPhoneVerified: user.isPhoneVerified },
    message: 'Email verified successfully!',
  });
};

// ─── Resend Email OTP ─────────────────────────────────────────────────────────
exports.resendEmailOTP = async (req, res) => {
  const { userId } = req.body;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (user.isEmailVerified) return res.status(400).json({ message: 'Email already verified' });

  const otp = generate6Digit();
  user.emailOTP = otp;
  user.emailOTPExpire = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  try {
    await sendEmail({
      to: user.email,
      subject: 'CodingCollege - New Verification OTP',
      html: `<div style="font-family:Inter,sans-serif;padding:32px;background:#111827;color:#f9fafb;border-radius:12px">
        <h2 style="color:#3b82f6">Your new OTP</h2>
        <div style="background:#1f2937;border:2px solid #3b82f6;border-radius:12px;padding:28px;text-align:center;margin:16px 0">
          <span style="font-size:44px;font-weight:900;letter-spacing:14px;color:#3b82f6">${otp}</span>
        </div>
        <p style="color:#6b7280">Expires in 10 minutes.</p>
      </div>`,
    });
  } catch (e) { console.log('Email error:', e.message); }

  if (process.env.NODE_ENV !== 'production') console.log(`\n🔑 [DEV] New OTP for ${user.email}: ${otp}\n`);
  res.json({ message: 'New OTP sent to your email' });
};

// ─── Login ────────────────────────────────────────────────────────────────────
exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Please provide email and password' });

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  if (user.authProvider !== 'local')
    return res.status(400).json({ message: `Please sign in with ${user.authProvider}` });

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  if (!user.isEmailVerified) {
    const otp = generate6Digit();
    user.emailOTP = otp;
    user.emailOTPExpire = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    if (process.env.NODE_ENV !== 'production') console.log(`\n🔑 [DEV] Email OTP for ${email}: ${otp}\n`);
    return res.status(403).json({
      message: 'Please verify your email first.',
      requireEmailVerification: true,
      userId: user._id,
      email: user.email,
    });
  }

  const token = generateToken(user._id);
  res.json({
    token,
    user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, isEmailVerified: user.isEmailVerified, isPhoneVerified: user.isPhoneVerified },
  });
};

// ─── Get Current User ─────────────────────────────────────────────────────────
exports.getMe = async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('enrolledCourses', 'title thumbnail price')
    .populate('wishlist', 'title thumbnail price')
    .populate('cart', 'title thumbnail price');
  res.json(user);
};

// ─── Update Profile ───────────────────────────────────────────────────────────
exports.updateProfile = async (req, res) => {
  const { name, bio } = req.body;
  const updateData = { name, bio };
  if (req.file) updateData.avatar = req.file.path;
  const user = await User.findByIdAndUpdate(req.user._id, updateData, { new: true, runValidators: true }).select('-password');
  res.json(user);
};

// ─── Change Password ──────────────────────────────────────────────────────────
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);
  if (user.authProvider !== 'local') return res.status(400).json({ message: 'Cannot change password for OAuth accounts' });
  if (!(await user.comparePassword(currentPassword))) return res.status(400).json({ message: 'Current password is incorrect' });
  user.password = newPassword;
  await user.save();
  res.json({ message: 'Password changed successfully' });
};

// ─── Send Phone OTP ───────────────────────────────────────────────────────────
exports.sendPhoneOTP = async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ message: 'Phone number required' });

  const otp = generate6Digit();
  await User.findByIdAndUpdate(req.user._id, {
    phone,
    phoneOTP: otp,
    phoneOTPExpire: new Date(Date.now() + 10 * 60 * 1000),
  });

  // Production: use Twilio
  // const twilio = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN)
  // await twilio.messages.create({ body: `Your CodingCollege OTP: ${otp}`, from: process.env.TWILIO_FROM, to: phone })

  if (process.env.NODE_ENV !== 'production') {
    console.log(`\n📱 [DEV] Phone OTP for ${phone}: ${otp}\n`);
  }

  res.json({ message: `OTP sent to ${phone}` });
};

// ─── Verify Phone OTP ─────────────────────────────────────────────────────────
exports.verifyPhoneOTP = async (req, res) => {
  const { otp } = req.body;
  const user = await User.findById(req.user._id);
  if (!user.phoneOTP || user.phoneOTP !== otp) return res.status(400).json({ message: 'Invalid OTP' });
  if (user.phoneOTPExpire < new Date()) return res.status(400).json({ message: 'OTP expired' });

  user.isPhoneVerified = true;
  user.phoneOTP = '';
  user.phoneOTPExpire = undefined;
  await user.save();
  res.json({ message: 'Phone number verified!', isPhoneVerified: true });
};

// ─── OAuth Callback ───────────────────────────────────────────────────────────
exports.oauthCallback = (req, res) => {
  const token = generateToken(req.user._id);
  const userData = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    avatar: req.user.avatar,
    isEmailVerified: req.user.isEmailVerified,
    isPhoneVerified: req.user.isPhoneVerified,
  };
  const clientURL = process.env.CLIENT_URL || 'http://localhost:5173';
  res.redirect(`${clientURL}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(userData))}`);
};

// ─── Cart / Wishlist ──────────────────────────────────────────────────────────
exports.addToWishlist = async (req, res) => {
  const user = await User.findById(req.user._id);
  const courseId = req.params.courseId;
  const idx = user.wishlist.indexOf(courseId);
  if (idx > -1) user.wishlist.splice(idx, 1);
  else user.wishlist.push(courseId);
  await user.save();
  res.json({ wishlist: user.wishlist, message: idx > -1 ? 'Removed from wishlist' : 'Added to wishlist' });
};

exports.addToCart = async (req, res) => {
  const user = await User.findById(req.user._id);
  const courseId = req.params.courseId;
  if (user.enrolledCourses.includes(courseId)) return res.status(400).json({ message: 'Already enrolled' });
  if (!user.cart.includes(courseId)) user.cart.push(courseId);
  await user.save();
  await user.populate('cart', 'title thumbnail price');
  res.json({ cart: user.cart, message: 'Added to cart' });
};

exports.removeFromCart = async (req, res) => {
  const user = await User.findById(req.user._id);
  user.cart = user.cart.filter(id => id.toString() !== req.params.courseId);
  await user.save();
  res.json({ message: 'Removed from cart' });
};

exports.markNotificationRead = async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { $set: { 'notifications.$[].read': true } });
  res.json({ message: 'Notifications marked as read' });
};
