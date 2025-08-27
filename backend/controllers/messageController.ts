import { Request, Response } from 'express';
import db from '../models/index.js';
import ApiError from '../utils/apiError.js';
import ResponseHandler from '../utils/responseHandler.js';
import { ERROR_CODES, HTTP_STATUS } from '../config/errors.js';

const { Message, Wedding } = db;

interface CreateMessageRequest {
  weddingId: string;
  sender_name: string;
  sender_email?: string;
  message_content: string;
}

// POST /api/messages - Submit guest message/congratulations
export const createMessage = async (
  req: Request<{}, any, CreateMessageRequest>,
  res: Response
): Promise<Response> => {
  try {
    const { weddingId, sender_name, sender_email, message_content } = req.body;

    // Check if wedding exists
    const wedding = await Wedding.findByPk(weddingId);
    if (!wedding) {
      throw new ApiError(ERROR_CODES.WEDDING_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const message = await Message.create({
      weddingId,
      sender_name,
      sender_email: sender_email || null,
      message_content,
      is_approved: false, // Messages need approval by default
    });

    return ResponseHandler.success(
      res,
      message,
      'Message submitted successfully',
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

    console.error('Error creating message:', error);
    return ResponseHandler.error(
      res,
      ERROR_CODES.INTERNAL_SERVER_ERROR,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      'Failed to submit message'
    );
  }
};

// GET /api/messages - Get approved messages for display
export const getApprovedMessages = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const messages = await Message.findAll({
      where: { is_approved: true },
      include: [
        {
          model: Wedding,
          as: 'wedding',
          attributes: ['bride_name', 'groom_name'],
        },
      ],
      attributes: ['id', 'sender_name', 'message_content', 'createdAt'],
      order: [['createdAt', 'DESC']],
    });

    return ResponseHandler.success(
      res,
      messages,
      'Approved messages retrieved successfully'
    );
  } catch (error) {
    console.error('Error fetching messages:', error);
    return ResponseHandler.error(
      res,
      ERROR_CODES.INTERNAL_SERVER_ERROR,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      'Failed to retrieve messages'
    );
  }
};
