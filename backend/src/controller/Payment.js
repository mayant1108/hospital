import Appointment from '../models/Appointment.js';
import Patient from '../models/patient.js';
import Payment from '../models/Payment.js';

const populatePayment = (query) =>
  query
    .populate('patient', 'name email phone')
    .populate({
      path: 'appointment',
      select: 'date time status patient doctor',
      populate: [
        {
          path: 'patient',
          select: 'age gender user',
          populate: { path: 'user', select: 'name email phone' },
        },
        {
          path: 'doctor',
          select: 'specialization fees user',
          populate: { path: 'user', select: 'name email phone' },
        },
      ],
    });

const resolvePaymentPatient = async ({ patient, appointment }) => {
  if (patient) {
    const patientProfile = await Patient.findById(patient).select('user');
    return patientProfile?.user || patient;
  }

  if (!appointment) return patient;

  const appointmentDoc = await Appointment.findById(appointment)
    .populate('patient', 'user')
    .select('patient');

  return appointmentDoc?.patient?.user || appointmentDoc?.patient || patient;
};

// Get all payments
export const getPayments = async (req, res) => {
  try {
    const { patient, status } = req.query;
    const query = {};
    if (patient) query.patient = patient;
    if (status) query.status = status;

    const payments = await populatePayment(Payment.find(query)).sort({ date: -1 });

    res.json({ success: true, count: payments.length, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single payment
export const getPayment = async (req, res) => {
  try {
    const payment = await populatePayment(Payment.findById(req.params.id));
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
    const patient = await resolvePaymentPatient(req.body);
    const payment = await Payment.create({
      ...req.body,
      patient,
    });

    const populated = await populatePayment(Payment.findById(payment._id));
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update payment (e.g., status)
export const updatePayment = async (req, res) => {
  try {
    const payload = { ...req.body };

    if (payload.patient || payload.appointment) {
      payload.patient = await resolvePaymentPatient(payload);
    }

    const payment = await populatePayment(
      Payment.findByIdAndUpdate(req.params.id, payload, {
        new: true,
        runValidators: true,
      })
    );

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
};
