import { Link, useLocation } from 'react-router-dom';
import { createElement } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createElement } from 'react';
import {
  Activity,
  ExternalLink,
  LayoutDashboard,
  Users,
  UserPlus,
  Calendar,
  DollarSign,
  LogOut,
  Stethoscope,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/patients', icon: Users, label: 'Patients' },
    { path: '/doctors', icon: UserPlus, label: 'Doctors' },
    { path: '/appointments', icon: Calendar, label: 'Appointments' },
    { path: '/payments', icon: DollarSign, label: 'Payments' },
  ];

  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-white/10 bg-[#052f38] p-5 text-white shadow-xl lg:flex">
      <div className="flex items-center gap-3 border-b border-white/10 pb-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-600">
          <Stethoscope className="h-6 w-6 text-white" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <div className="truncate text-lg font-bold">AarogyaCare</div>
          <div className="text-xs font-medium text-cyan-100">
            Hospital Admin Panel
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-white/10 bg-white/[0.08] p-4">
        <p className="text-xs font-semibold uppercase text-cyan-100">Signed in</p>
        <div className="mt-3 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f6c65b] text-sm font-bold text-slate-950">
            {(user?.name || 'AD').slice(0, 2).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-white">
              {user?.name || 'Admin'}
            </p>
            <p className="truncate text-xs text-cyan-100">
              {user?.email || 'admin@hospital.com'}
            </p>
          </div>
        </div>
      </div>

      <nav className="mt-6 flex-1">
        <p className="mb-3 px-3 text-xs font-semibold uppercase text-cyan-100">
          Workspace
        </p>
        <ul className="space-y-1.5">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex w-full items-center rounded-lg px-3 py-3 text-sm font-semibold transition ${
                  location.pathname === item.path
                    ? 'bg-white text-[#052f38] shadow-sm'
                    : 'text-cyan-50 hover:bg-white/10 hover:text-white'
                }`}
              >
                {createElement(item.icon, {
                  className: 'mr-3 h-5 w-5 shrink-0',
                })}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="space-y-3 border-t border-white/10 pt-5">
        <a
          href="/"
          className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.08] px-3 py-3 text-sm font-semibold text-cyan-50 transition hover:bg-white/[0.12] hover:text-white"
        >
          <span className="inline-flex items-center gap-2">
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            Public website
          </span>
          <Activity className="h-4 w-4 text-[#f6c65b]" aria-hidden="true" />
        </a>
        <button
          onClick={logout}
          className="flex w-full items-center rounded-lg px-3 py-3 text-sm font-semibold text-cyan-50 transition hover:bg-red-500 hover:text-white"
        >
          <LogOut className="mr-3 h-5 w-5" aria-hidden="true" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;


