import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CalendarCheck, CalendarClock, Clock3, Plus } from 'lucide-react';
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

const textAreaClass =
  'mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100';

const appointmentFormDefaults = {
  patient: '',
  doctor: '',
  date: new Date().toISOString().slice(0, 10),
  time: '09:00',
  status: 'pending',
  reason: '',
};

const getAppointmentPatientName = (appointment) =>
  appointment.patient?.user?.name ||
  appointment.patient?.name ||
  appointment.patientName ||
  'Unknown patient';

const getAppointmentDoctorName = (appointment) =>
  appointment.doctor?.user?.name ||
  appointment.doctor?.name ||
  appointment.doctorName ||
  'Doctor not assigned';

const getPatientRecordName = (patient) => patient.user?.name || patient.name || 'Unknown patient';
const getDoctorRecordName = (doctor) =>
  doctor.user?.name || doctor.name || `Dr. ${doctor.specialization || 'Specialist'}`;

const formatDate = (date) =>
  date
    ? new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(new Date(date))
    : 'Not set';

const getInputDate = (date) => (date ? new Date(date).toISOString().slice(0, 10) : '');

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

const getAppointmentForm = (appointment) => ({
  patient: appointment.patient?._id || appointment.patient || '',
  doctor: appointment.doctor?._id || appointment.doctor || '',
  date: getInputDate(appointment.date),
  time: appointment.time || '09:00',
  status: appointment.status || 'pending',
  reason: appointment.reason || '',
});

