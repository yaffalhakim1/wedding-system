export const ERROR_CODES = {
  // General errors
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  BAD_REQUEST: 'BAD_REQUEST',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',

  // Wedding specific
  WEDDING_NOT_FOUND: 'WEDDING_NOT_FOUND',

  // RSVP specific
  RSVP_NOT_FOUND: 'RSVP_NOT_FOUND',
  RSVP_ALREADY_EXISTS: 'RSVP_ALREADY_EXISTS',

  // Message specific
  MESSAGE_NOT_FOUND: 'MESSAGE_NOT_FOUND',
  MESSAGE_NOT_APPROVED: 'MESSAGE_NOT_APPROVED',

  // Photo specific
  PHOTO_NOT_FOUND: 'PHOTO_NOT_FOUND',
  PHOTO_UPLOAD_FAILED: 'PHOTO_UPLOAD_FAILED',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ERROR_CODES.INTERNAL_SERVER_ERROR]: 'Internal server error',
  [ERROR_CODES.NOT_FOUND]: 'Resource not found',
  [ERROR_CODES.BAD_REQUEST]: 'Bad request',
  [ERROR_CODES.UNAUTHORIZED]: 'Unauthorized access',
  [ERROR_CODES.FORBIDDEN]: 'Access forbidden',
  [ERROR_CODES.INVALID_CREDENTIALS]: 'Invalid username or password',

  [ERROR_CODES.WEDDING_NOT_FOUND]: 'Wedding information not found',

  [ERROR_CODES.RSVP_NOT_FOUND]: 'RSVP not found',
  [ERROR_CODES.RSVP_ALREADY_EXISTS]: 'RSVP already exists for this guest',

  [ERROR_CODES.MESSAGE_NOT_FOUND]: 'Message not found',
  [ERROR_CODES.MESSAGE_NOT_APPROVED]: 'Message not approved for display',

  [ERROR_CODES.PHOTO_NOT_FOUND]: 'Photo not found',
  [ERROR_CODES.PHOTO_UPLOAD_FAILED]: 'Photo upload failed',
  [ERROR_CODES.INVALID_FILE_TYPE]: 'Invalid file type',
  [ERROR_CODES.FILE_TOO_LARGE]: 'File size too large',
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export type HttpStatus = typeof HTTP_STATUS[keyof typeof HTTP_STATUS];
