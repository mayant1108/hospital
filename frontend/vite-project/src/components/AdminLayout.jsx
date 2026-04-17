import { Link, useLocation } from 'react-router-dom';
import {
  Calendar,
  DollarSign,
  Home,
  LayoutDashboard,
  LogOut,
  Plus,
  Stethoscope,
  UserPlus,
  Users,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/patients', label: 'Patients', icon: Users },
  { path: '/doctors', label: 'Doctors', icon: UserPlus },
  { path: '/appointments', label: 'Appointments', icon: Calendar },
  { path: '/payments', label: 'Payments', icon: DollarSign },
];

const AdminLayout = ({ title, description, actions, children }) => {
  const { logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#f7f8fb] text-[#111827]">
      <header className="border-b border-slate-200/70 bg-[#f7f8fb]">
        <div className="mx-auto max-w-[1500px] px-5 py-7 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-600/25">
                  <Stethoscope className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-bold uppercase text-blue-600">
                    Hospital Admin
                  </p>
                  <p className="text-xs font-semibold text-slate-500">
                    AarogyaCare Management
                  </p>
                </div>
              </div>
              <h1 className="mt-5 text-4xl font-extrabold leading-tight text-[#111827]">
                {title}
              </h1>
              {description ? (
                <p className="mt-2 max-w-3xl text-lg font-medium leading-7 text-slate-500">
                  {description}
                </p>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-700"
              >
                <Home className="h-4 w-4" aria-hidden="true" />
                Website
              </Link>
              {actions}
              <button
                type="button"
                onClick={logout}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:border-red-200 hover:text-red-600"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Logout
              </button>
            </div>
          </div>

          <nav className="mt-7 flex gap-2 overflow-x-auto pb-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex h-11 shrink-0 items-center gap-2 rounded-lg px-4 text-sm font-bold transition ${
                    active
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                      : 'bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 hover:text-blue-700 hover:ring-blue-200'
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10">
        {children}
      </main>
    </div>
  );
};

export const AdminActionButton = ({ children, ...props }) => (
  <button
    type="button"
    className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-extrabold text-white shadow-xl shadow-blue-600/25 transition hover:bg-blue-700"
    {...props}
  >
    <Plus className="h-5 w-5" aria-hidden="true" />
    {children}
  </button>
);

export default AdminLayout;
