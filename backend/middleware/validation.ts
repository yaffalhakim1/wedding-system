import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import ResponseHandler from '../utils/responseHandler.js';
import { ERROR_CODES, HTTP_STATUS } from '../config/errors.js';

// RSVP validation schema
const rsvpSchema = Joi.object({
  weddingId: Joi.string().uuid().required().messages({
    'string.uuid': 'Wedding ID must be a valid UUID',
    'any.required': 'Wedding ID is required',
  }),
  guest_name: Joi.string().trim().min(1).max(100).required().messages({
    'string.empty': 'Guest name is required',
    'string.min': 'Guest name must be at least 1 character',
    'string.max': 'Guest name cannot exceed 100 characters',
    'any.required': 'Guest name is required',
  }),
  guest_email: Joi.string().email().max(255).optional().messages({
    'string.email': 'Please provide a valid email address',
    'string.max': 'Email cannot exceed 255 characters',
  }),
  guest_phone: Joi.string().max(20).optional().messages({
    'string.max': 'Phone number cannot exceed 20 characters',
  }),
  attendance_status: Joi.string()
    .valid('attending', 'not_attending', 'maybe')
    .required()
    .messages({
      'any.only':
        'Attendance status must be attending, not_attending, or maybe',
      'any.required': 'Attendance status is required',
    }),
  number_of_guests: Joi.number().integer().min(0).max(10).required().messages({
    'number.base': 'Number of guests must be a number',
    'number.integer': 'Number of guests must be a whole number',
    'number.min': 'Number of guests cannot be negative',
    'number.max': 'Number of guests cannot exceed 10',
    'any.required': 'Number of guests is required',
  }),
  dietary_restrictions: Joi.string().max(500).optional().allow('').messages({
    'string.max': 'Dietary restrictions cannot exceed 500 characters',
  }),
  special_requests: Joi.string().max(500).optional().allow('').messages({
    'string.max': 'Special requests cannot exceed 500 characters',
  }),
});

// Validation middleware function
export const validateRsvp = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const { error } = rsvpSchema.validate(req.body, {
    abortEarly: false, // Get all validation errors
    stripUnknown: true, // Remove unknown fields
  });

  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));

    return ResponseHandler.error(
      res,
      ERROR_CODES.BAD_REQUEST,
      HTTP_STATUS.BAD_REQUEST,
      'Validation failed',
      errors
    );
  }

  next();
};

const messageSchema = Joi.object({
  weddingId: Joi.string().uuid().required().messages({
    'string.uuid': 'Wedding ID must be a valid UUID',
    'any.required': 'Wedding ID is required',
  }),
  sender_name: Joi.string().trim().min(1).max(100).required().messages({
    'string.empty': 'Sender name is required',
    'string.min': 'Sender name must be at least 1 character',
    'string.max': 'Sender name cannot exceed 100 characters',
    'any.required': 'Sender name is required',
  }),
  sender_email: Joi.string().email().max(255).optional().messages({
    'string.email': 'Please provide a valid email address',
    'string.max': 'Email cannot exceed 255 characters',
  }),
  message_content: Joi.string().trim().min(1).max(1000).required().messages({
    'string.empty': 'Message content is required',
    'string.min': 'Message must be at least 1 character',
    'string.max': 'Message cannot exceed 1000 characters',
    'any.required': 'Message content is required',
  }),
});

export const validateMessage = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const { error } = messageSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));

    return ResponseHandler.error(
      res,
      ERROR_CODES.BAD_REQUEST,
      HTTP_STATUS.BAD_REQUEST,
      'Validation failed',
      errors
    );
  }

  next();
};

const photoSchema = Joi.object({
  weddingId: Joi.string().uuid().required().messages({
    'string.uuid': 'Wedding ID must be a valid UUID',
    'any.required': 'Wedding ID is required',
  }),
  uploaded_by: Joi.string().trim().max(100).optional().messages({
    'string.max': 'Uploader name cannot exceed 100 characters',
  }),
  caption: Joi.string().trim().max(500).optional().allow('').messages({
    'string.max': 'Caption cannot exceed 500 characters',
  }),
});

