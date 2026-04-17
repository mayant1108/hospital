import express from 'express';
import { getStats } from '../controller/stats.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getStats);
router.get('/stats', protect, getStats);

export default router;

