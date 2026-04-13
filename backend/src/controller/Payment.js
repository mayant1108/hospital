import Payment from '../models/Payment.js';
import protect from '../middleware/auth.js';

// Get all payments
export const getPayments = async (req, res) => {
  try {
    const { patient, status } = req.query;
    let query = {};
    if (patient) query.patient = patient;
    if (status) query.status = status;

    const payments = await Payment.find(query)
      .populate('patient', 'name email')
      .populate('appointment', 'date time status')
      .sort({ date: -1 });
    
    res.json({ success: true, count: payments.length, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single payment
export const getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('patient', 'name email')
      .populate('appointment', 'date time status');
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }
    res.json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create payment
export const createPayment = async (req, res) => {
  try {
    const payment = new Payment(req.body);
    await payment.save();
    const populated = await Payment.findById(payment._id)
      .populate('patient', 'name email')
      .populate('appointment', 'date time status');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update payment (e.g., status)
export const updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    ).populate('patient', 'name email')
     .populate('appointment', 'date time status');
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }
    res.json({ success: true, data: payment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete payment
export const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }
    res.json({ success: true, message: 'Payment deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
