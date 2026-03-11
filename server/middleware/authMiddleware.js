import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware to protect routes
const protect = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } else {
      res.status(401).json({
        success: false,
        message: 'Not authorized, no token found',
      });
    }
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Not authorized, token failed',
    });
  }
};

export default protect;
