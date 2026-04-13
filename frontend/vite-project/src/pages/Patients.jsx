import { useGet } from '../hooks/useApi';
import { Button } from '../components/Button';
import Table from '../components/Table';
import Sidebar from '../components/Sidebar';
import { Loader2, Plus, Search, Filter } from 'lucide-react';
import { useState } from 'react';

const Patients = () => {
  const { data: patients, isLoading } = useGet('/patients');
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    'ID',
    'Name',
    'Email',
    'Phone',
    'Age',
    'Actions'
  ];

  const filteredPatients =
    patients?.data?.filter((patient) =>
      (patient.name || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (patient.email || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    ) || [];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Patients</h1>
              <p className="text-gray-600 mt-2">
                Manage and view patient records
              </p>
            </div>
            <Button className="bg-blue-600 text-white flex items-center px-6 py-2 rounded-lg">
              <Plus className="w-4 h-4 mr-2" />
              Add Patient
            </Button>
          </div>

          {/* Search */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>
            <button className="px-4 py-2 border rounded-lg flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filter
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-md border overflow-hidden">
            {isLoading ? (
              <div className="p-10 text-center">
                <Loader2 className="animate-spin mx-auto mb-2" />
                Loading...
              </div>
            ) : filteredPatients.length === 0 ? (
              <div className="p-10 text-center text-gray-500">
                No patients found
              </div>
            ) : (
              <Table>
                <Table.Header>
                  <Table.Row>
                    {columns.map((col) => (
                      <Table.Head key={col}>{col}</Table.Head>
                    ))}
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {filteredPatients.map((patient) => (
                    <Table.Row key={patient._id}>
                      <Table.Cell className="text-blue-600">
                        {patient.patientId || patient._id.slice(-6)}
                      </Table.Cell>

                      <Table.Cell>{patient.name}</Table.Cell>

                      <Table.Cell>{patient.email}</Table.Cell>

                      <Table.Cell>{patient.phone}</Table.Cell>

                      <Table.Cell>
                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
                          {patient.age}
                        </span>
                      </Table.Cell>

                      <Table.Cell>
                        <div className="flex gap-2">
                          <button className="text-blue-600">View</button>
                          <button className="text-green-600">Edit</button>
                          <button className="text-red-600">Delete</button>
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

export default Patients;