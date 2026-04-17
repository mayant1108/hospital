import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './src/config/database.js';

// Import routes
import authRoutes from './src/router/auth.routes.js';
import patientRoutes from './src/router/patient.routes.js';
import doctorRoutes from './src/router/doctor.Routes.js';
import appointmentRoutes from './src/router/appointment.Routes.js';
import prescriptionRoutes from './src/router/prescription.Routes.js';
import clinicRoutes from './src/router/clinic.Routes.js';
import paymentRoutes from './src/router/payment.routes.js';
import statsRoutes from './src/router/stats.routes.js';
import siteRoutes from './src/router/site.routes.js';

const app = express();

/* -------------------- Middleware -------------------- */
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      'http://127.0.0.1:5173',
    ],
    credentials: true,
  })
);

app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

/* -------------------- Routes -------------------- */
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/clinics', clinicRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/site', siteRoutes);

/* -------------------- Health Check -------------------- */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'OK',
    message: 'Backend is running successfully',
  });
});

/* -------------------- 404 Handler -------------------- */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

/* -------------------- Error Handler -------------------- */
app.use((err, req, res, next) => {
  console.error('Server Error:', err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Something went wrong!',
  });
});

/* -------------------- Server Start -------------------- */
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
