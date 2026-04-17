import { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BadgeIndianRupee, CreditCard, FileText, WalletCards } from 'lucide-react';
import AdminLayout, { AdminActionButton } from '../components/AdminLayout';
import {
  EmptyState,
  LoadingState,
  MetricCard,
  SearchToolbar,
  StatusBadge,
  TableShell,
} from '../components/AdminUI';
import Modal from '../components/Modal';
import Table from '../components/Table';
import { api, useGet } from '../hooks/useApi';

const fieldClass =
  'mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100';

const paymentFormDefaults = {
  appointment: '',
  amount: '',
  paymentMethod: 'Cash',
  status: 'paid',
  date: new Date().toISOString().slice(0, 10),
};

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value || 0);

const formatDate = (date) =>
  date
    ? new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(new Date(date))
    : 'Not set';

const getAppointmentPatientName = (appointment) =>
  appointment?.patient?.user?.name || appointment?.patient?.name || 'Unknown patient';

const getAppointmentDoctorName = (appointment) =>
  appointment?.doctor?.user?.name ||
  appointment?.doctor?.name ||
  `Dr. ${appointment?.doctor?.specialization || 'Specialist'}`;

const getPatientName = (payment) =>
  payment.patient?.name ||
  payment.appointment?.patient?.user?.name ||
  payment.patientName ||
  (typeof payment.patient === 'string' ? payment.patient : 'Unknown patient');

const getPatientEmail = (payment) =>
  payment.patient?.email || payment.appointment?.patient?.user?.email || 'Email not added';

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

const getAppointmentPatientId = (appointment) =>
  appointment?.patient?.user?._id ||
  appointment?.patient?.user ||
  appointment?.patient?._id ||
  appointment?.patient ||
  '';

const getAppointmentLabel = (appointment) =>
  `#${appointment._id.slice(-6).toUpperCase()} - ${getAppointmentPatientName(
    appointment
  )} with ${getAppointmentDoctorName(appointment)} (${formatDate(appointment.date)})`;

