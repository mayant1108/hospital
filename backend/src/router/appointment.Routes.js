import express from 'express';
import { getAppointments, getAppointment, createAppointment, updateAppointment, deleteAppointment } from '../controller/Appointment.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getAppointments)
  .post(protect, createAppointment);

router.route('/:id')
  .get(getAppointment)
  .put(protect, updateAppointment)
  .delete(protect, deleteAppointment);

export default router;
