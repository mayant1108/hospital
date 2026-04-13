import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  Calendar, 
  DollarSign, 
  LogOut,
  Stethoscope
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
    <aside className="w-64 bg-gradient-to-b from-blue-600 to-blue-700 h-screen p-6 flex flex-col shadow-lg">
      {/* Logo */}
      <div className="flex items-center mb-10">
        <div className="bg-white bg-opacity-20 p-2 rounded-lg mr-3">
          <Stethoscope className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="text-xl font-bold text-white">Hospital</div>
          <div className="text-xs text-blue-100">Management System</div>
        </div>
      </div>

      {/* User Info */}
      <div className="bg-white bg-opacity-10 p-4 rounded-lg mb-8 border border-white border-opacity-20">
        <p className="text-white text-sm font-medium">Logged in as</p>
        <p className="text-blue-100 text-xs mt-1">{user?.name || 'Doctor'}</p>
        <p className="text-blue-100 text-xs">{user?.email || 'user@hospital.com'}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <p className="text-blue-100 text-xs font-semibold uppercase mb-4 px-3">Menu</p>
        <ul className="space-y-2">
          {navItems.map(({ path, icon: Icon, label }) => (
            <li key={path}>
              <Link
                to={path}
                className={`flex items-center w-full p-3 rounded-lg transition-all duration-200 ${
                  location.pathname === path
                    ? 'bg-white bg-opacity-20 text-white shadow-md border-l-4 border-white'
                    : 'text-blue-100 hover:bg-white hover:bg-opacity-10'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="pt-6 border-t border-white border-opacity-20">
        <button
          onClick={logout}
          className="flex items-center w-full p-3 rounded-lg text-blue-100 hover:bg-red-500 hover:text-white transition-all duration-200 font-medium"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

