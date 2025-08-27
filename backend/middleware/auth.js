const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Check if MongoDB is available
const isMongoAvailable = () => {
  return require('mongoose').connection.readyState === 1;
};

// Demo user for fallback mode
const demoUser = {
  _id: 'demo-user-id',
  email: 'demo@wordwanderer.com',
  username: 'demouser',
  displayName: 'Demo User',
  isActive: true
};

const auth = async (req, res, next) => {
  try {
    // Get token from cookie or Authorization header
    let token = req.cookies['auth-token'];
    
    if (!token) {
      const authHeader = req.header('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      let user;

      if (!isMongoAvailable()) {
        // Fallback mode - use demo user if token matches
        if (decoded.userId === demoUser._id) {
          user = demoUser;
        } else {
          return res.status(401).json({
            success: false,
            message: 'Token is no longer valid. User not found (Demo mode).'
          });
        }
      } else {
        // Normal database mode
        user = await User.findById(decoded.userId);
        if (!user) {
          return res.status(401).json({
            success: false,
            message: 'Token is no longer valid. User not found.'
          });
        }
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Account has been deactivated.'
        });
      }

      // Add user info to request
      req.user = {
        userId: decoded.userId,
        email: user.email,
        username: user.username
      };

      next();
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token has expired. Please log in again.'
        });
      } else if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token. Please log in again.'
        });
      } else {
        throw jwtError;
      }
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Optional auth middleware - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    // Get token from cookie or Authorization header
    let token = req.cookies['auth-token'];
    
    if (!token) {
      const authHeader = req.header('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (token) {
      try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        let user;

        if (!isMongoAvailable()) {
          // Fallback mode - use demo user if token matches
          if (decoded.userId === demoUser._id) {
            user = demoUser;
          }
        } else {
          // Normal database mode
          user = await User.findById(decoded.userId);
        }

        if (user && user.isActive) {
          // Add user info to request
          req.user = {
            userId: decoded.userId,
            email: user.email,
            username: user.username
          };
        }
      } catch (jwtError) {
        // Token is invalid, but we don't fail - just continue without user
        console.log('Optional auth - invalid token:', jwtError.message);
      }
    }

    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next(); // Continue without auth
  }
};

module.exports = { auth, optionalAuth };
