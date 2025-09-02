import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import ResponseHandler from '../utils/responseHandler.js';
import { ERROR_CODES, HTTP_STATUS } from '../config/errors.js';

interface AuthRequest extends Request {
  admin?: { admin: boolean };
}

interface JwtPayload {
  admin: boolean;
}

// Middleware to authenticate admin users
export const authenticateAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ResponseHandler.error(
        res,
        ERROR_CODES.UNAUTHORIZED,
        HTTP_STATUS.UNAUTHORIZED,
        'Authorization token required'
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET not configured');
      return ResponseHandler.error(
        res,
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        'Authentication configuration error'
      );
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
      
      if (!decoded.admin) {
        return ResponseHandler.error(
          res,
          ERROR_CODES.FORBIDDEN,
          HTTP_STATUS.FORBIDDEN,
          'Admin access required'
        );
      }

      req.admin = decoded;
      next();
    } catch (jwtError) {
      return ResponseHandler.error(
        res,
        ERROR_CODES.UNAUTHORIZED,
        HTTP_STATUS.UNAUTHORIZED,
        'Invalid or expired token'
      );
    }
  } catch (error) {
    console.error('Error in admin authentication middleware:', error);
    return ResponseHandler.error(
      res,
      ERROR_CODES.INTERNAL_SERVER_ERROR,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      'Authentication error'
    );
  }
};

// Middleware to optionally authenticate users (doesn't fail if no token)
export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      next();
      return;
    }

    const token = authHeader.substring(7);
    
    if (!process.env.JWT_SECRET) {
      next();
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
      req.admin = decoded;
    } catch (jwtError) {
      // Ignore JWT errors for optional auth
    }

    next();
  } catch (error) {
    console.error('Error in optional authentication middleware:', error);
    next();
  }
};