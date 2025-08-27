import { Request, Response, NextFunction } from 'express';
import db from '../models/index.js';
import ApiError from '../utils/apiError.js';
import ResponseHandler from '../utils/responseHandler.js';
import { ERROR_CODES, HTTP_STATUS } from '../config/errors.js';

const { Wedding } = db;

// GET /api/wedding - Get wedding details
export const getWedding = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response> => {
  try {
    const wedding = await Wedding.findOne();
    
    if (!wedding) {
      throw new ApiError(
        ERROR_CODES.WEDDING_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    return ResponseHandler.success(
      res,
      wedding,
      'Wedding details retrieved successfully'
    );
  } catch (error) {
    if (error instanceof ApiError) {
      return ResponseHandler.error(
        res,
        error.errorCode,
        error.statusCode,
        error.message
      );
    }
    
    console.error('Error fetching wedding details:', error);
    return ResponseHandler.error(
      res,
      ERROR_CODES.INTERNAL_SERVER_ERROR,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      'Failed to retrieve wedding details'
    );
  }
};