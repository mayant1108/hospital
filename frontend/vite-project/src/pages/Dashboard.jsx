import {
  Activity,
  Calendar,
  ClipboardCheck,
  DollarSign,
  HeartPulse,
  Stethoscope,
  Users,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminLayout, { AdminActionButton } from '../components/AdminLayout';
import { MetricCard, StatusBadge } from '../components/AdminUI';
import { useAuth } from '../hooks/useAuth';
import { useGet } from '../hooks/useApi';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value || 0);

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: statsData } = useGet('/stats');

  const stats = statsData?.data || {};
  const metrics = [
    {
      title: 'Total Patients',
      value: stats.patients?.total?.toLocaleString('en-IN') || '0',
      detail: `${stats.patients?.todayNew || 0} new today`,
      icon: Users,
      tone: 'blue',
    },
    {
      title: 'Today Appointments',
      value: stats.appointments?.today?.toLocaleString('en-IN') || '0',
      detail: `${stats.appointments?.week || 0} this week`,
      icon: Calendar,
      tone: 'blue',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.revenue?.total),
      detail: `${formatCurrency(stats.revenue?.month)} this month`,
      icon: DollarSign,
      tone: 'amber',
    },
    {
      title: 'Care Quality',
      value: '98%',
      detail: 'Patient satisfaction target',
      icon: HeartPulse,
      tone: 'rose',
    },
  ];

  const activity = [
    {
      title: 'Appointments queue reviewed',
      description: 'Front desk should confirm pending visits before 11:00 AM.',
      status: 'confirmed',
    },
    {
      title: 'Patient records updated',
      description: 'New medical history updates are ready for doctor review.',
      status: 'completed',
    },
    {
      title: 'Payment follow-up',
      description: 'Pending payments need billing desk attention today.',
      status: 'pending',
    },
  ];

  return (
    <AdminLayout
      title="Dashboard"
      description={`Welcome back, ${user?.name || 'Admin'}. Monitor hospital operations, patient flow, and revenue from one place.`}
      actions={
        <AdminActionButton onClick={() => navigate('/appointments?new=1')}>
          New Appointment
        </AdminActionButton>
      }
    >
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </section>

      <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-lg bg-white p-8 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-slate-400">
                Operations
              </p>
              <h2 className="mt-2 text-2xl font-extrabold text-[#111827]">
                Hospital Activity
              </h2>
            </div>
            <span className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-slate-600">
              Live overview
            </span>
          </div>

          <div className="mt-6 space-y-4">
            {activity.map((item) => (
              <article
                key={item.title}
                className="flex flex-col gap-4 rounded-lg bg-[#f7f8fb] p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <ClipboardCheck className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-extrabold text-[#111827]">{item.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {item.description}
                    </p>
                  </div>
                </div>
                <StatusBadge status={item.status} />
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-white p-8 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-slate-400">
            Today Focus
          </p>
          <h2 className="mt-2 text-2xl font-extrabold text-[#111827]">Keep care moving smoothly</h2>
          <div className="mt-6 space-y-4">
            <div className="rounded-lg bg-[#f7f8fb] p-5">
              <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-blue-600" />
                <p className="font-extrabold text-[#111827]">Emergency readiness</p>
              </div>
              <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
                Confirm triage desk, duty doctor, and ICU escalation coverage.
              </p>
            </div>
            <div className="rounded-lg bg-[#f7f8fb] p-5">
              <div className="flex items-center gap-3">
                <Stethoscope className="h-5 w-5 text-emerald-600" />
                <p className="font-extrabold text-[#111827]">Doctor schedule</p>
              </div>
              <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
                Review upcoming visits and keep specialist slots updated.
              </p>
            </div>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
};

export default Dashboard;
