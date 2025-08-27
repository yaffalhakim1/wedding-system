import { Response } from 'express';
import { ErrorCode, HttpStatus } from '../config/errors.js';

interface SuccessResponse<T = any> {
  success: true;
  message: string;
  data: T;
}

interface ErrorDetails {
  field?: string;
  message: string;
  [key: string]: any;
}

interface ErrorResponse {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
    details?: ErrorDetails[] | any;
  };
}

export default class ResponseHandler {
  static success<T = any>(
    res: Response,
    data: T,
    message: string = 'Success',
    statusCode: HttpStatus = 200
  ): Response<SuccessResponse<T>> {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static error(
    res: Response,
    errorCode: ErrorCode,
    statusCode: HttpStatus,
    message: string | null = null,
    details?: ErrorDetails[] | any
  ): Response<ErrorResponse> {
    const response: ErrorResponse = {
      success: false,
      error: {
        code: errorCode,
        message: message || 'An error occurred',
      },
    };

    if (details && process.env.NODE_ENV !== 'production') {
      response.error.details = details;
    }

    return res.status(statusCode).json(response);
  }
}
