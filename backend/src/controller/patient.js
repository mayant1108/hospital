import Patient from '../models/patient.js';
import User from '../models/User.js';

const patientPopulate = 'name email phone role';

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

const getPatientPayload = (body) => {
  const payload = {};

  ['age', 'gender', 'address'].forEach((field) => {
    if (body[field] !== undefined && body[field] !== '') payload[field] = body[field];
  });

  if (Array.isArray(body.medicalHistory)) {
    payload.medicalHistory = body.medicalHistory;
  }

  return payload;
};

const populatePatient = (query) => query.populate('user', patientPopulate);

const updateLinkedUser = async (userId, body) => {
  const payload = getUserPayload(body, 'patient');
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

// Get all patients
export const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find()
      .populate('user', patientPopulate)
      .sort({ createdAt: -1 });
    res.json({ success: true, count: patients.length, data: patients });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single patient
export const getPatient = async (req, res) => {
  try {
    const patient = await populatePatient(Patient.findById(req.params.id));
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
    let userId = getObjectUserId(req.body.user || req.body.userId);

    if (!userId) {
      const user = await createLinkedUser(req.body, 'patient');
      userId = user._id;
    }

    const patient = await Patient.create({
      ...getPatientPayload(req.body),
      user: userId,
    });

    const populated = await populatePatient(Patient.findById(patient._id));
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update patient
export const updatePatient = async (req, res) => {
  try {
    const existingPatient = await Patient.findById(req.params.id);

    if (!existingPatient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    await updateLinkedUser(existingPatient.user, req.body);

    await Patient.findByIdAndUpdate(req.params.id, getPatientPayload(req.body), {
      new: true,
      runValidators: true,
    });

    const patient = await populatePatient(Patient.findById(req.params.id));
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
};
