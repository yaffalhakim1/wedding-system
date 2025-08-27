'use strict';

import { ERROR_MESSAGES, HTTP_STATUS } from '../config/errors.js';

class ApiError extends Error {
  constructor(
    errorCode,
    statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    message = null
  ) {
    const errorMessage =
      message || ERROR_MESSAGES[errorCode] || 'Unknown error';
    super(errorMessage);

    this.name = 'ApiError';
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
