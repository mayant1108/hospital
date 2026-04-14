# Hospital Management System

## Backend Setup
1. Copy `.env.example` to `.env` and add MongoDB URI + JWT_SECRET
2. `cd backend && npm install`
3. `npm run seed` (populate demo data)
4. `npm run dev` (port 5000)

Demo login: doctor@hospital.com / password123

## Frontend Setup
1. `cd frontend/vite-project && npm install`
2. `npm run dev` (port 5173)

## Features
- Full CRUD for Patients, Doctors, Appointments, Payments, Prescriptions, Clinics
- JWT Auth (register/login)
- Dashboard with real-time stats
- Responsive Tailwind UI
- React Query for data fetching

## API Endpoints
```
POST /api/auth/register, /api/auth/login
GET /api/patients, /api/doctors, /api/appointments, /api/payments
GET /api/stats (dashboard)
```

