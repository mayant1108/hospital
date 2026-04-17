import { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BadgeIndianRupee, BriefcaseMedical, CalendarDays, Stethoscope } from 'lucide-react';
import AdminLayout, { AdminActionButton } from '../components/AdminLayout';
import {
  EmptyState,
  LoadingState,
  MetricCard,
  SearchToolbar,
  TableShell,
} from '../components/AdminUI';
import Modal from '../components/Modal';
import Table from '../components/Table';
import { api, useGet } from '../hooks/useApi';

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const fieldClass =
  'mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100';

const doctorFormDefaults = {
  name: '',
  email: '',
  phone: '',
  password: 'password123',
  specialization: '',
  experience: '',
  fees: '',
  availableTime: '09:00-17:00',
  availableDays: [],
  clinic: '',
};

const getDoctorName = (doctor) =>
  doctor.user?.name || doctor.name || `Dr. ${doctor.specialization || 'Specialist'}`;
const getDoctorEmail = (doctor) => doctor.user?.email || doctor.email || 'Not added';
const getDoctorPhone = (doctor) => doctor.user?.phone || doctor.phone || 'Not added';
const getClinicName = (doctor) =>
  doctor.clinic?.name || doctor.hospitalName || 'Aarogya Care Hospital';

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

const getDoctorForm = (doctor) => ({
  name: getDoctorName(doctor).startsWith('Dr. Specialist') ? '' : getDoctorName(doctor),
  email: getDoctorEmail(doctor) === 'Not added' ? '' : getDoctorEmail(doctor),
  phone: getDoctorPhone(doctor) === 'Not added' ? '' : getDoctorPhone(doctor),
  password: '',
  specialization: doctor.specialization || '',
  experience: doctor.experience || '',
  fees: doctor.fees || '',
  availableTime: doctor.availableTime || '09:00-17:00',
  availableDays: doctor.availableDays || [],
  clinic: doctor.clinic?._id || doctor.clinic || '',
});

const getDoctorPayload = (form, includePassword) => {
  const payload = {
    name: form.name.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    role: 'doctor',
    specialization: form.specialization.trim(),
    experience: Number(form.experience),
    fees: Number(form.fees),
    availableTime: form.availableTime.trim(),
    availableDays: form.availableDays,
  };

  if (form.clinic) payload.clinic = form.clinic;
  if (includePassword && form.password) payload.password = form.password;

  return payload;
};

