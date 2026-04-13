import { useAuth } from '../hooks/useAuth';
import { useGet } from '../hooks/useApi';
import Sidebar from '../components/Sidebar';
import { Users, Calendar, DollarSign, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  const { data: patientsData } = useGet('/patients');
  const { data: appointmentsData } = useGet('/appointments');
  const { data: paymentsData } = useGet('/payments');

  const getStatColor = (index) => {
    const colors = [
      { bg: 'bg-blue-50', text: 'text-blue-600', icon: 'text-blue-600' },
      { bg: 'bg-green-50', text: 'text-green-600', icon: 'text-green-600' },
      { bg: 'bg-purple-50', text: 'text-purple-600', icon: 'text-purple-600' }
    ];
    return colors[index];
  };

  const stats = [
    { 
      title: 'Total Patients', 
      value: patientsData?.count?.toLocaleString() || '0', 
      change: '+12%', 
      icon: Users,
      colorIndex: 0
    },
    { 
      title: 'Appointments', 
      value: appointmentsData?.count?.toLocaleString() || '0', 
      change: '+5%', 
      icon: Calendar,
      colorIndex: 1
    },
    { 
      title: 'Revenue', 
      value: paymentsData?.count ? `$${(paymentsData.count * 150).toLocaleString()}` : '$0', 
      change: '+8%', 
      icon: DollarSign,
      colorIndex: 2
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back, {user?.name || 'Doctor'}! 👋</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => {
              const colors = getStatColor(stat.colorIndex);
              return (
                <div 
                  key={index} 
                  className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 border border-gray-100"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 mb-2">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                        <span className="text-sm text-green-600 font-medium">{stat.change} from last month</span>
                      </div>
                    </div>
                    <div className={`${colors.bg} p-4 rounded-lg`}>
                      <stat.icon className={`w-8 h-8 ${colors.icon}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-md border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                <span className="text-sm text-gray-500">Last 7 days</span>
              </div>
              <div className="space-y-4">
                <div className="flex items-start p-4 bg-gradient-to-r from-green-50 to-transparent rounded-lg border border-green-100">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-1.5 mr-4 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">New appointment booked</p>
                    <p className="text-sm text-gray-600 mt-1">John Doe scheduled with Dr. Sarah</p>
                    <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start p-4 bg-gradient-to-r from-blue-50 to-transparent rounded-lg border border-blue-100">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mt-1.5 mr-4 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Patient record updated</p>
                    <p className="text-sm text-gray-600 mt-1">Medical history updated for Maria Johnson</p>
                    <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start p-4 bg-gradient-to-r from-purple-50 to-transparent rounded-lg border border-purple-100">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mt-1.5 mr-4 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Payment processed</p>
                    <p className="text-sm text-gray-600 mt-1">$250 payment received for appointment</p>
                    <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-2xl shadow-md text-white">
                <p className="text-blue-100 text-sm font-medium mb-2">This Month</p>
                <p className="text-3xl font-bold mb-4">32</p>
                <p className="text-blue-100 text-sm">Appointments Completed</p>
              </div>
              <div className="bg-gradient-to-br from-green-600 to-green-700 p-6 rounded-2xl shadow-md text-white">
                <p className="text-green-100 text-sm font-medium mb-2">Avg Rating</p>
                <p className="text-3xl font-bold mb-4">4.8/5</p>
                <p className="text-green-100 text-sm">Patient Satisfaction</p>
              </div>
              <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-6 rounded-2xl shadow-md text-white">
                <p className="text-purple-100 text-sm font-medium mb-2">Pending</p>
                <p className="text-3xl font-bold mb-4">7</p>
                <p className="text-purple-100 text-sm">Follow-up Appointments</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