export const validatePhoto = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const { error } = photoSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));

    return ResponseHandler.error(
      res,
      ERROR_CODES.BAD_REQUEST,
      HTTP_STATUS.BAD_REQUEST,
      'Validation failed',
      errors
    );
  }

  // Check if file was uploaded
  if (!(req as Request & { file?: Express.Multer.File }).file) {
    return ResponseHandler.error(
      res,
      ERROR_CODES.BAD_REQUEST,
      HTTP_STATUS.BAD_REQUEST,
      'Photo file is required'
    );
  }

  next();
};

// Admin login validation schema
const adminLoginSchema = Joi.object({
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
    'string.empty': 'Password is required',
  }),
});

// Admin login validation middleware
export const validateAdminLogin = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const { error } = adminLoginSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));

    return ResponseHandler.error(
      res,
      ERROR_CODES.BAD_REQUEST,
      HTTP_STATUS.BAD_REQUEST,
      'Validation failed',
      errors
    );
  }

  next();
};

// Wedding update validation schema
const weddingUpdateSchema = Joi.object({
  bride_name: Joi.string().trim().min(1).max(100).optional().messages({
    'string.min': 'Bride name must be at least 1 character',
    'string.max': 'Bride name cannot exceed 100 characters',
  }),
  groom_name: Joi.string().trim().min(1).max(100).optional().messages({
    'string.min': 'Groom name must be at least 1 character',
    'string.max': 'Groom name cannot exceed 100 characters',
  }),
  wedding_date: Joi.date().optional().messages({
    'date.base': 'Wedding date must be a valid date',
  }),
  wedding_time: Joi.string().optional().messages({
    'string.base': 'Wedding time must be a string',
  }),
  venue_name: Joi.string().trim().max(200).optional().messages({
    'string.max': 'Venue name cannot exceed 200 characters',
  }),
  venue_address: Joi.string().trim().optional().messages({
    'string.base': 'Venue address must be a string',
  }),
  ceremony_time: Joi.string().optional().messages({
    'string.base': 'Ceremony time must be a string',
  }),
  ceremony_location: Joi.string().max(200).optional().messages({
    'string.max': 'Ceremony location cannot exceed 200 characters',
  }),
  reception_time: Joi.string().optional().messages({
    'string.base': 'Reception time must be a string',
  }),
  reception_location: Joi.string().max(200).optional().messages({
    'string.max': 'Reception location cannot exceed 200 characters',
  }),
});

// Wedding update validation middleware
export const validateWeddingUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const { error } = weddingUpdateSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));

    return ResponseHandler.error(
      res,
      ERROR_CODES.BAD_REQUEST,
      HTTP_STATUS.BAD_REQUEST,
      'Validation failed',
      errors
    );
  }

  next();
};

// Photo upload validation middleware (separate from photo data validation)
export const validatePhotoUpload = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  // Validate uploaded file exists
  if (!(req as Request & { file?: Express.Multer.File }).file) {
    return ResponseHandler.error(
      res,
      ERROR_CODES.BAD_REQUEST,
      HTTP_STATUS.BAD_REQUEST,
      'Photo file is required'
    );
  }

  // Additional photo data validation (caption, uploader info)
  const photoDataSchema = Joi.object({
    weddingId: Joi.string().uuid().required().messages({
      'string.uuid': 'Wedding ID must be a valid UUID',
      'any.required': 'Wedding ID is required',
    }),
    uploader_name: Joi.string().trim().min(1).max(100).required().messages({
      'string.empty': 'Uploader name is required',
      'string.min': 'Uploader name must be at least 1 character',
      'string.max': 'Uploader name cannot exceed 100 characters',
      'any.required': 'Uploader name is required',
    }),
    uploader_email: Joi.string().email().max(255).optional().messages({
      'string.email': 'Please provide a valid email address',
      'string.max': 'Email cannot exceed 255 characters',
    }),
    caption: Joi.string().max(500).optional().allow('').messages({
      'string.max': 'Caption cannot exceed 500 characters',
    }),
  });

  const { error } = photoDataSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));

    return ResponseHandler.error(
      res,
      ERROR_CODES.BAD_REQUEST,
      HTTP_STATUS.BAD_REQUEST,
      'Validation failed',
      errors
    );
  }

  next();
};
