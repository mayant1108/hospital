import express from 'express';
import Clinic from '../models/Clinic.js';
import { getClinics, getClinic, createClinic, updateClinic, deleteClinic } from '../controller/Clinic.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getClinics)
  .post(protect, createClinic);

router.route('/:id')
  .get(getClinic)
  .put(protect, updateClinic)
  .delete(protect, deleteClinic);

export default router;
