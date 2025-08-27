import express, { Router } from 'express';
import { getWedding } from '../controllers/weddingController.js';

const router: Router = express.Router();

// GET /api/wedding - Get wedding information and details
router.get('/', getWedding);

export default router;
