import express from 'express';
import {
  createAppointmentRequest,
  getSiteData,
} from '../controller/site.js';

const router = express.Router();

router.get('/', getSiteData);
router.post('/appointment-requests', createAppointmentRequest);

export default router;
