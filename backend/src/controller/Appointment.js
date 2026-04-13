import Appointment from '../models/Appointment.js';
import protect from '../middleware/auth.js';

// Get all appointments
export const getAppointments = async (req, res) => {
  try {
    const { patient, doctor, status, date } = req.query;
    let query = {};
    if (patient) query.patient = patient;
    if (doctor) query.doctor = doctor;
    if (status) query.status = status;
    if (date) query.date = { $gte: new Date(date) };

    const appointments = await Appointment.find(query)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name specialization')
      .sort({ date: 1, time: 1 });
    
    res.json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single appointment
export const getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name specialization');
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    res.json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create appointment
export const createAppointment = async (req, res) => {
  try {
    const appointment = new Appointment(req.body);
    await appointment.save();
    const populated = await Appointment.findById(appointment._id)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name specialization');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update appointment
export const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    ).populate('patient', 'name email phone')
     .populate('doctor', 'name specialization');
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    res.json({ success: true, data: appointment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete appointment
export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    res.json({ success: true, message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
