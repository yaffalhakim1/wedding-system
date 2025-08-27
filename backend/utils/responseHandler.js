'use strict';

class ResponseHandler {
  static success(res, data, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static error(res, errorCode, statusCode, message = null, details = null) {
    const response = {
      success: false,
      error: {
        code: errorCode,
        message,
      },
    };

    if (details && process.env.NODE_ENV !== 'production') {
      response.error.details = details;
    }

    return res.status(statusCode).json(response);
  }
}

export default ResponseHandler;
