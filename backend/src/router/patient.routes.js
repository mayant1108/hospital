import express from 'express';
import { getAllPatients, getPatient, createPatient, updatePatient, deletePatient } from '../controller/patient.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// Patient routes - protect optional for admin
router.route('/')
  .get(getAllPatients)
  .post(protect, createPatient);

router.route('/:id')
  .get(getPatient)
  .put(protect, updatePatient)
  .delete(protect, deletePatient);

export default router;
