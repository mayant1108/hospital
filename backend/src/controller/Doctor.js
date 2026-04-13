import Doctor from '../models/doctor.js';
import protect from '../middleware/auth.js';

// Get all doctors
export const getAllDoctors = async (req, res) => {
  try {
    const { specialization, hospitalName } = req.query;
    let query = {};
    if (specialization) query.specialization = specialization;
    if (hospitalName) query.hospitalName = { $regex: hospitalName, $options: 'i' };

    const doctors = await Doctor.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: doctors.length, data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single doctor
export const getDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    res.json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create doctor
export const createDoctor = async (req, res) => {
  try {
    const doctor = new Doctor(req.body);
    await doctor.save();
    res.status(201).json({ success: true, data: doctor });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update doctor
export const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    res.json({ success: true, data: doctor });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete doctor
export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    res.json({ success: true, message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
