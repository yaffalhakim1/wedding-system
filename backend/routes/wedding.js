'use strict';

import express from 'express';
import { getWedding } from '../controllers/weddingController.js';

const router = express.Router();

// GET /api/wedding - Get wedding information and details
router.get('/', getWedding);

export default router;
