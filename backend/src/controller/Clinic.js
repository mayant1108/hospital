import Clinic from '../models/Clinic.js';
import protect from '../middleware/auth.js';

// Note: Model is named 'Hospital' internally, using Clinic for routes/controller

// Get all clinics
export const getClinics = async (req, res) => {
  try {
    const { name, department } = req.query;
    let query = {};
    if (name) query.name = { $regex: name, $options: 'i' };
    if (department) query.departments = department;

    const clinics = await Clinic.find(query).sort({ name: 1 });
    res.json({ success: true, count: clinics.length, data: clinics });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single clinic
export const getClinic = async (req, res) => {
  try {
    const clinic = await Clinic.findById(req.params.id);
    if (!clinic) {
      return res.status(404).json({ success: false, message: 'Clinic not found' });
    }
    res.json({ success: true, data: clinic });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create clinic
export const createClinic = async (req, res) => {
  try {
    const clinic = new Clinic(req.body);
    await clinic.save();
    res.status(201).json({ success: true, data: clinic });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update clinic
export const updateClinic = async (req, res) => {
  try {
    const clinic = await Clinic.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!clinic) {
      return res.status(404).json({ success: false, message: 'Clinic not found' });
    }
    res.json({ success: true, data: clinic });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete clinic
export const deleteClinic = async (req, res) => {
  try {
    const clinic = await Clinic.findByIdAndDelete(req.params.id);
    if (!clinic) {
      return res.status(404).json({ success: false, message: 'Clinic not found' });
    }
    res.json({ success: true, message: 'Clinic deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
