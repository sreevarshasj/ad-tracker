// FILE: backend/middleware/auth.middleware.js
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger.js';

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

    req.user = decoded;
    next();
  } catch (error) {
    logger.warn('Auth middleware: Invalid token', error.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Optional auth - doesn't block if no token
export const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      req.user = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    }
  } catch (err) {
    // Ignore auth errors for optional routes
  }
  next();
};
