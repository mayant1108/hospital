import { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CalendarDays, UserRound, Users } from 'lucide-react';
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

const fieldClass =
  'mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100';

const textAreaClass =
  'mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100';

const patientFormDefaults = {
  name: '',
  email: '',
  phone: '',
  password: 'password123',
  age: '',
  gender: 'Male',
  address: '',
  condition: '',
  notes: '',
};

const getPatientName = (patient) => patient.user?.name || patient.name || 'Unknown patient';
const getPatientEmail = (patient) => patient.user?.email || patient.email || 'Not added';
const getPatientPhone = (patient) => patient.user?.phone || patient.phone || 'Not added';

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

const getPatientForm = (patient) => ({
  name: getPatientName(patient) === 'Unknown patient' ? '' : getPatientName(patient),
  email: getPatientEmail(patient) === 'Not added' ? '' : getPatientEmail(patient),
  phone: getPatientPhone(patient) === 'Not added' ? '' : getPatientPhone(patient),
  password: '',
  age: patient.age || '',
  gender: patient.gender || 'Male',
  address: patient.address || '',
  condition: patient.medicalHistory?.[0]?.condition || '',
  notes: patient.medicalHistory?.[0]?.notes || '',
});

const getPatientPayload = (form, includePassword) => {
  const payload = {
    name: form.name.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    age: Number(form.age),
    gender: form.gender,
    address: form.address.trim(),
  };

  if (includePassword && form.password) {
    payload.password = form.password;
  }

  if (form.condition.trim()) {
    payload.medicalHistory = [
      {
        condition: form.condition.trim(),
        notes: form.notes.trim(),
      },
    ];
  }

  return payload;
};

