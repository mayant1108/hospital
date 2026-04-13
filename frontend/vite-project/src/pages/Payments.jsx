import { useGet } from '../hooks/useApi';
import Table from '../components/Table';
import Sidebar from '../components/Sidebar';
import { Loader2, Plus, DollarSign, Search, Filter } from 'lucide-react';
import { useState } from 'react';

const Payments = () => {
  const { data: payments, isLoading } = useGet('/payments');
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    'ID',
    'Patient',
    'Amount',
    'Status',
    'Date',
    'Actions'
  ];

  const filteredPayments =
    payments?.data?.filter((payment) =>
      (payment.patientName || payment.patient || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    ) || [];

  const getStatusColor = (status) => {
    return status === 'paid'
      ? 'bg-green-50 text-green-700'
      : 'bg-yellow-50 text-yellow-700';
  };

  const totalAmount = filteredPayments.reduce(
    (sum, payment) => sum + (payment.amount || 0),
    0
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Payments</h1>
              <p className="text-gray-600 mt-2">
                Manage and track payment records
              </p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center font-medium">
              <Plus className="w-4 h-4 mr-2" />
              Record Payment
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-md border">
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold mt-2">
                ${totalAmount.toLocaleString()}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md border">
              <p className="text-sm text-gray-600">Paid</p>
              <p className="text-3xl font-bold mt-2">
                {filteredPayments.filter(p => p.status === 'paid').length}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md border">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-3xl font-bold mt-2">
                {filteredPayments.filter(p => p.status !== 'paid').length}
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by patient name..."
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
            ) : filteredPayments.length === 0 ? (
              <div className="p-10 text-center">No payments found</div>
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
                  {filteredPayments.map((payment) => (
                    <Table.Row key={payment._id}>
                      <Table.Cell>
                        {payment.paymentId || payment._id.slice(-6)}
                      </Table.Cell>

                      <Table.Cell>
                        {payment.patientName || payment.patient}
                      </Table.Cell>

                      <Table.Cell>
                        ${(payment.amount || 0).toLocaleString()}
                      </Table.Cell>

                      <Table.Cell>
                        <span className={getStatusColor(payment.status)}>
                          {payment.status}
                        </span>
                      </Table.Cell>

                      <Table.Cell>
                        {new Date(payment.date).toLocaleDateString()}
                      </Table.Cell>

                      <Table.Cell>
                        View | Invoice | Refund
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

export default Payments;