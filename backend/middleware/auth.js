const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - Verify access token
exports.protect = async (req, res, next) => {
  let token;

  // Get token from header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

// Rate limiting middleware
exports.rateLimit = (maxRequests, windowMs) => {
  const requests = new Map();

  return (req, res, next) => {
    const now = Date.now();
    const windowStart = now - windowMs;
    const userIP = req.ip || req.connection.remoteAddress;

    // Clean old requests
    if (requests.has(userIP)) {
      const userRequests = requests.get(userIP);
      requests.set(userIP, userRequests.filter(time => time > windowStart));
    } else {
      requests.set(userIP, []);
    }

    // Check rate limit
    if (requests.get(userIP).length >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests, please try again later'
      });
    }

    // Add current request
    requests.get(userIP).push(now);
    next();
  };
};
