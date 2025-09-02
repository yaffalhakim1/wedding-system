import express, { Router } from 'express';
import {
  uploadPhoto,
  getApprovedPhotos,
} from '../controllers/photoController.js';
import { validatePhotoUpload } from '../middleware/validation.js';
import { uploadPhoto as uploadPhotoMiddleware } from '../middleware/upload.js';

const router: Router = express.Router();

// POST /api/photos - Upload photos with captions
router.post('/', uploadPhotoMiddleware, validatePhotoUpload, uploadPhoto);

// GET /api/photos - Get approved photos for gallery
router.get('/', getApprovedPhotos);

export default router;