import express from 'express';
import { getPayments, getPayment, createPayment, updatePayment, deletePayment } from '../controller/Payment.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getPayments)
  .post(protect, createPayment);

router.route('/:id')
  .get(getPayment)
  .put(protect, updatePayment)
  .delete(protect, deletePayment);

export default router;
