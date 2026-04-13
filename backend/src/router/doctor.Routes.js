import express from 'express';
import { getAllDoctors, getDoctor, createDoctor, updateDoctor, deleteDoctor } from '../controller/Doctor.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getAllDoctors)
  .post(protect, createDoctor);

router.route('/:id')
  .get(getDoctor)
  .put(protect, updateDoctor)
  .delete(protect, deleteDoctor);

export default router;
