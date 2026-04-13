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

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Vite default, update for frontend
    credentials: true
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API routes with /api prefix
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/clinics', clinicRoutes);
app.use('/api/payments', paymentRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'Backend ready' }));

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
    }
};

startServer();

// module.exports = app; // Removed for ES module compatibility
