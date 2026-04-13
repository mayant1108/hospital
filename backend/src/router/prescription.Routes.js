import express from 'express';
import { getPrescriptions, getPrescription, createPrescription, updatePrescription, deletePrescription } from '../controller/Prescription.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getPrescriptions)
  .post(protect, createPrescription);

router.route('/:id')
  .get(getPrescription)
  .put(protect, updatePrescription)
  .delete(protect, deletePrescription);

export default router;
