'use strict';

import express from 'express';
import { getAllRsvps } from '../controllers/rsvpController.js';

const router = express.Router();

// GET /api/admin/rsvps - Get all RSVP responses (admin only)
router.get('/rsvps', getAllRsvps);

export default router;
