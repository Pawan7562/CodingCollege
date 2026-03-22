const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('./asyncHandler');

// Protect routes - Verify access token
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // Get token from header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    const user = await User.findById(decoded.id).select('+refreshTokens');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found.'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated.'
      });
    }

    // Check if user is banned
    if (user.isBanned) {
      return res.status(401).json({
        success: false,
        message: 'Account has been banned.',
        banReason: user.banReason
      });
    }

    // Check if email is verified (for certain routes)
    if (req.path.startsWith('/api/courses/create') && !user.emailVerified) {
      return res.status(401).json({
        success: false,
        message: 'Please verify your email to create courses.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired.',
        code: 'TOKEN_EXPIRED'
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Server error.'
      });
    }
  }
});

// Refresh access token
exports.refreshToken = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: 'Refresh token is required.'
    });
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Get user from token
    const user = await User.findById(decoded.id).select('+refreshTokens');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found.'
      });
    }

    // Check if refresh token exists in user's refresh tokens
    const tokenExists = user.refreshTokens.some(rt => rt.token === refreshToken);
    if (!tokenExists) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token.'
      });
    }

    // Generate new access token
    const accessToken = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token.'
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Refresh token expired. Please login again.'
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Server error.'
      });
    }
  }
});

// Logout - Remove refresh token
exports.logout = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      message: 'Refresh token is required.'
    });
  }

  try {
    // Find user and remove refresh token
    const user = await User.findOne({ 'refreshTokens.token': refreshToken });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token.'
      });
    }

    // Remove the refresh token
    user.refreshTokens = user.refreshTokens.filter(rt => rt.token !== refreshToken);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Logged out successfully.'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error.'
    });
  }
});

// Logout from all devices
exports.logoutAll = asyncHandler(async (req, res, next) => {
  try {
    // Clear all refresh tokens for the user
    req.user.clearRefreshTokens();

    res.status(200).json({
      success: true,
      message: 'Logged out from all devices successfully.'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error.'
    });
  }
});

// Role-based access control
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Please login.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route.`
      });
    }

    next();
  };
};

// Check if user can access course
exports.canAccessCourse = asyncHandler(async (req, res, next) => {
  const courseId = req.params.id || req.params.courseId;

  if (!courseId) {
    return res.status(400).json({
      success: false,
      message: 'Course ID is required.'
    });
  }

  try {
    const Course = require('../models/Course');
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.'
      });
    }

    // Admin can access any course
    if (req.user.role === 'admin') {
      return next();
    }

    // Instructor can access their own courses
    if (req.user.role === 'instructor' && course.instructor.toString() === req.user._id.toString()) {
      return next();
    }

    // Student can access enrolled courses
    if (req.user.role === 'student' && req.user.isEnrolledInCourse(courseId)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'Access denied. You are not enrolled in this course.'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error.'
    });
  }
});

// Check if user can modify course
exports.canModifyCourse = asyncHandler(async (req, res, next) => {
  const courseId = req.params.id || req.params.courseId;

  if (!courseId) {
    return res.status(400).json({
      success: false,
      message: 'Course ID is required.'
    });
  }

  try {
    const Course = require('../models/Course');
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.'
      });
    }

    // Admin can modify any course
    if (req.user.role === 'admin') {
      return next();
    }

    // Instructor can modify their own courses
    if (req.user.role === 'instructor' && course.instructor.toString() === req.user._id.toString()) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'Access denied. You can only modify your own courses.'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error.'
    });
  }
});

// Optional authentication - doesn't fail if no token
exports.optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (user && user.isActive && !user.isBanned) {
        req.user = user;
      }
    } catch (error) {
      // Ignore errors for optional auth
    }
  }

  next();
});

// Rate limiting middleware
exports.rateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const requests = new Map();

  return (req, res, next) => {
    const key = req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old entries
    for (const [ip, timestamps] of requests.entries()) {
      requests.set(ip, timestamps.filter(timestamp => timestamp > windowStart));
      if (requests.get(ip).length === 0) {
        requests.delete(ip);
      }
    }

    // Get current requests for this IP
    const userRequests = requests.get(key) || [];

    // Check if limit exceeded
    if (userRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }

    // Add current request
    userRequests.push(now);
    requests.set(key, userRequests);

    next();
  };
};
