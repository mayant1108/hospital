import Patient from '../models/patient.js';
import protect from '../middleware/auth.js'; // Optional auth

// Get all patients
export const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.json({ success: true, count: patients.length, data: patients });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single patient
export const getPatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    res.json({ success: true, data: patient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create patient
export const createPatient = async (req, res) => {
  try {
    const patient = new Patient(req.body);
    await patient.save();
    res.status(201).json({ success: true, data: patient });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update patient
export const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    res.json({ success: true, data: patient });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete patient
export const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    res.json({ success: true, message: 'Patient deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
