import Doctor from '../models/doctor.js';
import User from '../models/User.js';

const userFields = 'name email phone role';
const clinicFields = 'name address phone email departments';

const getObjectUserId = (value) => {
  if (!value) return null;
  if (typeof value === 'string') return value;
  return value._id || value.id || null;
};

const getUserPayload = (body, defaultRole) => {
  const source =
    body.user && typeof body.user === 'object' ? { ...body, ...body.user } : body;
  const payload = {};

  ['name', 'email', 'phone', 'password'].forEach((field) => {
    if (source[field]) payload[field] = source[field];
  });

  payload.role = source.role || body.role || defaultRole;
  return payload;
};

const createLinkedUser = async (body, role) => {
  const timestamp = Date.now();
  const userPayload = getUserPayload(body, role);

  userPayload.name = userPayload.name || `${role} ${timestamp}`;
  userPayload.email = userPayload.email || `${role}-${timestamp}@hospital.local`;
  userPayload.phone =
    userPayload.phone || String(timestamp).slice(-10).padStart(10, '0');
  userPayload.password = userPayload.password || 'password123';

  return User.create(userPayload);
};

const getDoctorPayload = (body) => {
  const payload = {};

  ['specialization', 'experience', 'fees', 'availableTime', 'clinic'].forEach((field) => {
    if (body[field] !== undefined && body[field] !== '') payload[field] = body[field];
  });

  if (Array.isArray(body.availableDays)) {
    payload.availableDays = body.availableDays;
  }

  if (payload.clinic === null) {
    delete payload.clinic;
  }

  return payload;
};

const populateDoctor = (query) =>
  query.populate('user', userFields).populate('clinic', clinicFields);

const updateLinkedUser = async (userId, body) => {
  const payload = getUserPayload(body, 'doctor');
  delete payload.role;

  if (!payload.password) delete payload.password;

  const fields = Object.keys(payload).filter((field) => payload[field] !== undefined);
  if (!userId || fields.length === 0) return;

  const user = await User.findById(userId).select('+password');
  if (!user) return;

  fields.forEach((field) => {
    user[field] = payload[field];
  });

  await user.save();
};

// Get all doctors
export const getAllDoctors = async (req, res) => {
  try {
    const { specialization, hospitalName } = req.query;
    const query = {};

    if (specialization) query.specialization = specialization;
    if (hospitalName) query.hospitalName = { $regex: hospitalName, $options: 'i' };

    const doctors = await Doctor.find(query)
      .populate('user', userFields)
      .populate('clinic', clinicFields)
      .sort({ createdAt: -1 });
    res.json({ success: true, count: doctors.length, data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single doctor
export const getDoctor = async (req, res) => {
  try {
    const doctor = await populateDoctor(Doctor.findById(req.params.id));
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
    let userId = getObjectUserId(req.body.user || req.body.userId);

    if (!userId) {
      const user = await createLinkedUser(req.body, 'doctor');
      userId = user._id;
    }

    const doctor = await Doctor.create({
      ...getDoctorPayload(req.body),
      user: userId,
    });

    const populated = await populateDoctor(Doctor.findById(doctor._id));
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update doctor
export const updateDoctor = async (req, res) => {
  try {
    const existingDoctor = await Doctor.findById(req.params.id);

    if (!existingDoctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    await updateLinkedUser(existingDoctor.user, req.body);

    await Doctor.findByIdAndUpdate(req.params.id, getDoctorPayload(req.body), {
      new: true,
      runValidators: true,
    });

    const doctor = await populateDoctor(Doctor.findById(req.params.id));
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
};
