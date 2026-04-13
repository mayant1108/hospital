import Prescription from '../models/Prescription.js';
import protect from '../middleware/auth.js';

// Get all prescriptions
export const getPrescriptions = async (req, res) => {
  try {
    const { patient, doctor } = req.query;
    let query = {};
    if (patient) query.patient = patient;
    if (doctor) query.doctor = doctor;

    const prescriptions = await Prescription.find(query)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name specialization')
      .sort({ date: -1 });
    
    res.json({ success: true, count: prescriptions.length, data: prescriptions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single prescription
export const getPrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name specialization');
    if (!prescription) {
      return res.status(404).json({ success: false, message: 'Prescription not found' });
    }
    res.json({ success: true, data: prescription });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create prescription
export const createPrescription = async (req, res) => {
  try {
    const prescription = new Prescription(req.body);
    await prescription.save();
    const populated = await Prescription.findById(prescription._id)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name specialization');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update prescription
export const updatePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    ).populate('patient', 'name email phone')
     .populate('doctor', 'name specialization');
    if (!prescription) {
      return res.status(404).json({ success: false, message: 'Prescription not found' });
    }
    res.json({ success: true, data: prescription });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete prescription
export const deletePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndDelete(req.params.id);
    if (!prescription) {
      return res.status(404).json({ success: false, message: 'Prescription not found' });
    }
    res.json({ success: true, message: 'Prescription deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
