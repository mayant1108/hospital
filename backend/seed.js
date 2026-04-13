import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from './src/config/database.js';
import User from './src/models/User.js';
import Patient from './src/models/patient.js';
import Doctor from './src/models/doctor.js';
import Clinic from './src/models/Clinic.js';
import Appointment from './src/models/Appointment.js';
import Payment from './src/models/Payment.js';

const seedData = async () => {
  await connectDB();

  // Clear existing data
  await Promise.all([
    User.deleteMany({}),
    Patient.deleteMany({}),
    Doctor.deleteMany({}),
    Clinic.deleteMany({}),
    Appointment.deleteMany({}),
    Payment.deleteMany({})
  ]);

  console.log('🧹 Cleared existing data');

  // Create Users
  const users = await User.insertMany([
    { 
      name: 'Dr. Sarah Smith', 
      email: 'doctor@hospital.com', 
      phone: '5550001234',
      password: 'password123',
      role: 'doctor'
    },
    { 
      name: 'Dr. John Johnson', 
      email: 'john@hospital.com', 
      phone: '5550002234',
      password: 'password123',
      role: 'doctor'
    },
    { 
      name: 'Maria Garcia', 
      email: 'maria@email.com', 
      phone: '5550003234',
      password: 'password123',
      role: 'patient'
    },
    { 
      name: 'John Doe', 
      email: 'john.doe@email.com', 
      phone: '5550004234',
      password: 'password123',
      role: 'patient'
    },
    { 
      name: 'Emma Wilson', 
      email: 'emma@email.com', 
      phone: '5550005234',
      password: 'password123',
      role: 'patient'
    },
  ]);
  console.log('👤 Added', users.length, 'users');

  // Create clinics
  const clinics = await Clinic.insertMany([
    { 
      name: 'City Hospital', 
      address: '123 Main St, City Center', 
      phone: '555-0101', 
      email: 'info@cityhospital.com',
      departments: ['Cardiology', 'Neurology', 'Pediatrics']
    },
    { 
      name: 'HealthCare Clinic', 
      address: '456 Oak Ave, Downtown', 
      phone: '555-0102', 
      email: 'info@healthcareclinic.com',
      departments: ['Neurology', 'Orthopedics']
    },
  ]);
  console.log('🏥 Added', clinics.length, 'clinics');

  // Create doctors with user references
  const doctors = await Doctor.insertMany([
    { 
      name: users[0].name,
      email: users[0].email,
      phone: users[0].phone,
      user: users[0]._id,
      specialization: 'Cardiology', 
      experience: 10, 
      fees: 150, 
      availableDays: ['Monday', 'Wednesday', 'Friday'], 
      availableTime: '09:00-17:00',
      hospitalName: clinics[0].name,
      clinic: clinics[0]._id 
    },
    { 
      name: users[1].name,
      email: users[1].email,
      phone: users[1].phone,
      user: users[1]._id,
      specialization: 'Neurology', 
      experience: 8, 
      fees: 200, 
      availableDays: ['Tuesday', 'Thursday'], 
      availableTime: '10:00-16:00', 
      hospitalName: clinics[1].name,
      clinic: clinics[1]._id 
    },
  ]);
  console.log('👨‍⚕️ Added', doctors.length, 'doctors');

  // Create patients with user references
  const patients = await Patient.insertMany([
    { 
      name: users[2].name,
      email: users[2].email,
      phone: users[2].phone,
      user: users[2]._id,
      age: 45, 
      gender: 'Female', 
      address: '789 Pine St, City Center',
      medicalHistory: [{ condition: 'Hypertension', diagnosedDate: new Date('2023-01-15'), notes: 'Regular checkups' }]
    },
    { 
      name: users[3].name,
      email: users[3].email,
      phone: users[3].phone,
      user: users[3]._id,
      age: 35, 
      gender: 'Male', 
      address: '321 Elm St, Downtown',
      medicalHistory: [{ condition: 'Asthma', diagnosedDate: new Date('2024-03-10'), notes: 'Mild' }]
    },
    { 
      name: users[4].name,
      email: users[4].email,
      phone: users[4].phone,
      user: users[4]._id,
      age: 28, 
      gender: 'Female', 
      address: '654 Birch Rd, Suburbia',
      medicalHistory: []
    },
  ]);
  console.log('👶 Added', patients.length, 'patients');

  // Create appointments
  const appointments = await Appointment.insertMany([
    { 
      appointmentId: 'APT001',
      patient: patients[0]._id, 
      doctor: doctors[0]._id, 
      clinic: clinics[0]._id,
      date: new Date('2024-07-20'), 
      time: '10:00', 
      status: 'confirmed' 
    },
    { 
      appointmentId: 'APT002',
      patient: patients[1]._id, 
      doctor: doctors[1]._id, 
      clinic: clinics[1]._id,
      date: new Date('2024-07-22'), 
      time: '14:00', 
      status: 'completed' 
    },
    { 
      appointmentId: 'APT003',
      patient: patients[2]._id, 
      doctor: doctors[0]._id, 
      clinic: clinics[0]._id,
      date: new Date('2024-07-25'), 
      time: '11:00', 
      status: 'pending' 
    },
  ]);
  console.log('📅 Added', appointments.length, 'appointments');

  // Create payments
  const payments = await Payment.insertMany([
    {
      paymentId: 'PAY001',
      patient: patients[0]._id,
      appointment: appointments[0]._id,
      patientName: patients[0].name,
      amount: 150,
      date: new Date('2024-07-20'),
      status: 'paid',
      paymentMethod: 'Card'
    },
    {
      paymentId: 'PAY002',
      patient: patients[1]._id,
      appointment: appointments[1]._id,
      patientName: patients[1].name,
      amount: 200,
      date: new Date('2024-07-22'),
      status: 'paid',
      paymentMethod: 'UPI'
    },
    {
      paymentId: 'PAY003',
      patient: patients[2]._id,
      appointment: appointments[2]._id,
      patientName: patients[2].name,
      amount: 150,
      date: new Date('2024-07-25'),
      status: 'pending',
      paymentMethod: 'Cash'
    },
  ]);
  console.log('💰 Added', payments.length, 'payments');

  console.log('\n✅ Seeding complete! App now has real data. Refresh browser.');
  console.log('\n📝 Demo Login Credentials:');
  console.log('Email: doctor@hospital.com');
  console.log('Password: password123');
  
  process.exit(0);
};

seedData().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
