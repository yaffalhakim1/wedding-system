import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import db from '../models/index.js';
import ApiError from '../utils/apiError.js';
import ResponseHandler from '../utils/responseHandler.js';
import { ERROR_CODES, HTTP_STATUS } from '../config/errors.js';
import { DatabaseLogger, logModelOperation } from '../utils/logger.js';

const { Wedding, Rsvp, Message, Photo, AuditLog } = db;

interface AdminLoginRequest {
  password: string;
}

interface UpdateMessageRequest {
  is_approved: boolean;
}

interface UpdatePhotoRequest {
  is_approved: boolean;
}

// POST /api/admin/login - Admin authentication
export const adminLogin = async (
  req: Request<{}, any, AdminLoginRequest>,
  res: Response
): Promise<Response> => {
  try {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      throw new ApiError(
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }

    const isValidPassword = await bcrypt.compare(password, adminPassword);
    
    if (!isValidPassword) {
      throw new ApiError(
        ERROR_CODES.INVALID_CREDENTIALS,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const token = jwt.sign(
      { admin: true },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    // Log successful admin login
    logModelOperation(req, 'LOGIN', 'admin', 'admin', null, { 
      success: true,
      timestamp: new Date()
    });

    return ResponseHandler.success(
      res,
      { token },
      'Login successful'
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
    
    console.error('Error during admin login:', error);
    return ResponseHandler.error(
      res,
      ERROR_CODES.INTERNAL_SERVER_ERROR,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      'Login failed'
    );
  }
};

// GET /api/admin/stats - Get dashboard statistics
export const getAdminStats = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const [
      totalRsvps,
      attendingRsvps,
      totalMessages,
      approvedMessages,
      totalPhotos,
      approvedPhotos
    ] = await Promise.all([
      Rsvp.count(),
      Rsvp.count({ where: { attendance_status: 'attending' } }),
      Message.count(),
      Message.count({ where: { is_approved: true } }),
      Photo.count(),
      Photo.count({ where: { is_approved: true } })
    ]);

    const totalGuests = await Rsvp.sum('number_of_guests', {
      where: { attendance_status: 'attending' }
    }) || 0;

    const stats = {
      rsvps: {
        total: totalRsvps,
        attending: attendingRsvps,
        totalGuests: totalGuests
      },
      messages: {
        total: totalMessages,
        approved: approvedMessages,
        pending: totalMessages - approvedMessages
      },
      photos: {
        total: totalPhotos,
        approved: approvedPhotos,
        pending: totalPhotos - approvedPhotos
      }
    };

    return ResponseHandler.success(
      res,
      stats,
      'Statistics retrieved successfully'
    );
  } catch (error) {
    console.error('Error fetching admin statistics:', error);
    return ResponseHandler.error(
      res,
      ERROR_CODES.INTERNAL_SERVER_ERROR,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      'Failed to retrieve statistics'
    );
  }
};

// PUT /api/admin/messages/:id - Approve/hide messages
export const updateMessageStatus = async (
  req: Request<{ id: string }, any, UpdateMessageRequest>,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const { is_approved } = req.body;

    const message = await Message.findByPk(id);
    
    if (!message) {
      throw new ApiError(
        ERROR_CODES.MESSAGE_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    const oldData = message.toJSON();
    
    await message.update({
      is_approved,
      approved_at: is_approved ? new Date() : null
    });

    const newData = message.toJSON();

    // Log the operation
    logModelOperation(req, 'UPDATE', 'message', id, oldData, newData);

    // Create audit trail entry
    await AuditLog.createAuditEntry({
      table_name: 'messages',
      record_id: id,
      action: 'UPDATE',
      old_values: oldData,
      new_values: newData,
      user_type: 'admin',
      ip_address: req.ip,
      user_agent: req.get('User-Agent'),
      metadata: {
        operation: 'approve_message',
        approved: is_approved
      }
    });

    return ResponseHandler.success(
      res,
      message,
      `Message ${is_approved ? 'approved' : 'hidden'} successfully`
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
    
    console.error('Error updating message status:', error);
    return ResponseHandler.error(
      res,
      ERROR_CODES.INTERNAL_SERVER_ERROR,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      'Failed to update message status'
    );
  }
};

// PUT /api/admin/photos/:id - Approve/hide photos
export const updatePhotoStatus = async (
  req: Request<{ id: string }, any, UpdatePhotoRequest>,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const { is_approved } = req.body;

    const photo = await Photo.findByPk(id);
    
    if (!photo) {
      throw new ApiError(
        ERROR_CODES.PHOTO_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    const oldData = photo.toJSON();

    await photo.update({
      is_approved,
      approved_at: is_approved ? new Date() : null
    });

    const newData = photo.toJSON();

    // Log the operation
    logModelOperation(req, 'UPDATE', 'photo', id, oldData, newData);

    // Create audit trail entry
    await AuditLog.createAuditEntry({
      table_name: 'photos',
      record_id: id,
      action: 'UPDATE',
      old_values: oldData,
      new_values: newData,
      user_type: 'admin',
      ip_address: req.ip,
      user_agent: req.get('User-Agent'),
      metadata: {
        operation: 'approve_photo',
        approved: is_approved
      }
    });

    return ResponseHandler.success(
      res,
      photo,
      `Photo ${is_approved ? 'approved' : 'hidden'} successfully`
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
    
    console.error('Error updating photo status:', error);
    return ResponseHandler.error(
      res,
      ERROR_CODES.INTERNAL_SERVER_ERROR,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      'Failed to update photo status'
    );
  }
};

// PUT /api/admin/wedding - Update wedding details
export const updateWeddingDetails = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const wedding = await Wedding.findOne();
    
    if (!wedding) {
      throw new ApiError(
        ERROR_CODES.WEDDING_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    const oldData = wedding.toJSON();
    await wedding.update(req.body);
    const newData = wedding.toJSON();

    // Log the operation
    logModelOperation(req, 'UPDATE', 'wedding', wedding.id, oldData, newData);

    // Create audit trail entry
    await AuditLog.createAuditEntry({
      table_name: 'weddings',
      record_id: wedding.id,
      action: 'UPDATE',
      old_values: oldData,
      new_values: newData,
      user_type: 'admin',
      ip_address: req.ip,
      user_agent: req.get('User-Agent'),
      metadata: {
        operation: 'update_wedding_details'
      }
    });

    return ResponseHandler.success(
      res,
      wedding,
      'Wedding details updated successfully'
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
    
    console.error('Error updating wedding details:', error);
    return ResponseHandler.error(
      res,
      ERROR_CODES.INTERNAL_SERVER_ERROR,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      'Failed to update wedding details'
    );
  }
};

// DELETE /api/admin/rsvps/:id - Soft delete RSVP
export const deleteRsvp = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const rsvp = await Rsvp.findByPk(id);
    
    if (!rsvp) {
      throw new ApiError(
        ERROR_CODES.RSVP_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    const oldData = rsvp.toJSON();
    
    // Soft delete the RSVP
    await rsvp.destroy();

    // Log the operation
    logModelOperation(req, 'SOFT_DELETE', 'rsvp', id, oldData, null);

    // Create audit trail entry
    await AuditLog.createAuditEntry({
      table_name: 'rsvps',
      record_id: id,
      action: 'DELETE',
      old_values: oldData,
      new_values: null,
      user_type: 'admin',
      ip_address: req.ip,
      user_agent: req.get('User-Agent'),
      metadata: {
        operation: 'soft_delete_rsvp',
        reason: req.body.reason || 'Admin deletion'
      }
    });

    return ResponseHandler.success(
      res,
      null,
      'RSVP deleted successfully'
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
    
    console.error('Error deleting RSVP:', error);
    return ResponseHandler.error(
      res,
      ERROR_CODES.INTERNAL_SERVER_ERROR,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      'Failed to delete RSVP'
    );
  }
};

// DELETE /api/admin/messages/:id - Soft delete message
export const deleteMessage = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const message = await Message.findByPk(id);
    
    if (!message) {
      throw new ApiError(
        ERROR_CODES.MESSAGE_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    const oldData = message.toJSON();
    
    // Soft delete the message
    await message.destroy();

    // Log the operation
    logModelOperation(req, 'SOFT_DELETE', 'message', id, oldData, null);

    // Create audit trail entry
    await AuditLog.createAuditEntry({
      table_name: 'messages',
      record_id: id,
      action: 'DELETE',
      old_values: oldData,
      new_values: null,
      user_type: 'admin',
      ip_address: req.ip,
      user_agent: req.get('User-Agent'),
      metadata: {
        operation: 'soft_delete_message',
        reason: req.body.reason || 'Admin deletion'
      }
    });

    return ResponseHandler.success(
      res,
      null,
      'Message deleted successfully'
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
    
    console.error('Error deleting message:', error);
    return ResponseHandler.error(
      res,
      ERROR_CODES.INTERNAL_SERVER_ERROR,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      'Failed to delete message'
    );
  }
};

// DELETE /api/admin/photos/:id - Soft delete photo
export const deletePhoto = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const photo = await Photo.findByPk(id);
    
    if (!photo) {
      throw new ApiError(
        ERROR_CODES.PHOTO_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    const oldData = photo.toJSON();
    
    // Soft delete the photo
    await photo.destroy();

    // Log the operation
    logModelOperation(req, 'SOFT_DELETE', 'photo', id, oldData, null);

    // Create audit trail entry
    await AuditLog.createAuditEntry({
      table_name: 'photos',
      record_id: id,
      action: 'DELETE',
      old_values: oldData,
      new_values: null,
      user_type: 'admin',
      ip_address: req.ip,
      user_agent: req.get('User-Agent'),
      metadata: {
        operation: 'soft_delete_photo',
        reason: req.body.reason || 'Admin deletion'
      }
    });

    return ResponseHandler.success(
      res,
      null,
      'Photo deleted successfully'
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
    
    console.error('Error deleting photo:', error);
    return ResponseHandler.error(
      res,
      ERROR_CODES.INTERNAL_SERVER_ERROR,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      'Failed to delete photo'
    );
  }
};

// GET /api/admin/audit-logs - Get audit trail
export const getAuditLogs = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    const offset = parseInt(req.query.offset as string) || 0;
    
    const logs = await AuditLog.findAndCountAll({
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    return ResponseHandler.success(
      res,
      {
        logs: logs.rows,
        total: logs.count,
        limit,
        offset
      },
      'Audit logs retrieved successfully'
    );
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return ResponseHandler.error(
      res,
      ERROR_CODES.INTERNAL_SERVER_ERROR,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      'Failed to retrieve audit logs'
    );
  }
};