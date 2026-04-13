import { useGet } from '../hooks/useApi';
import Table from '../components/Table';
import Sidebar from '../components/Sidebar';
import { Loader2, Plus, Search, Filter } from 'lucide-react';
import { useState } from 'react';

const Appointments = () => {
  const { data, isLoading } = useGet('/appointments');
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    'ID',
    'Patient',
    'Doctor',
    'Date & Time',
    'Status',
    'Actions'
  ];

  const filteredAppointments =
    data?.data?.filter((appointment) =>
      (appointment.patient?.name || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (appointment.doctor?.name || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    ) || [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-50 text-green-700';
      case 'cancelled':
        return 'bg-red-50 text-red-700';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Appointments</h1>
              <p className="text-gray-600 mt-2">
                Manage and schedule appointments
              </p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center font-medium">
              <Plus className="w-4 h-4 mr-2" />
              New Appointment
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by patient or doctor name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-gray-700">
              <Filter className="w-5 h-5" />
              Filter
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            {isLoading ? (
              <div className="p-12 text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-400" />
                <p className="text-gray-500">Loading appointments...</p>
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-500 mb-4">No appointments found</p>
                <button className="text-blue-600 hover:text-blue-800 font-medium">
                  Book first appointment
                </button>
              </div>
            ) : (
              <Table>
                <Table.Header>
                  <Table.Row>
                    {columns.map((column) => (
                      <Table.Head key={column}>{column}</Table.Head>
                    ))}
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {filteredAppointments.map((appointment) => (
                    <Table.Row key={appointment._id}>
                      <Table.Cell className="font-medium text-blue-600">
                        {appointment.appointmentId ||
                          appointment._id.slice(-6)}
                      </Table.Cell>

                      <Table.Cell className="font-medium">
                        {appointment.patient?.name}
                      </Table.Cell>

                      <Table.Cell>
                        {appointment.doctor?.name}
                      </Table.Cell>

                      <Table.Cell>
                        <div>
                          <p className="font-medium">
                            {new Date(
                              appointment.date
                            ).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-500">
                            {appointment.time}
                          </p>
                        </div>
                      </Table.Cell>

                      <Table.Cell>
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            appointment.status
                          )}`}
                        >
                          {appointment.status}
                        </span>
                      </Table.Cell>

                      <Table.Cell>
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            View
                          </button>
                          <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                            Reschedule
                          </button>
                          <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                            Cancel
                          </button>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Appointments;