const Doctors = () => {
  const queryClient = useQueryClient();
  const { data: doctors, isLoading } = useGet('/doctors');
  const { data: clinics } = useGet('/clinics');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalMode, setModalMode] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [form, setForm] = useState(doctorFormDefaults);
  const [formError, setFormError] = useState('');

  const doctorRows = useMemo(() => doctors?.data || [], [doctors?.data]);
  const clinicRows = useMemo(() => clinics?.data || [], [clinics?.data]);
  const filteredDoctors = useMemo(
    () =>
      doctorRows.filter((doctor) => {
        const query = searchTerm.toLowerCase();
        return (
          getDoctorName(doctor).toLowerCase().includes(query) ||
          (doctor.specialization || '').toLowerCase().includes(query) ||
          getClinicName(doctor).toLowerCase().includes(query)
        );
      }),
    [doctorRows, searchTerm]
  );

  const specialities = new Set(
    doctorRows.map((doctor) => doctor.specialization).filter(Boolean)
  ).size;

  const refreshDoctors = () => {
    queryClient.invalidateQueries({ queryKey: ['get', '/doctors'] });
    queryClient.invalidateQueries({ queryKey: ['get', '/appointments'] });
    queryClient.invalidateQueries({ queryKey: ['get', '/site'] });
    queryClient.invalidateQueries({ queryKey: ['get', '/stats'] });
  };

  const saveDoctor = useMutation({
    mutationFn: (payload) =>
      modalMode === 'edit'
        ? api.put(`/doctors/${selectedDoctor._id}`, payload)
        : api.post('/doctors', payload),
    onSuccess: () => {
      refreshDoctors();
      closeModal();
    },
    onError: (error) => {
      setFormError(getErrorMessage(error, 'Doctor could not be saved'));
    },
  });

  const deleteDoctor = useMutation({
    mutationFn: (doctorId) => api.delete(`/doctors/${doctorId}`),
    onSuccess: () => {
      refreshDoctors();
      closeModal();
    },
    onError: (error) => {
      setFormError(getErrorMessage(error, 'Doctor could not be deleted'));
    },
  });

  const closeModal = () => {
    setModalMode(null);
    setSelectedDoctor(null);
    setForm(doctorFormDefaults);
    setFormError('');
  };

  const openCreate = () => {
    setSelectedDoctor(null);
    setForm(doctorFormDefaults);
    setFormError('');
    setModalMode('create');
  };

  const openEdit = (doctor) => {
    setSelectedDoctor(doctor);
    setForm(getDoctorForm(doctor));
    setFormError('');
    setModalMode('edit');
  };

  const openView = (doctor) => {
    setSelectedDoctor(doctor);
    setFormError('');
    setModalMode('view');
  };

  const openDelete = (doctor) => {
    setSelectedDoctor(doctor);
    setFormError('');
    setModalMode('delete');
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormError('');
    setForm((current) => ({
      ...current,
      [name]: name === 'phone' ? value.replace(/\D/g, '').slice(0, 10) : value,
    }));
  };

  const toggleDay = (day) => {
    setFormError('');
    setForm((current) => ({
      ...current,
      availableDays: current.availableDays.includes(day)
        ? current.availableDays.filter((value) => value !== day)
        : [...current.availableDays, day],
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    saveDoctor.mutate(getDoctorPayload(form, modalMode === 'create'));
  };

  return (
    <AdminLayout
      title="Doctors"
      description="Manage specialists, consultation fees, clinic assignment, and weekly availability."
      actions={<AdminActionButton onClick={openCreate}>Add Doctor</AdminActionButton>}
    >
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MetricCard
          title="Total Doctors"
          value={doctorRows.length.toLocaleString('en-IN')}
          detail="Active specialists"
          icon={Stethoscope}
          tone="blue"
        />
        <MetricCard
          title="Specialities"
          value={specialities.toLocaleString('en-IN')}
          detail="Departments covered"
          icon={BriefcaseMedical}
          tone="green"
        />
        <MetricCard
          title="Avg Fee"
          value={`INR ${Math.round(
            doctorRows.reduce((sum, doctor) => sum + (doctor.fees || 0), 0) /
              (doctorRows.length || 1)
          ).toLocaleString('en-IN')}`}
          detail="Across listed doctors"
          icon={BadgeIndianRupee}
          tone="amber"
        />
      </section>

      <section className="mt-6">
        <SearchToolbar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search doctors by name, speciality, or clinic"
          count={filteredDoctors.length}
          right={
            <button
              type="button"
              onClick={() => setModalMode('schedule')}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
            >
              Schedule
            </button>
          }
        />

        <TableShell>
          {isLoading ? (
            <LoadingState label="Loading doctors..." />
          ) : filteredDoctors.length === 0 ? (
            <EmptyState
              title="No doctors found"
              description="Try a different search or add a specialist profile."
            />
          ) : (
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.Head>Doctor</Table.Head>
                  <Table.Head>Speciality</Table.Head>
                  <Table.Head>Clinic</Table.Head>
                  <Table.Head>Availability</Table.Head>
                  <Table.Head>Fee</Table.Head>
                  <Table.Head>Actions</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {filteredDoctors.map((doctor) => (
                  <Table.Row key={doctor._id}>
                    <Table.Cell>
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-blue-600">
                          {getDoctorName(doctor).slice(0, 2).toUpperCase()}
                        </span>
                        <div>
                          <p className="font-extrabold text-[#111827]">
                            {getDoctorName(doctor)}
                          </p>
                          <p className="text-xs text-slate-500">
                            {getDoctorPhone(doctor)}
                          </p>
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                        {doctor.specialization}
                      </span>
                    </Table.Cell>
                    <Table.Cell>{getClinicName(doctor)}</Table.Cell>
                    <Table.Cell>
                      <div className="flex items-start gap-2">
                        <CalendarDays className="mt-0.5 h-4 w-4 text-slate-400" />
                        <div>
                          <p className="font-medium text-slate-800">
                            {doctor.availableTime}
                          </p>
                          <p className="text-xs text-slate-500">
                            {(doctor.availableDays || []).join(', ') || 'Not set'}
                          </p>
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell className="font-extrabold text-[#111827]">
                      INR {(doctor.fees || 0).toLocaleString('en-IN')}
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => openView(doctor)}
                          className="text-sm font-bold text-blue-600 hover:text-blue-800"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => openEdit(doctor)}
                          className="text-sm font-bold text-slate-600 hover:text-slate-900"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => openDelete(doctor)}
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

      <Modal
        isOpen={modalMode === 'create' || modalMode === 'edit'}
        onClose={closeModal}
        title={modalMode === 'edit' ? 'Edit Doctor' : 'Add Doctor'}
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
              Full Name
              <input
                name="name"
                value={form.name}
                onChange={handleFormChange}
                className={fieldClass}
                required
              />
            </label>
            <label className="text-sm font-bold text-slate-700">
              Email
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleFormChange}
                className={fieldClass}
                required
              />
            </label>
            <label className="text-sm font-bold text-slate-700">
              Phone
              <input
                name="phone"
                value={form.phone}
                onChange={handleFormChange}
                className={fieldClass}
                minLength={10}
                maxLength={10}
                required
              />
            </label>
            {modalMode === 'create' ? (
              <label className="text-sm font-bold text-slate-700">
                Login Password
                <input
                  type="text"
                  name="password"
                  value={form.password}
                  onChange={handleFormChange}
                  className={fieldClass}
                  minLength={6}
                  required
                />
              </label>
            ) : null}
            <label className="text-sm font-bold text-slate-700">
              Speciality
              <input
                name="specialization"
                value={form.specialization}
                onChange={handleFormChange}
                className={fieldClass}
                required
              />
            </label>
            <label className="text-sm font-bold text-slate-700">
              Experience
              <input
                type="number"
                name="experience"
                value={form.experience}
                onChange={handleFormChange}
                className={fieldClass}
                min="0"
                required
              />
            </label>
            <label className="text-sm font-bold text-slate-700">
              Fee
              <input
                type="number"
                name="fees"
                value={form.fees}
                onChange={handleFormChange}
                className={fieldClass}
                min="0"
                required
              />
            </label>
            <label className="text-sm font-bold text-slate-700">
              Available Time
              <input
                name="availableTime"
                value={form.availableTime}
                onChange={handleFormChange}
                className={fieldClass}
                placeholder="09:00-17:00"
                required
              />
            </label>
            <label className="text-sm font-bold text-slate-700 md:col-span-2">
              Clinic
              <select
                name="clinic"
                value={form.clinic}
                onChange={handleFormChange}
                className={fieldClass}
              >
                <option value="">No clinic assigned</option>
                {clinicRows.map((clinic) => (
                  <option key={clinic._id} value={clinic._id}>
                    {clinic.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="md:col-span-2">
              <p className="text-sm font-bold text-slate-700">Available Days</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {weekDays.map((day) => (
                  <label
                    key={day}
                    className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm font-bold ${
                      form.availableDays.includes(day)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={form.availableDays.includes(day)}
                      onChange={() => toggleDay(day)}
                      className="sr-only"
                    />
                    {day}
                  </label>
                ))}
              </div>
            </div>
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
              disabled={saveDoctor.isPending}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-extrabold text-white disabled:bg-slate-400"
            >
              {saveDoctor.isPending ? 'Saving...' : 'Save Doctor'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={modalMode === 'view'} onClose={closeModal} title="Doctor Details" size="lg">
        {selectedDoctor ? (
          <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
            {[
              ['Name', getDoctorName(selectedDoctor)],
              ['Email', getDoctorEmail(selectedDoctor)],
              ['Phone', getDoctorPhone(selectedDoctor)],
              ['Speciality', selectedDoctor.specialization || 'Not set'],
              ['Experience', `${selectedDoctor.experience || 0} years`],
              ['Fee', `INR ${(selectedDoctor.fees || 0).toLocaleString('en-IN')}`],
              ['Clinic', getClinicName(selectedDoctor)],
              ['Availability', selectedDoctor.availableTime || 'Not set'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-slate-50 p-4">
                <p className="text-xs font-extrabold uppercase text-slate-400">{label}</p>
                <p className="mt-1 font-bold text-slate-800">{value}</p>
              </div>
            ))}
          </div>
        ) : null}
      </Modal>

      <Modal isOpen={modalMode === 'schedule'} onClose={closeModal} title="Doctor Schedule" size="lg">
        <div className="space-y-3">
          {filteredDoctors.length ? (
            filteredDoctors.map((doctor) => (
              <div key={doctor._id} className="rounded-lg bg-slate-50 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-extrabold text-slate-900">{getDoctorName(doctor)}</p>
                    <p className="text-sm font-semibold text-slate-500">{doctor.specialization}</p>
                  </div>
                  <span className="rounded-lg bg-white px-3 py-2 text-sm font-bold text-slate-700 ring-1 ring-slate-200">
                    {doctor.availableTime || 'Not set'}
                  </span>
                </div>
                <p className="mt-3 text-sm font-semibold text-slate-600">
                  {(doctor.availableDays || []).join(', ') || 'No days selected'}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm font-semibold text-slate-500">No doctors available.</p>
          )}
        </div>
      </Modal>

      <Modal isOpen={modalMode === 'delete'} onClose={closeModal} title="Delete Doctor">
        {formError ? (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {formError}
          </div>
        ) : null}
        <p className="text-sm font-semibold leading-6 text-slate-600">
          Delete {selectedDoctor ? getDoctorName(selectedDoctor) : 'this doctor'} from doctor
          records?
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
            onClick={() => deleteDoctor.mutate(selectedDoctor._id)}
            disabled={deleteDoctor.isPending}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-extrabold text-white disabled:bg-slate-400"
          >
            {deleteDoctor.isPending ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default Doctors;
