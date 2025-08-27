import express, { Router } from 'express';
import {
  createMessage,
  getApprovedMessages,
} from '../controllers/messageController.js';
import { validateMessage } from '../middleware/validation.js';

const router: Router = express.Router();

// POST /api/messages - Submit guest message/congratulations
router.post('/', validateMessage, createMessage);

// GET /api/messages - Get approved messages for display
router.get('/', getApprovedMessages);

export default router;
