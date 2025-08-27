import { ERROR_MESSAGES, HTTP_STATUS, ErrorCode, HttpStatus } from '../config/errors.js';

export default class ApiError extends Error {
  public readonly name: string = 'ApiError';
  public readonly errorCode: ErrorCode;
  public readonly statusCode: HttpStatus;
  public readonly isOperational: boolean = true;

  constructor(
    errorCode: ErrorCode,
    statusCode: HttpStatus = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    message?: string | null
  ) {
    const errorMessage =
      message || ERROR_MESSAGES[errorCode] || 'Unknown error';
    super(errorMessage);

    this.errorCode = errorCode;
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}
