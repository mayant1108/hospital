import Patient from '../models/patient.js';
import Appointment from '../models/Appointment.js';
import Payment from '../models/Payment.js';
import protect from '../middleware/auth.js';

// Dashboard stats endpoint
export const getStats = async (req, res) => {
  try {
    // Total patients
    const totalPatients = await Patient.countDocuments();

    // Appointments (today + this week)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - 7);

    const todayAppointments = await Appointment.countDocuments({ 
      date: { $gte: today } 
    });
    const weekAppointments = await Appointment.countDocuments({ 
      date: { $gte: weekStart } 
    });

    // Revenue (total + this month)
    const totalRevenue = await Payment.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const monthRevenue = await Payment.aggregate([
      { 
        $match: { 
          date: { 
            $gte: new Date(today.getFullYear(), today.getMonth(), 1)
          } 
        } 
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const stats = {
      patients: {
        total: totalPatients,
        todayNew: await Patient.countDocuments({ createdAt: { $gte: today } })
      },
      appointments: {
        today: todayAppointments,
        week: weekAppointments
      },
      revenue: {
        total: totalRevenue[0]?.total || 0,
        month: monthRevenue[0]?.total || 0
      },
      lastUpdated: new Date()
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