const Appointments = () => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data, isLoading } = useGet('/appointments');
  const { data: patients } = useGet('/patients');
  const { data: doctors } = useGet('/doctors');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalMode, setModalMode] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [form, setForm] = useState(appointmentFormDefaults);
  const [formError, setFormError] = useState('');
  const activeModalMode = searchParams.get('new') === '1' ? 'create' : modalMode;

  const appointmentRows = useMemo(() => data?.data || [], [data?.data]);
  const patientRows = useMemo(() => patients?.data || [], [patients?.data]);
  const doctorRows = useMemo(() => doctors?.data || [], [doctors?.data]);

  const filteredAppointments = useMemo(
    () =>
      appointmentRows.filter((appointment) => {
        const query = searchTerm.toLowerCase();
        return (
          getAppointmentPatientName(appointment).toLowerCase().includes(query) ||
          getAppointmentDoctorName(appointment).toLowerCase().includes(query) ||
          (appointment.status || '').toLowerCase().includes(query)
        );
      }),
    [appointmentRows, searchTerm]
  );

  const confirmed = appointmentRows.filter(
    (appointment) => appointment.status === 'confirmed'
  ).length;
  const pending = appointmentRows.filter(
    (appointment) => appointment.status === 'pending'
  ).length;

  const refreshAppointments = () => {
    queryClient.invalidateQueries({ queryKey: ['get', '/appointments'] });
    queryClient.invalidateQueries({ queryKey: ['get', '/payments'] });
    queryClient.invalidateQueries({ queryKey: ['get', '/stats'] });
  };

  const saveAppointment = useMutation({
    mutationFn: (payload) =>
      activeModalMode === 'edit'
        ? api.put(`/appointments/${selectedAppointment._id}`, payload)
        : api.post('/appointments', payload),
    onSuccess: () => {
      refreshAppointments();
      closeModal();
    },
    onError: (error) => {
      setFormError(getErrorMessage(error, 'Appointment could not be saved'));
    },
  });

  const cancelAppointment = useMutation({
    mutationFn: (appointmentId) => api.put(`/appointments/${appointmentId}`, { status: 'cancelled' }),
    onSuccess: () => {
      refreshAppointments();
      closeModal();
    },
    onError: (error) => {
      setFormError(getErrorMessage(error, 'Appointment could not be cancelled'));
    },
  });

  const closeModal = () => {
    if (searchParams.get('new') === '1') {
      setSearchParams({}, { replace: true });
    }
    setModalMode(null);
    setSelectedAppointment(null);
    setForm(appointmentFormDefaults);
    setFormError('');
  };

  const openCreate = () => {
    setSelectedAppointment(null);
    setForm(appointmentFormDefaults);
    setFormError('');
    setModalMode('create');
  };

  const openEdit = (appointment) => {
    setSelectedAppointment(appointment);
    setForm(getAppointmentForm(appointment));
    setFormError('');
    setModalMode('edit');
  };

  const openView = (appointment) => {
    setSelectedAppointment(appointment);
    setFormError('');
    setModalMode('view');
  };

  const openCancel = (appointment) => {
    setSelectedAppointment(appointment);
    setFormError('');
    setModalMode('cancel');
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormError('');
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const getAppointmentPayload = () => {
    const selectedDoctor = doctorRows.find((doctor) => doctor._id === form.doctor);
    const payload = {
      patient: form.patient,
      doctor: form.doctor,
      date: form.date,
      time: form.time,
      status: form.status,
      reason: form.reason.trim(),
    };

    const clinicId = selectedDoctor?.clinic?._id || selectedDoctor?.clinic;
    if (clinicId) payload.clinic = clinicId;

    return payload;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    saveAppointment.mutate(getAppointmentPayload());
  };

  return (
    <AdminLayout
      title="Appointments"
      description="Track daily patient visits, doctor assignments, and appointment status in one clean queue."
      actions={<AdminActionButton onClick={openCreate}>New Appointment</AdminActionButton>}
    >
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MetricCard
          title="Total Appointments"
          value={appointmentRows.length.toLocaleString('en-IN')}
          detail="All scheduled visits"
          icon={CalendarClock}
          tone="blue"
        />
        <MetricCard
          title="Confirmed"
          value={confirmed.toLocaleString('en-IN')}
          detail="Ready for visit"
          icon={CalendarCheck}
          tone="green"
        />
        <MetricCard
          title="Pending"
          value={pending.toLocaleString('en-IN')}
          detail="Needs follow-up"
          icon={Clock3}
          tone="amber"
        />
      </section>

      <section className="mt-6">
        <SearchToolbar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by patient, doctor, or status"
          count={filteredAppointments.length}
          right={
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Quick Add
            </button>
          }
        />

        <TableShell>
          {isLoading ? (
            <LoadingState label="Loading appointments..." />
          ) : filteredAppointments.length === 0 ? (
            <EmptyState
              title="No appointments found"
              description="Try another search term or create a new appointment."
            />
          ) : (
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.Head>Appointment</Table.Head>
                  <Table.Head>Patient</Table.Head>
                  <Table.Head>Doctor</Table.Head>
                  <Table.Head>Date & Time</Table.Head>
                  <Table.Head>Status</Table.Head>
                  <Table.Head>Actions</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {filteredAppointments.map((appointment) => (
                  <Table.Row key={appointment._id}>
                    <Table.Cell className="font-extrabold text-[#111827]">
                      #{appointment._id.slice(-6).toUpperCase()}
                    </Table.Cell>
                    <Table.Cell>{getAppointmentPatientName(appointment)}</Table.Cell>
                    <Table.Cell>
                      <div>
                        <p className="font-medium text-slate-800">
                          {getAppointmentDoctorName(appointment)}
                        </p>
                        <p className="text-xs text-slate-500">
                          {appointment.doctor?.specialization || 'Specialist'}
                        </p>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <p className="font-medium text-slate-800">
                        {formatDate(appointment.date)}
                      </p>
                      <p className="text-xs text-slate-500">
                        {appointment.time || 'Time not set'}
                      </p>
                    </Table.Cell>
                    <Table.Cell>
                      <StatusBadge status={appointment.status} />
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => openView(appointment)}
                          className="text-sm font-bold text-blue-600 hover:text-blue-800"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => openEdit(appointment)}
                          className="text-sm font-bold text-slate-600 hover:text-slate-900"
                        >
                          Reschedule
                        </button>
                        <button
                          type="button"
                          onClick={() => openCancel(appointment)}
                          className="text-sm font-bold text-red-600 hover:text-red-800"
                        >
                          Cancel
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

      <Modal
        isOpen={activeModalMode === 'create' || activeModalMode === 'edit'}
        onClose={closeModal}
        title={activeModalMode === 'edit' ? 'Reschedule Appointment' : 'New Appointment'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {formError ? (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {formError}
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="text-sm font-bold text-slate-700">
              Patient
              <select
                name="patient"
                value={form.patient}
                onChange={handleFormChange}
                className={fieldClass}
                required
              >
                <option value="">Select patient</option>
                {patientRows.map((patient) => (
                  <option key={patient._id} value={patient._id}>
                    {getPatientRecordName(patient)}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-bold text-slate-700">
              Doctor
              <select
                name="doctor"
                value={form.doctor}
                onChange={handleFormChange}
                className={fieldClass}
                required
              >
                <option value="">Select doctor</option>
                {doctorRows.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    {getDoctorRecordName(doctor)} - {doctor.specialization}
                  </option>
                ))}
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
            <label className="text-sm font-bold text-slate-700">
              Time
              <input
                name="time"
                value={form.time}
                onChange={handleFormChange}
                className={fieldClass}
                placeholder="10:00"
                required
              />
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
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </label>
            <label className="text-sm font-bold text-slate-700 md:col-span-2">
              Reason
              <textarea
                name="reason"
                value={form.reason}
                onChange={handleFormChange}
                className={textAreaClass}
                rows="3"
                placeholder="Visit reason"
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
              disabled={saveAppointment.isPending}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-extrabold text-white disabled:bg-slate-400"
            >
              {saveAppointment.isPending ? 'Saving...' : 'Save Appointment'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={activeModalMode === 'view'}
        onClose={closeModal}
        title="Appointment Details"
        size="lg"
      >
        {selectedAppointment ? (
          <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
            {[
              ['Patient', getAppointmentPatientName(selectedAppointment)],
              ['Doctor', getAppointmentDoctorName(selectedAppointment)],
              ['Speciality', selectedAppointment.doctor?.specialization || 'Specialist'],
              ['Date', formatDate(selectedAppointment.date)],
              ['Time', selectedAppointment.time || 'Not set'],
              ['Status', selectedAppointment.status || 'pending'],
              ['Clinic', selectedAppointment.clinic?.name || 'Not assigned'],
              ['Reason', selectedAppointment.reason || 'Not added'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-slate-50 p-4">
                <p className="text-xs font-extrabold uppercase text-slate-400">{label}</p>
                <p className="mt-1 font-bold text-slate-800">{value}</p>
              </div>
            ))}
          </div>
        ) : null}
      </Modal>

      <Modal isOpen={activeModalMode === 'cancel'} onClose={closeModal} title="Cancel Appointment">
        {formError ? (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {formError}
          </div>
        ) : null}
        <p className="text-sm font-semibold leading-6 text-slate-600">
          Mark appointment{' '}
          {selectedAppointment ? `#${selectedAppointment._id.slice(-6).toUpperCase()}` : ''}{' '}
          as cancelled?
        </p>
        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={closeModal}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700"
          >
            Keep
          </button>
          <button
            type="button"
            onClick={() => cancelAppointment.mutate(selectedAppointment._id)}
            disabled={cancelAppointment.isPending}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-extrabold text-white disabled:bg-slate-400"
          >
            {cancelAppointment.isPending ? 'Cancelling...' : 'Cancel Appointment'}
          </button>
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default Appointments;
