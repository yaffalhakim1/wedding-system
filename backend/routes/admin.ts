import express, { Router } from 'express';
import { getAllRsvps } from '../controllers/rsvpController.js';
import { 
  getAdminStats, 
  adminLogin,
  updateMessageStatus,
  updatePhotoStatus,
  updateWeddingDetails,
  deleteRsvp,
  deleteMessage,
  deletePhoto,
  getAuditLogs
} from '../controllers/adminController.js';
import { validateAdminLogin, validateWeddingUpdate } from '../middleware/validation.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router: Router = express.Router();

// POST /api/admin/login - Admin authentication
router.post('/login', validateAdminLogin, adminLogin);

// Protected admin routes (require authentication)
router.use(authenticateAdmin);

// GET /api/admin/stats - Get dashboard statistics
router.get('/stats', getAdminStats);

// GET /api/admin/rsvps - Get all RSVP responses (admin only)
router.get('/rsvps', getAllRsvps);

// PUT /api/admin/messages/:id - Approve/hide messages
router.put('/messages/:id', updateMessageStatus);

// PUT /api/admin/photos/:id - Approve/hide photos
router.put('/photos/:id', updatePhotoStatus);

// PUT /api/admin/wedding - Update wedding details
router.put('/wedding', validateWeddingUpdate, updateWeddingDetails);

// DELETE endpoints (soft delete)
router.delete('/rsvps/:id', deleteRsvp);
router.delete('/messages/:id', deleteMessage);
router.delete('/photos/:id', deletePhoto);

// GET /api/admin/audit-logs - Get audit trail
router.get('/audit-logs', getAuditLogs);

export default router;