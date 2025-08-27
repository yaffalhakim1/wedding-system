'use strict';

import express from 'express';
import { createRsvp, getAllRsvps } from '../controllers/rsvpController.js';
import { validateRsvp } from '../middleware/validation.js';

const router = express.Router();

// POST /api/rsvp - Submit guest RSVP response
router.post('/', validateRsvp, createRsvp);

export default router;
