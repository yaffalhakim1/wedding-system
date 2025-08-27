'use strict';

import db from '../models/index.js';
import ApiError from '../utils/apiError.js';
import ResponseHandler from '../utils/responseHandler.js';
import { ERROR_CODES, HTTP_STATUS } from '../config/errors.js';

const { Rsvp, Wedding } = db;

// POST /api/rsvp - Submit guest RSVP response (validation applied via middleware)
export const createRsvp = async (req, res) => {
  try {
    const {
      weddingId,
      guest_name,
      guest_email,
      guest_phone,
      attendance_status,
      number_of_guests,
      dietary_restrictions,
      special_requests,
    } = req.body;

    // Check if wedding exists
    const wedding = await Wedding.findByPk(weddingId);
    if (!wedding) {
      throw new ApiError(ERROR_CODES.WEDDING_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    // Check if RSVP already exists for this guest
    if (guest_email) {
      const existingRsvp = await Rsvp.findOne({
        where: { weddingId, guest_email },
      });

      if (existingRsvp) {
        throw new ApiError(
          ERROR_CODES.RSVP_ALREADY_EXISTS,
          HTTP_STATUS.CONFLICT
        );
      }
    }

    const rsvp = await Rsvp.create({
      weddingId,
      guest_name,
      guest_email: guest_email || null,
      guest_phone: guest_phone || null,
      attendance_status,
      number_of_guests,
      dietary_restrictions: dietary_restrictions || null,
      special_requests: special_requests || null,
    });

    return ResponseHandler.success(
      res,
      rsvp,
      'RSVP submitted successfully',
      HTTP_STATUS.CREATED
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

    console.error('Error creating RSVP:', error);
    return ResponseHandler.error(
      res,
      ERROR_CODES.INTERNAL_SERVER_ERROR,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      'Failed to submit RSVP'
    );
  }
};

// GET /api/admin/rsvps - Get all RSVP responses (admin only)
export const getAllRsvps = async (req, res) => {
  try {
    const rsvps = await Rsvp.findAll({
      include: [
        {
          model: Wedding,
          as: 'wedding',
          attributes: ['bride_name', 'groom_name', 'wedding_date'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return ResponseHandler.success(res, rsvps, 'RSVPs retrieved successfully');
  } catch (error) {
    console.error('Error fetching RSVPs:', error);
    return ResponseHandler.error(
      res,
      ERROR_CODES.INTERNAL_SERVER_ERROR,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      'Failed to retrieve RSVPs'
    );
  }
};
