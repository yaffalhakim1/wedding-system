import express, { Router } from 'express';
import { getAllRsvps } from '../controllers/rsvpController.js';

const router: Router = express.Router();

// GET /api/admin/rsvps - Get all RSVP responses (admin only)
router.get('/rsvps', getAllRsvps);

export default router;