const downloadCsv = (rows) => {
  const header = ['Name', 'Email', 'Phone', 'Age', 'Gender', 'Address'];
  const csvRows = rows.map((patient) =>
    [
      getPatientName(patient),
      getPatientEmail(patient),
      getPatientPhone(patient),
      patient.age || '',
      patient.gender || '',
      patient.address || '',
    ]
      .map((value) => `"${String(value).replaceAll('"', '""')}"`)
      .join(',')
  );

  const blob = new Blob([[header.join(','), ...csvRows].join('\n')], {
    type: 'text/csv;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'patients.csv';
  link.click();
  URL.revokeObjectURL(url);
};

const Patients = () => {
  const queryClient = useQueryClient();
  const { data: patients, isLoading } = useGet('/patients');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalMode, setModalMode] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [form, setForm] = useState(patientFormDefaults);
  const [formError, setFormError] = useState('');

  const patientRows = useMemo(() => patients?.data || [], [patients?.data]);
  const filteredPatients = useMemo(
    () =>
      patientRows.filter((patient) => {
        const query = searchTerm.toLowerCase();
        return (
          getPatientName(patient).toLowerCase().includes(query) ||
          getPatientEmail(patient).toLowerCase().includes(query) ||
          getPatientPhone(patient).includes(query)
        );
      }),
    [patientRows, searchTerm]
  );

  const todayCount = patientRows.filter((patient) => {
    const created = patient.createdAt ? new Date(patient.createdAt) : null;
    return created && created.toDateString() === new Date().toDateString();
  }).length;

  const refreshPatients = () => {
    queryClient.invalidateQueries({ queryKey: ['get', '/patients'] });
    queryClient.invalidateQueries({ queryKey: ['get', '/stats'] });
  };

  const savePatient = useMutation({
    mutationFn: (payload) =>
      modalMode === 'edit'
        ? api.put(`/patients/${selectedPatient._id}`, payload)
        : api.post('/patients', payload),
    onSuccess: () => {
      refreshPatients();
      closeModal();
    },
    onError: (error) => {
      setFormError(getErrorMessage(error, 'Patient could not be saved'));
    },
  });

  const deletePatient = useMutation({
    mutationFn: (patientId) => api.delete(`/patients/${patientId}`),
    onSuccess: () => {
      refreshPatients();
      closeModal();
    },
    onError: (error) => {
      setFormError(getErrorMessage(error, 'Patient could not be deleted'));
    },
  });

  const closeModal = () => {
    setModalMode(null);
    setSelectedPatient(null);
    setForm(patientFormDefaults);
    setFormError('');
  };

  const openCreate = () => {
    setSelectedPatient(null);
    setForm(patientFormDefaults);
    setFormError('');
    setModalMode('create');
  };

  const openEdit = (patient) => {
    setSelectedPatient(patient);
    setForm(getPatientForm(patient));
    setFormError('');
    setModalMode('edit');
  };

  const openView = (patient) => {
    setSelectedPatient(patient);
    setFormError('');
    setModalMode('view');
  };

  const openDelete = (patient) => {
    setSelectedPatient(patient);
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

  const handleSubmit = (event) => {
    event.preventDefault();
    savePatient.mutate(getPatientPayload(form, modalMode === 'create'));
  };

  return (
    <AdminLayout
      title="Patients"
      description="Search, review, and manage patient records with quick access to contact and demographic details."
      actions={<AdminActionButton onClick={openCreate}>Add Patient</AdminActionButton>}
    >
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MetricCard
          title="Total Patients"
          value={patientRows.length.toLocaleString('en-IN')}
          detail="Registered records"
          icon={Users}
          tone="blue"
        />
        <MetricCard
          title="New Today"
          value={todayCount.toLocaleString('en-IN')}
          detail="Fresh registrations"
          icon={CalendarDays}
          tone="green"
        />
        <MetricCard
          title="Active Profiles"
          value={filteredPatients.length.toLocaleString('en-IN')}
          detail="Visible after search"
          icon={UserRound}
          tone="amber"
        />
      </section>

      <section className="mt-6">
        <SearchToolbar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search patients by name, email, or phone"
          count={filteredPatients.length}
          right={
            <button
              type="button"
              onClick={() => downloadCsv(filteredPatients)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
            >
              Export
            </button>
          }
        />

        <TableShell>
          {isLoading ? (
            <LoadingState label="Loading patients..." />
          ) : filteredPatients.length === 0 ? (
            <EmptyState
              title="No patients found"
              description="Try another search term or add the first patient record."
            />
          ) : (
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.Head>Patient</Table.Head>
                  <Table.Head>Contact</Table.Head>
                  <Table.Head>Age</Table.Head>
                  <Table.Head>Gender</Table.Head>
                  <Table.Head>Address</Table.Head>
                  <Table.Head>Actions</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {filteredPatients.map((patient) => (
                  <Table.Row key={patient._id}>
                    <Table.Cell>
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-blue-600">
                          {getPatientName(patient).slice(0, 2).toUpperCase()}
                        </span>
                        <div>
                          <p className="font-extrabold text-[#111827]">
                            {getPatientName(patient)}
                          </p>
                          <p className="text-xs text-slate-500">
                            #{patient._id.slice(-6).toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <p className="font-medium text-slate-800">
                        {getPatientPhone(patient)}
                      </p>
                      <p className="text-xs text-slate-500">
                        {getPatientEmail(patient)}
                      </p>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
                        {patient.age || 'NA'}
                      </span>
                    </Table.Cell>
                    <Table.Cell>{patient.gender || 'Not added'}</Table.Cell>
                    <Table.Cell className="max-w-xs truncate">
                      {patient.address || 'Not added'}
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => openView(patient)}
                          className="text-sm font-bold text-blue-600 hover:text-blue-800"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => openEdit(patient)}
                          className="text-sm font-bold text-slate-600 hover:text-slate-900"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => openDelete(patient)}
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
        title={modalMode === 'edit' ? 'Edit Patient' : 'Add Patient'}
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
              Age
              <input
                type="number"
                name="age"
                value={form.age}
                onChange={handleFormChange}
                className={fieldClass}
                min="0"
                max="120"
                required
              />
            </label>
            <label className="text-sm font-bold text-slate-700">
              Gender
              <select
                name="gender"
                value={form.gender}
                onChange={handleFormChange}
                className={fieldClass}
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </label>
            <label className="text-sm font-bold text-slate-700 md:col-span-2">
              Address
              <textarea
                name="address"
                value={form.address}
                onChange={handleFormChange}
                className={textAreaClass}
                rows="3"
                required
              />
            </label>
            <label className="text-sm font-bold text-slate-700">
              Medical Condition
              <input
                name="condition"
                value={form.condition}
                onChange={handleFormChange}
                className={fieldClass}
                placeholder="Optional"
              />
            </label>
            <label className="text-sm font-bold text-slate-700">
              Notes
              <input
                name="notes"
                value={form.notes}
                onChange={handleFormChange}
                className={fieldClass}
                placeholder="Optional"
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
              disabled={savePatient.isPending}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-extrabold text-white disabled:bg-slate-400"
            >
              {savePatient.isPending ? 'Saving...' : 'Save Patient'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={modalMode === 'view'}
        onClose={closeModal}
        title="Patient Details"
        size="lg"
      >
        {selectedPatient ? (
          <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
            {[
              ['Name', getPatientName(selectedPatient)],
              ['Email', getPatientEmail(selectedPatient)],
              ['Phone', getPatientPhone(selectedPatient)],
              ['Age', selectedPatient.age || 'NA'],
              ['Gender', selectedPatient.gender || 'Not added'],
              ['Address', selectedPatient.address || 'Not added'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-slate-50 p-4">
                <p className="text-xs font-extrabold uppercase text-slate-400">{label}</p>
                <p className="mt-1 font-bold text-slate-800">{value}</p>
              </div>
            ))}
            <div className="rounded-lg bg-slate-50 p-4 md:col-span-2">
              <p className="text-xs font-extrabold uppercase text-slate-400">
                Medical History
              </p>
              <div className="mt-2 space-y-2">
                {selectedPatient.medicalHistory?.length ? (
                  selectedPatient.medicalHistory.map((item, index) => (
                    <p key={`${item.condition}-${index}`} className="font-semibold text-slate-700">
                      {item.condition || 'Condition'} {item.notes ? `- ${item.notes}` : ''}
                    </p>
                  ))
                ) : (
                  <p className="font-semibold text-slate-500">No history added</p>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        isOpen={modalMode === 'delete'}
        onClose={closeModal}
        title="Delete Patient"
      >
        {formError ? (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {formError}
          </div>
        ) : null}
        <p className="text-sm font-semibold leading-6 text-slate-600">
          Delete {selectedPatient ? getPatientName(selectedPatient) : 'this patient'} from
          patient records?
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
            onClick={() => deletePatient.mutate(selectedPatient._id)}
            disabled={deletePatient.isPending}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-extrabold text-white disabled:bg-slate-400"
          >
            {deletePatient.isPending ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default Patients;
