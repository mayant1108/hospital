import mongoose from 'mongoose';
import AppointmentRequest from '../models/AppointmentRequest.js';
import Clinic from '../models/Clinic.js';
import Doctor from '../models/doctor.js';
import Patient from '../models/patient.js';
import {
  DEFAULT_DEPARTMENTS,
  DEPARTMENT_DETAILS,
  FALLBACK_DOCTORS,
  SITE_CONTENT,
} from '../data/siteContent.js';

const INR_FORMATTER = new Intl.NumberFormat('en-IN');

const toSlug = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const getInitials = (name) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

const unique = (values) =>
  Array.from(new Set(values.filter(Boolean).map((value) => value.trim())));

const buildDepartments = (clinics) => {
  const dbDepartmentNames = unique(
    clinics.flatMap((clinic) => clinic.departments || [])
  );

  const departmentNames = dbDepartmentNames.length
    ? dbDepartmentNames
    : DEFAULT_DEPARTMENTS.map((department) => department.name);

  return departmentNames.map((name, index) => {
    const meta =
      DEPARTMENT_DETAILS[name.toLowerCase()] ||
      DEFAULT_DEPARTMENTS[index % DEFAULT_DEPARTMENTS.length];

    return {
      id: toSlug(name),
      name,
      icon: meta.icon,
      description:
        DEPARTMENT_DETAILS[name.toLowerCase()]?.description ||
        `Specialist consultation, diagnostics, treatment planning, and follow-up care for ${name}.`,
      services:
        DEPARTMENT_DETAILS[name.toLowerCase()]?.services ||
        ['Consultation', 'Diagnostics', 'Follow-up care'],
      clinics: clinics
        .filter((clinic) => (clinic.departments || []).includes(name))
        .map((clinic) => clinic.name),
    };
  });
};

const formatDoctor = (doctor) => {
  const name = doctor.user?.name || `Dr. ${doctor.specialization} Specialist`;

  return {
    id: String(doctor._id),
    name,
    initials: getInitials(name),
    specialization: doctor.specialization,
    experience: doctor.experience,
    fees: doctor.fees,
    availableDays: doctor.availableDays || [],
    availableTime: doctor.availableTime,
    clinic: doctor.clinic?.name || 'Aarogya Care Hospital',
    phone: doctor.user?.phone || SITE_CONTENT.contact.phone,
  };
};

const buildMetrics = ({ doctorsCount, departmentCount, patientsCount }) =>
  SITE_CONTENT.metrics.map((metric) => {
    if (metric.key === 'specialists' && doctorsCount >= 10) {
      return { ...metric, value: `${INR_FORMATTER.format(doctorsCount)}+` };
    }

    if (metric.key === 'departments' && departmentCount >= 8) {
      return { ...metric, value: `${INR_FORMATTER.format(departmentCount)}+` };
    }

    if (metric.key === 'patients' && patientsCount >= 1000) {
      return {
        ...metric,
        value: `${INR_FORMATTER.format(patientsCount)}+`,
        label: 'Registered patients',
      };
    }

    return metric;
  });

export const getSiteData = async (req, res) => {
  try {
    const [clinics, doctors, doctorsCount, patientsCount] = await Promise.all([
      Clinic.find().sort({ name: 1 }).lean(),
      Doctor.find()
        .populate('user', 'name phone email')
        .populate('clinic', 'name address phone email')
        .sort({ experience: -1, createdAt: -1 })
        .limit(6)
        .lean(),
      Doctor.countDocuments(),
      Patient.countDocuments(),
    ]);

    const departments = buildDepartments(clinics);
    const formattedDoctors = doctors.length
      ? doctors.map(formatDoctor)
      : FALLBACK_DOCTORS.map((doctor) => ({
          ...doctor,
          initials: getInitials(doctor.name),
        }));

    const branches = clinics.length
      ? clinics.map((clinic) => ({
          id: String(clinic._id),
          name: clinic.name,
          address: clinic.address,
          phone: clinic.phone,
          email: clinic.email,
          departments: clinic.departments || [],
        }))
      : [
          {
            id: 'main-wing',
            name: 'Aarogya Main Wing',
            address: SITE_CONTENT.contact.address,
            phone: SITE_CONTENT.contact.phone,
            email: SITE_CONTENT.contact.email,
            departments: departments.map((department) => department.name),
          },
        ];

    res.json({
      success: true,
      data: {
        ...SITE_CONTENT,
        metrics: buildMetrics({
          doctorsCount,
          departmentCount: departments.length,
          patientsCount,
        }),
        departments,
        doctors: formattedDoctors,
        branches,
        appointment: {
          ...SITE_CONTENT.appointment,
          departments: departments.map((department) => department.name),
          doctors: formattedDoctors.map((doctor) => ({
            id: doctor.id,
            name: doctor.name,
            specialization: doctor.specialization,
          })),
        },
        lastUpdated: new Date(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createAppointmentRequest = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      department,
      doctorId,
      preferredDate,
      preferredTime,
      message,
    } = req.body;

    if (!name || !phone || !department) {
      return res.status(400).json({
        success: false,
        message: 'Name, phone, and department are required',
      });
    }

    const doctor =
      doctorId && mongoose.Types.ObjectId.isValid(doctorId)
        ? doctorId
        : undefined;

    const appointmentRequest = await AppointmentRequest.create({
      name,
      phone,
      email,
      department,
      doctor,
      preferredDate: preferredDate || undefined,
      preferredTime,
      message,
    });

    res.status(201).json({
      success: true,
      message: 'Appointment request received. Our care desk will call shortly.',
      data: {
        id: appointmentRequest._id,
        status: appointmentRequest.status,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
