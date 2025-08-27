import express, { Router } from 'express';
import { createRsvp, getAllRsvps } from '../controllers/rsvpController.js';
import { validateRsvp } from '../middleware/validation.js';

const router: Router = express.Router();

// POST /api/rsvp - Submit guest RSVP response
router.post('/', validateRsvp, createRsvp);

export default router;
