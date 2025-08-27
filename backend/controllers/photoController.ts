import { Request, Response } from 'express';
import db from '../models/index.js';
import ApiError from '../utils/apiError.js';
import ResponseHandler from '../utils/responseHandler.js';
import { ERROR_CODES, HTTP_STATUS } from '../config/errors.js';
import fs from 'fs';
import path from 'path';

const { Photo, Wedding } = db;

interface UploadPhotoRequest {
  weddingId: string;
  uploaded_by?: string;
  caption?: string;
}

interface RequestWithFile extends Request<{}, any, UploadPhotoRequest> {
  file?: Express.Multer.File;
}

// POST /api/photos - Upload photos with captions
export const uploadPhoto = async (
  req: RequestWithFile,
  res: Response
): Promise<Response> => {
  try {
    const { weddingId, uploaded_by, caption } = req.body;
    const file = req.file;

    if (!file) {
      throw new ApiError(
        ERROR_CODES.BAD_REQUEST,
        HTTP_STATUS.BAD_REQUEST,
        'No file uploaded'
      );
    }

    // Check if wedding exists
    const wedding = await Wedding.findByPk(weddingId);
    if (!wedding) {
      // Delete uploaded file if wedding doesn't exist
      if (file) {
        fs.unlinkSync(file.path);
      }
      throw new ApiError(ERROR_CODES.WEDDING_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const photo = await Photo.create({
      weddingId,
      filename: file.filename,
      original_name: file.originalname,
      file_path: file.path,
      file_size: file.size,
      mime_type: file.mimetype,
      uploaded_by: uploaded_by || null,
      caption: caption || null,
      is_approved: false, // Photos need approval by default
    });

    // Return photo data without sensitive file path
    const photoResponse = {
      id: photo.id,
      filename: photo.filename,
      original_name: photo.original_name,
      file_size: photo.file_size,
      mime_type: photo.mime_type,
      uploaded_by: photo.uploaded_by,
      caption: photo.caption,
      is_approved: photo.is_approved,
      createdAt: photo.createdAt,
    };

    return ResponseHandler.success(
      res,
      photoResponse,
      'Photo uploaded successfully',
      HTTP_STATUS.CREATED
    );
  } catch (error) {
    // Clean up uploaded file on error
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }

    if (error instanceof ApiError) {
      return ResponseHandler.error(
        res,
        error.errorCode,
        error.statusCode,
        error.message
      );
    }

    console.error('Error uploading photo:', error);
    return ResponseHandler.error(
      res,
      ERROR_CODES.INTERNAL_SERVER_ERROR,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      'Failed to upload photo'
    );
  }
};

// GET /api/photos - Get approved photos for gallery
export const getApprovedPhotos = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const photos = await Photo.findAll({
      where: { is_approved: true },
      include: [
        {
          model: Wedding,
          as: 'wedding',
          attributes: ['bride_name', 'groom_name'],
        },
      ],
      attributes: [
        'id',
        'filename',
        'original_name',
        'file_size',
        'mime_type',
        'uploaded_by',
        'caption',
        'createdAt',
      ],
      order: [['createdAt', 'DESC']],
    });

    return ResponseHandler.success(
      res,
      photos,
      'Approved photos retrieved successfully'
    );
  } catch (error) {
    console.error('Error fetching photos:', error);
    return ResponseHandler.error(
      res,
      ERROR_CODES.INTERNAL_SERVER_ERROR,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      'Failed to retrieve photos'
    );
  }
};