const Payments = () => {
  const queryClient = useQueryClient();
  const { data: payments, isLoading } = useGet('/payments');
  const { data: appointments } = useGet('/appointments');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalMode, setModalMode] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [form, setForm] = useState(paymentFormDefaults);
  const [formError, setFormError] = useState('');

  const paymentRows = useMemo(() => payments?.data || [], [payments?.data]);
  const appointmentRows = useMemo(() => appointments?.data || [], [appointments?.data]);
  const filteredPayments = useMemo(
    () =>
      paymentRows.filter((payment) => {
        const query = searchTerm.toLowerCase();
        return (
          getPatientName(payment).toLowerCase().includes(query) ||
          (payment.status || '').toLowerCase().includes(query) ||
          (payment.paymentMethod || '').toLowerCase().includes(query)
        );
      }),
    [paymentRows, searchTerm]
  );

  const totalAmount = filteredPayments.reduce(
    (sum, payment) => sum + (payment.amount || 0),
    0
  );
  const paidCount = filteredPayments.filter((payment) => payment.status === 'paid').length;
  const pendingCount = filteredPayments.length - paidCount;

  const refreshPayments = () => {
    queryClient.invalidateQueries({ queryKey: ['get', '/payments'] });
    queryClient.invalidateQueries({ queryKey: ['get', '/stats'] });
  };

  const savePayment = useMutation({
    mutationFn: (payload) => api.post('/payments', payload),
    onSuccess: () => {
      refreshPayments();
      closeModal();
    },
    onError: (error) => {
      setFormError(getErrorMessage(error, 'Payment could not be recorded'));
    },
  });

  const refundPayment = useMutation({
    mutationFn: (paymentId) => api.put(`/payments/${paymentId}`, { status: 'refunded' }),
    onSuccess: () => {
      refreshPayments();
      closeModal();
    },
    onError: (error) => {
      setFormError(getErrorMessage(error, 'Payment could not be refunded'));
    },
  });

  const deletePayment = useMutation({
    mutationFn: (paymentId) => api.delete(`/payments/${paymentId}`),
    onSuccess: () => {
      refreshPayments();
      closeModal();
    },
    onError: (error) => {
      setFormError(getErrorMessage(error, 'Payment could not be deleted'));
    },
  });

  const closeModal = () => {
    setModalMode(null);
    setSelectedPayment(null);
    setForm(paymentFormDefaults);
    setFormError('');
  };

  const openCreate = () => {
    setSelectedPayment(null);
    setForm(paymentFormDefaults);
    setFormError('');
    setModalMode('create');
  };

  const openView = (payment) => {
    setSelectedPayment(payment);
    setFormError('');
    setModalMode('view');
  };

  const openInvoice = (payment) => {
    setSelectedPayment(payment);
    setFormError('');
    setModalMode('invoice');
  };

  const openRefund = (payment) => {
    setSelectedPayment(payment);
    setFormError('');
    setModalMode('refund');
  };

  const openDelete = (payment) => {
    setSelectedPayment(payment);
    setFormError('');
    setModalMode('delete');
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormError('');

    if (name === 'appointment') {
      const appointment = appointmentRows.find((item) => item._id === value);
      setForm((current) => ({
        ...current,
        appointment: value,
        amount: appointment?.doctor?.fees || current.amount,
      }));
      return;
    }

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const selectedAppointment = appointmentRows.find((item) => item._id === form.appointment);

    savePayment.mutate({
      appointment: form.appointment,
      patient: getAppointmentPatientId(selectedAppointment),
      amount: Number(form.amount),
      paymentMethod: form.paymentMethod,
      status: form.status,
      date: form.date,
    });
  };

  return (
    <AdminLayout
      title="Payments"
      description="Review billing activity, payment status, patient invoices, and revenue collection."
      actions={<AdminActionButton onClick={openCreate}>Record Payment</AdminActionButton>}
    >
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MetricCard
          title="Visible Revenue"
          value={formatCurrency(totalAmount)}
          detail="Based on current filters"
          icon={BadgeIndianRupee}
          tone="blue"
        />
        <MetricCard
          title="Paid"
          value={paidCount.toLocaleString('en-IN')}
          detail="Completed payments"
          icon={CreditCard}
          tone="green"
        />
        <MetricCard
          title="Pending"
          value={pendingCount.toLocaleString('en-IN')}
          detail="Needs billing follow-up"
          icon={WalletCards}
          tone="amber"
        />
      </section>

      <section className="mt-6">
        <SearchToolbar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search payments by patient, status, or method"
          count={filteredPayments.length}
          right={
            <button
              type="button"
              onClick={() => setModalMode('reports')}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
            >
              <FileText className="h-4 w-4" aria-hidden="true" />
              Reports
            </button>
          }
        />

        <TableShell>
          {isLoading ? (
            <LoadingState label="Loading payments..." />
          ) : filteredPayments.length === 0 ? (
            <EmptyState
              title="No payments found"
              description="Try a different search term or record a new payment."
            />
          ) : (
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.Head>Payment</Table.Head>
                  <Table.Head>Patient</Table.Head>
                  <Table.Head>Amount</Table.Head>
                  <Table.Head>Method</Table.Head>
                  <Table.Head>Status</Table.Head>
                  <Table.Head>Date</Table.Head>
                  <Table.Head>Actions</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {filteredPayments.map((payment) => (
                  <Table.Row key={payment._id}>
                    <Table.Cell className="font-extrabold text-[#111827]">
                      #{payment._id.slice(-6).toUpperCase()}
                    </Table.Cell>
                    <Table.Cell>
                      <p className="font-medium text-slate-800">
                        {getPatientName(payment)}
                      </p>
                      <p className="text-xs text-slate-500">{getPatientEmail(payment)}</p>
                    </Table.Cell>
                    <Table.Cell className="font-extrabold text-[#111827]">
                      {formatCurrency(payment.amount)}
                    </Table.Cell>
                    <Table.Cell>{payment.paymentMethod || 'Not set'}</Table.Cell>
                    <Table.Cell>
                      <StatusBadge status={payment.status} />
                    </Table.Cell>
                    <Table.Cell>{formatDate(payment.date)}</Table.Cell>
                    <Table.Cell>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => openView(payment)}
                          className="text-sm font-bold text-blue-600 hover:text-blue-800"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => openInvoice(payment)}
                          className="text-sm font-bold text-slate-600 hover:text-slate-900"
                        >
                          Invoice
                        </button>
                        <button
                          type="button"
                          onClick={() => openRefund(payment)}
                          className="text-sm font-bold text-amber-700 hover:text-amber-900"
                        >
                          Refund
                        </button>
                        <button
                          type="button"
                          onClick={() => openDelete(payment)}
                          className="text-sm font-bold text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}
        </TableShell>
      </section>

      <Modal isOpen={modalMode === 'create'} onClose={closeModal} title="Record Payment" size="lg">
        <form onSubmit={handleSubmit} className="space-y-5">
          {formError ? (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {formError}
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="text-sm font-bold text-slate-700 md:col-span-2">
              Appointment
              <select
                name="appointment"
                value={form.appointment}
                onChange={handleFormChange}
                className={fieldClass}
                required
              >
                <option value="">Select appointment</option>
                {appointmentRows.map((appointment) => (
                  <option key={appointment._id} value={appointment._id}>
                    {getAppointmentLabel(appointment)}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-bold text-slate-700">
              Amount
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleFormChange}
                className={fieldClass}
                min="0"
                required
              />
            </label>
            <label className="text-sm font-bold text-slate-700">
              Method
              <select
                name="paymentMethod"
                value={form.paymentMethod}
                onChange={handleFormChange}
                className={fieldClass}
              >
                <option>UPI</option>
                <option>Card</option>
                <option>Cash</option>
                <option>Wallet</option>
              </select>
            </label>
            <label className="text-sm font-bold text-slate-700">
              Status
              <select
                name="status"
                value={form.status}
                onChange={handleFormChange}
                className={fieldClass}
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </label>
            <label className="text-sm font-bold text-slate-700">
              Date
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleFormChange}
                className={fieldClass}
                required
              />
            </label>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={closeModal}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={savePayment.isPending}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-extrabold text-white disabled:bg-slate-400"
            >
              {savePayment.isPending ? 'Saving...' : 'Save Payment'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={modalMode === 'view'} onClose={closeModal} title="Payment Details" size="lg">
        {selectedPayment ? (
          <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
            {[
              ['Patient', getPatientName(selectedPayment)],
              ['Email', getPatientEmail(selectedPayment)],
              ['Appointment', selectedPayment.appointment?._id?.slice(-6).toUpperCase() || 'NA'],
              ['Amount', formatCurrency(selectedPayment.amount)],
              ['Method', selectedPayment.paymentMethod || 'Not set'],
              ['Status', selectedPayment.status || 'pending'],
              ['Date', formatDate(selectedPayment.date)],
              ['Doctor', getAppointmentDoctorName(selectedPayment.appointment)],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-slate-50 p-4">
                <p className="text-xs font-extrabold uppercase text-slate-400">{label}</p>
                <p className="mt-1 font-bold text-slate-800">{value}</p>
              </div>
            ))}
          </div>
        ) : null}
      </Modal>

      <Modal isOpen={modalMode === 'invoice'} onClose={closeModal} title="Invoice" size="lg">
        {selectedPayment ? (
          <div className="rounded-lg border border-slate-200 p-5">
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase text-slate-400">Invoice</p>
                <h3 className="mt-1 text-2xl font-extrabold text-slate-950">
                  #{selectedPayment._id.slice(-6).toUpperCase()}
                </h3>
              </div>
              <StatusBadge status={selectedPayment.status} />
            </div>
            <div className="mt-5 grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
              <div>
                <p className="font-extrabold text-slate-400">Bill To</p>
                <p className="mt-1 font-bold text-slate-900">{getPatientName(selectedPayment)}</p>
                <p className="text-slate-500">{getPatientEmail(selectedPayment)}</p>
              </div>
              <div>
                <p className="font-extrabold text-slate-400">Visit</p>
                <p className="mt-1 font-bold text-slate-900">
                  {formatDate(selectedPayment.appointment?.date)}
                </p>
                <p className="text-slate-500">
                  {getAppointmentDoctorName(selectedPayment.appointment)}
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between rounded-lg bg-slate-50 p-4">
              <span className="font-extrabold text-slate-700">Consultation / Services</span>
              <span className="text-xl font-extrabold text-slate-950">
                {formatCurrency(selectedPayment.amount)}
              </span>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal isOpen={modalMode === 'reports'} onClose={closeModal} title="Payment Report" size="lg">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            ['Filtered Records', filteredPayments.length.toLocaleString('en-IN')],
            ['Paid Amount', formatCurrency(totalAmount)],
            ['Pending Count', pendingCount.toLocaleString('en-IN')],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg bg-slate-50 p-5">
              <p className="text-xs font-extrabold uppercase text-slate-400">{label}</p>
              <p className="mt-2 text-2xl font-extrabold text-slate-950">{value}</p>
            </div>
          ))}
        </div>
      </Modal>

      <Modal isOpen={modalMode === 'refund'} onClose={closeModal} title="Refund Payment">
        {formError ? (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {formError}
          </div>
        ) : null}
        <p className="text-sm font-semibold leading-6 text-slate-600">
          Mark {selectedPayment ? formatCurrency(selectedPayment.amount) : 'this payment'} as
          refunded?
        </p>
        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={closeModal}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => refundPayment.mutate(selectedPayment._id)}
            disabled={refundPayment.isPending}
            className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-extrabold text-white disabled:bg-slate-400"
          >
            {refundPayment.isPending ? 'Refunding...' : 'Refund'}
          </button>
        </div>
      </Modal>

      <Modal isOpen={modalMode === 'delete'} onClose={closeModal} title="Delete Payment">
        {formError ? (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {formError}
          </div>
        ) : null}
        <p className="text-sm font-semibold leading-6 text-slate-600">
          Delete payment{' '}
          {selectedPayment ? `#${selectedPayment._id.slice(-6).toUpperCase()}` : ''} from
          billing records?
        </p>
        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={closeModal}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => deletePayment.mutate(selectedPayment._id)}
            disabled={deletePayment.isPending}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-extrabold text-white disabled:bg-slate-400"
          >
            {deletePayment.isPending ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default Payments;
