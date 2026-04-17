import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Ambulance,
  Baby,
  BadgeIndianRupee,
  BedDouble,
  Bell,
  Bone,
  Brain,
  Building2,
  CalendarCheck,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  HeartPulse,
  Home as HomeIcon,
  Loader2,
  LogIn,
  Mail,
  MapPin,
  Menu,
  PhoneCall,
  ScanLine,
  SearchCheck,
  ShieldCheck,
  Stethoscope,
  UsersRound,
  X,
} from 'lucide-react';
import { api } from '../hooks/useApi';
import siteFallback from '../data/siteFallback';

const iconMap = {
  Activity,
  Ambulance,
  Baby,
  BadgeIndianRupee,
  BedDouble,
  Bone,
  Brain,
  Building2,
  CalendarCheck,
  CheckCircle2,
  ClipboardCheck,
  HeartPulse,
  ScanLine,
  SearchCheck,
  ShieldCheck,
  Stethoscope,
  UsersRound,
};

const aboutMenu = [
  { label: 'About College', href: '/info/about-college' },
  { label: 'About Principal', href: '/info/about-principal' },
  { label: 'Additional Principal', href: '/info/additional-principal' },
  {
    label: 'Patient Care',
    href: '/info/patient-care',
    children: [
      { label: 'OPD Services', href: '/info/opd-services' },
      { label: 'Emergency Services', href: '/info/emergency-services' },
      { label: 'Appointment Help', href: '/info/appointment-help' },
    ],
  },
  { label: 'Principal Message', href: '/info/principal-message' },
  {
    label: 'Committee',
    href: '/info/committee',
    children: [
      { label: 'Hospital Committee', href: '/info/hospital-committee' },
      { label: 'Patient Welfare Committee', href: '/info/patient-welfare-committee' },
    ],
  },
  {
    label: 'RTI Related',
    href: '/info/rti-related',
    children: [
      { label: 'RTI Information', href: '/info/rti-information' },
      { label: 'Public Information Officer', href: '/info/public-information-officer' },
    ],
  },
  { label: 'Major Achievement', href: '/info/major-achievement' },
  { label: 'Clinical Material', href: '/info/clinical-material' },
  { label: 'NIRF', href: '/info/nirf' },
  { label: 'Contact Details', href: '/info/contact-details' },
];

const navMenus = [
  { label: 'About Us', items: aboutMenu },
  {
    label: 'Hospitals & Departments',
    items: [
      { label: 'All Departments', href: '/info/departments' },
      { label: 'Doctor Directory', href: '/info/doctor-directory' },
      { label: 'Patient Care', href: '/info/patient-care' },
      { label: 'Facilities', href: '/info/facilities' },
    ],
  },
  {
    label: 'Student Zone',
    items: [
      { label: 'Admissions', href: '/info/admissions' },
      { label: 'Notices', href: '/info/notices' },
      { label: 'Clinical Material', href: '/info/clinical-material' },
      { label: 'NIRF', href: '/info/nirf' },
    ],
  },
  {
    label: 'Services',
    items: [
      { label: 'Online Appointment', href: '/info/online-appointment' },
      { label: 'Emergency Helpline', href: '/info/emergency-helpline' },
      { label: 'Billing & Insurance', href: '/info/billing-insurance' },
      { label: 'Contact Directory', href: '/info/contact-directory' },
    ],
  },
];

const footerLinkMap = {
  Privacy: '/info/privacy',
  Insurance: '/info/insurance',
  Careers: '/info/careers',
  Feedback: '/info/feedback',
};

const fieldClass =
  'mt-1.5 h-10 w-full rounded border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 outline-none focus:border-[#1d5f91] focus:ring-2 focus:ring-sky-100';

const getDefaultForm = (site) => ({
  name: '',
  phone: '',
  email: '',
  department:
    site?.appointment?.departments?.[0] || site?.departments?.[0]?.name || '',
  doctorId: '',
  preferredDate: '',
  preferredTime: site?.appointment?.timeSlots?.[0] || 'Morning',
  message: '',
});

const Icon = ({ name, className }) => {
  const Component = iconMap[name] || Stethoscope;
  return <Component className={className} aria-hidden="true" />;
};

const MenuItem = ({ item }) => (
  <div className="group/sub relative">
    <Link
      to={item.href}
      className="flex h-9 items-center justify-between border-b border-white/10 bg-[#052b46] px-4 text-[15px] font-semibold text-white hover:bg-[#07446b]"
    >
      {item.label}
      {item.children ? <ChevronRight className="h-4 w-4" /> : null}
    </Link>
    {item.children ? (
      <div className="invisible absolute left-full top-0 z-40 min-w-[230px] opacity-0 shadow-xl transition group-hover/sub:visible group-hover/sub:opacity-100">
        {item.children.map((child) => (
          <Link
            key={child.label}
            to={child.href}
            className="flex h-9 items-center border-b border-white/10 bg-[#052b46] px-4 text-[15px] font-semibold text-white hover:bg-[#07446b]"
          >
            {child.label}
          </Link>
        ))}
      </div>
    ) : null}
  </div>
);

const NavMenu = ({ menu }) => (
  <div className="group relative">
    <button
      type="button"
      className="inline-flex h-14 items-center gap-2 border-r border-white/10 px-5 text-base font-bold text-white hover:bg-[#0a3d61]"
    >
      {menu.label}
      <ChevronDown className="h-4 w-4" />
    </button>
    <div className="invisible absolute left-0 top-14 z-30 min-w-[315px] border-t-2 border-cyan-500 opacity-0 shadow-2xl transition group-hover:visible group-hover:opacity-100">
      {menu.items.map((item) => (
        <MenuItem key={item.label} item={item} />
      ))}
    </div>
  </div>
);

const Panel = ({ title, children, className = '' }) => (
  <section className={`rounded border border-slate-200 bg-white shadow-sm ${className}`}>
    <div className="border-b border-slate-200 bg-[#f5f7fa] px-4 py-3">
      <h2 className="text-base font-black text-[#0b3150]">{title}</h2>
    </div>
    <div className="p-4">{children}</div>
  </section>
);

const Home = () => {
  const [site, setSite] = useState(siteFallback);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState(() => getDefaultForm(siteFallback));
  const [submitState, setSubmitState] = useState({ status: 'idle', message: '' });

  useEffect(() => {
    let active = true;

    api
      .get('/site')
      .then((response) => {
        if (!active || !response.data?.data) return;
        const nextSite = response.data.data;
        setSite(nextSite);
        setForm((current) => ({
          ...current,
          department:
            current.department ||
            nextSite.appointment?.departments?.[0] ||
            nextSite.departments?.[0]?.name ||
            '',
          preferredTime:
            current.preferredTime ||
            nextSite.appointment?.timeSlots?.[0] ||
            'Morning',
        }));
      })
      .catch(() => setSite(siteFallback))
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const heroStyle = useMemo(
    () => ({
      backgroundImage: `linear-gradient(90deg, rgba(4, 34, 58, 0.88), rgba(4, 34, 58, 0.35)), url("${site.hero.imageUrl}")`,
    }),
    [site.hero.imageUrl]
  );

  const appointmentDoctors = site.appointment?.doctors || [];
  const filteredDoctorOptions =
    appointmentDoctors.filter((doctor) => doctor.specialization === form.department)
      .length > 0
      ? appointmentDoctors.filter((doctor) => doctor.specialization === form.department)
      : appointmentDoctors;
  const minDate = useMemo(() => new Date().toISOString().split('T')[0], []);

  const notices = [
    'OPD registration timings updated for all departments.',
    'Emergency, trauma and ambulance services available 24x7.',
    'Online appointment request facility is active for patients.',
    'Clinical material, NIRF, RTI and committee information updated.',
  ];

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSubmitState({ status: 'idle', message: '' });
    setForm((current) => ({
      ...current,
      [name]: value,
      ...(name === 'department' ? { doctorId: '' } : {}),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitState({ status: 'submitting', message: '' });

    try {
      const response = await api.post('/site/appointment-requests', {
        ...form,
        doctorId: form.doctorId || undefined,
      });
      setSubmitState({
        status: 'success',
        message: response.data?.message || 'Appointment request received.',
      });
      setForm(getDefaultForm(site));
    } catch (error) {
      setSubmitState({
        status: 'error',
        message: error.response?.data?.message || 'Request could not be sent.',
      });
    }
  };

  return (
    <div id="top" className="min-h-screen bg-[#eef2f6] text-slate-950">
      <div className="bg-[#f6f6f6] text-xs font-semibold text-slate-700">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-2">
          <div className="flex flex-wrap gap-3">
            <a href="#main-content" className="hover:text-[#0b5b89]">
              Skip to main content
            </a>
            <Link to="/info/online-appointment" className="hover:text-[#0b5b89]">
              Online Appointment
            </Link>
            <Link to="/info/contact-details" className="hover:text-[#0b5b89]">
              Contact Details
            </Link>
          </div>
          <div className="flex gap-2">
            <span>Screen Reader Access</span>
            <span>A-</span>
            <span>A</span>
            <span>A+</span>
          </div>
        </div>
      </div>

      <header className="bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <Link to="/" className="flex min-w-0 items-center gap-4">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center bg-[#0b5b89] text-2xl font-black text-white">
              <Stethoscope className="h-9 w-9" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-black uppercase tracking-[0.16em] text-[#0b5b89]">
                Government Medical Portal
              </span>
              <span className="block text-3xl font-black leading-tight text-[#052b46]">
                {site.brand.name}
              </span>
              <span className="block text-sm font-semibold text-slate-600">
                Hospital, Departments, Patient Care, RTI, NIRF and Contact Details
              </span>
            </span>
          </Link>

          <div className="flex flex-wrap items-center gap-2 text-sm font-bold">
            <a
              href={`tel:${site.contact.emergencyPhone}`}
              className="inline-flex h-10 items-center gap-2 bg-red-600 px-4 text-white"
            >
              <PhoneCall className="h-4 w-4" />
              Emergency
            </a>
            <Link
              to="/login"
              className="inline-flex h-10 items-center gap-2 bg-[#0b5b89] px-4 text-white"
            >
              <LogIn className="h-4 w-4" />
              Staff Login
            </Link>
          </div>
        </div>

        <div className="bg-[#052b46]">
          <div className="mx-auto flex max-w-7xl items-center px-4">
            <Link
              to="/"
              className="flex h-14 w-16 shrink-0 items-center justify-center border-r border-white/10 text-white hover:bg-[#0a3d61]"
              aria-label="Home"
            >
              <HomeIcon className="h-7 w-7" />
            </Link>

            <nav className="hidden lg:flex">
              {navMenus.map((menu) => (
                <NavMenu key={menu.label} menu={menu} />
              ))}
            </nav>

            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              className="ml-auto flex h-14 w-14 items-center justify-center text-white lg:hidden"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {mobileOpen ? (
            <div className="border-t border-white/10 bg-[#052b46] px-4 py-3 lg:hidden">
              <div className="mx-auto grid max-w-7xl gap-2">
                {navMenus.map((menu) => (
                  <details key={menu.label} className="bg-[#073553] text-white">
                    <summary className="cursor-pointer px-3 py-2 font-bold">
                      {menu.label}
                    </summary>
                    <div className="border-t border-white/10">
                      {menu.items.map((item) => (
                        <Link
                          key={item.label}
                          to={item.href}
                          onClick={() => setMobileOpen(false)}
                          className="block border-b border-white/10 px-5 py-2 text-sm font-semibold"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-7xl px-4 py-4">
        <section id="notices" className="mb-4 flex items-center bg-[#fff6dc] text-sm">
          <span className="flex h-10 shrink-0 items-center gap-2 bg-[#0b5b89] px-4 font-black text-white">
            <Bell className="h-4 w-4" />
            Latest
          </span>
          <p className="min-w-0 truncate px-4 font-bold text-[#052b46]">
            {notices.join('     |     ')}
          </p>
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-[1.35fr_0.65fr]">
          <div
            className="min-h-[330px] bg-cover bg-center"
            style={heroStyle}
          >
            <div className="flex min-h-[330px] flex-col justify-end p-6 text-white">
              <p className="w-fit bg-cyan-500 px-3 py-1 text-sm font-black">
                {site.hero.eyebrow}
              </p>
              <h1 className="mt-3 text-4xl font-black leading-tight">
                {site.hero.title}
              </h1>
              <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-blue-50">
                {site.hero.subtitle}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  to="/info/online-appointment"
                  className="bg-[#f4b24f] px-5 py-3 text-sm font-black text-[#052b46]"
                >
                  Book Appointment
                </Link>
                <Link
                  to="/info/departments"
                  className="border border-white/60 px-5 py-3 text-sm font-black text-white"
                >
                  View Departments
                </Link>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <Panel title="Important Links">
              <div className="grid gap-2">
                {[
                  ['Online Appointment', '/info/online-appointment'],
                  ['Patient Care', '/info/patient-care'],
                  ['Clinical Material', '/info/clinical-material'],
                  ['RTI Related', '/info/rti-related'],
                  ['NIRF', '/info/nirf'],
                  ['Contact Details', '/info/contact-details'],
                ].map(([label, to]) => (
                  <Link
                    key={label}
                    to={to}
                    className="flex items-center justify-between bg-[#f2f6fa] px-3 py-2 text-sm font-bold text-[#052b46] hover:bg-cyan-50"
                  >
                    {label}
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                ))}
              </div>
            </Panel>

            <Panel title="Notice Board">
              <div className="grid gap-2">
                {notices.map((notice) => (
                  <p
                    key={notice}
                    className="border-b border-slate-200 pb-2 text-sm font-semibold leading-6 text-slate-700"
                  >
                    {notice}
                  </p>
                ))}
              </div>
            </Panel>
          </div>
        </section>

        <section className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          {(site.metrics || []).map((metric) => (
            <div key={metric.key} className="bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center bg-cyan-50 text-[#0b5b89]">
                  <Icon name={metric.icon} className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-2xl font-black text-[#052b46]">{metric.value}</p>
                  <p className="text-xs font-bold text-slate-500">{metric.label}</p>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr]">
          <Panel title="About College" className="scroll-mt-20" >
            <div id="about" className="grid gap-4 md:grid-cols-[1fr_190px]">
              <div>
                <p className="text-sm font-semibold leading-7 text-slate-700">
                  {site.footer.description}
                </p>
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {(site.services || []).slice(0, 4).map((service) => (
                    <div key={service.title} className="bg-[#f5f8fb] p-3">
                      <div className="flex items-start gap-2">
                        <Icon
                          name={service.icon}
                          className="mt-0.5 h-5 w-5 shrink-0 text-[#0b5b89]"
                        />
                        <div>
                          <p className="text-sm font-black text-[#052b46]">
                            {service.title}
                          </p>
                          <p className="mt-1 text-xs font-semibold leading-5 text-slate-600">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div id="principal" className="bg-[#f5f8fb] p-4 text-center">
                <div className="mx-auto flex h-24 w-24 items-center justify-center bg-[#052b46] text-3xl font-black text-white">
                  MS
                </div>
                <p className="mt-3 font-black text-[#052b46]">Principal Message</p>
                <p className="mt-1 text-xs font-semibold leading-5 text-slate-600">
                  Patient-first care, transparent information, and accessible medical
                  services.
                </p>
              </div>
            </div>
          </Panel>

          <Panel title="Patient Care" className="scroll-mt-20">
            <div id="patient-care" className="grid gap-3 sm:grid-cols-2">
              {[
                ['Emergency', site.contact.emergencyPhone],
                ['OPD Registration', 'Morning and afternoon counters'],
                ['Appointment Desk', site.topbar.appointmentPhone],
                ['Help Desk', site.contact.phone],
              ].map(([title, detail]) => (
                <div key={title} className="bg-[#f5f8fb] p-4">
                  <p className="text-sm font-black text-[#052b46]">{title}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-600">{detail}</p>
                </div>
              ))}
            </div>
          </Panel>
        </section>

        <section id="departments" className="mt-4 scroll-mt-20">
          <Panel title="Hospitals & Departments">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {(site.departments || []).map((department) => (
                <article key={department.id || department.name} className="bg-[#f5f8fb] p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-white text-[#0b5b89]">
                      <Icon name={department.icon} className="h-6 w-6" />
                    </span>
                    <div>
                      <h3 className="font-black text-[#052b46]">{department.name}</h3>
                      <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">
                        {department.description}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </Panel>
        </section>

        <section id="doctors" className="mt-4 scroll-mt-20">
          <Panel title="Doctor Directory">
            <div className="overflow-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-[#052b46] text-white">
                  <tr>
                    <th className="px-4 py-3">Doctor</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Experience</th>
                    <th className="px-4 py-3">Availability</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {(site.doctors || []).map((doctor) => (
                    <tr key={doctor.id || doctor.name}>
                      <td className="px-4 py-3 font-black text-[#052b46]">{doctor.name}</td>
                      <td className="px-4 py-3 font-semibold">{doctor.specialization}</td>
                      <td className="px-4 py-3 font-semibold">{doctor.experience}+ years</td>
                      <td className="px-4 py-3 font-semibold">{doctor.availableTime}</td>
                      <td className="px-4 py-3">
                        <Link
                          to="/info/online-appointment"
                          className="bg-[#f4b24f] px-3 py-2 text-xs font-black text-[#052b46]"
                        >
                          Book
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </section>

        <section className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <Panel title="Appointment Request" className="scroll-mt-20">
            <form id="appointment" onSubmit={handleSubmit} className="grid gap-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-sm font-bold text-slate-700">
                  Full Name
                  <input
                    required
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    className={fieldClass}
                  />
                </label>
                <label className="text-sm font-bold text-slate-700">
                  Phone
                  <input
                    required
                    name="phone"
                    value={form.phone}
                    onChange={handleInputChange}
                    className={fieldClass}
                  />
                </label>
                <label className="text-sm font-bold text-slate-700">
                  Email
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleInputChange}
                    className={fieldClass}
                  />
                </label>
                <label className="text-sm font-bold text-slate-700">
                  Department
                  <select
                    required
                    name="department"
                    value={form.department}
                    onChange={handleInputChange}
                    className={fieldClass}
                  >
                    {(site.appointment.departments || []).map((department) => (
                      <option key={department} value={department}>
                        {department}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm font-bold text-slate-700">
                  Doctor
                  <select
                    name="doctorId"
                    value={form.doctorId}
                    onChange={handleInputChange}
                    className={fieldClass}
                  >
                    <option value="">Any available specialist</option>
                    {filteredDoctorOptions.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.specialization}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm font-bold text-slate-700">
                  Date
                  <input
                    name="preferredDate"
                    type="date"
                    min={minDate}
                    value={form.preferredDate}
                    onChange={handleInputChange}
                    className={fieldClass}
                  />
                </label>
                <label className="text-sm font-bold text-slate-700 sm:col-span-2">
                  Time
                  <select
                    name="preferredTime"
                    value={form.preferredTime}
                    onChange={handleInputChange}
                    className={fieldClass}
                  >
                    {(site.appointment.timeSlots || []).map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm font-bold text-slate-700 sm:col-span-2">
                  Concern
                  <textarea
                    name="message"
                    rows="3"
                    value={form.message}
                    onChange={handleInputChange}
                    className={`${fieldClass} h-auto py-2`}
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={submitState.status === 'submitting'}
                className="bg-[#0b5b89] px-5 py-3 text-sm font-black text-white disabled:bg-slate-400"
              >
                {submitState.status === 'submitting' ? 'Submitting...' : 'Submit Request'}
              </button>
              {submitState.message ? (
                <p
                  className={`px-3 py-2 text-sm font-bold ${
                    submitState.status === 'success'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  {submitState.message}
                </p>
              ) : null}
            </form>
          </Panel>

          <div className="grid gap-4">
            <Panel title="Facilities" className="scroll-mt-20">
              <div id="facilities" className="grid gap-3 sm:grid-cols-2">
                {(site.facilities || []).map((facility) => (
                  <div key={facility.title} className="bg-[#f5f8fb] p-3">
                    <Icon name={facility.icon} className="h-6 w-6 text-[#0b5b89]" />
                    <p className="mt-2 text-sm font-black text-[#052b46]">
                      {facility.title}
                    </p>
                    <p className="mt-1 text-xs font-semibold leading-5 text-slate-600">
                      {facility.description}
                    </p>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Public Information">
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ['committees', 'Committee', 'Hospital and patient welfare committee details.'],
                  ['rti', 'RTI Related', 'Public information and RTI officer details.'],
                  ['achievements', 'Major Achievement', 'Hospital achievements and service milestones.'],
                  ['clinical', 'Clinical Material', 'Clinical learning material and patient resources.'],
                  ['nirf', 'NIRF', 'Institutional ranking and reporting section.'],
                ].map(([id, title, detail]) => (
                  <div id={id} key={id} className="scroll-mt-20 bg-[#f5f8fb] p-3">
                    <p className="text-sm font-black text-[#052b46]">{title}</p>
                    <p className="mt-1 text-xs font-semibold leading-5 text-slate-600">
                      {detail}
                    </p>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </section>

        <section id="contact" className="mt-4 scroll-mt-20">
          <Panel title="Contact Details">
            <div className="grid gap-3 md:grid-cols-3">
              <div className="bg-[#f5f8fb] p-4">
                <PhoneCall className="h-6 w-6 text-[#0b5b89]" />
                <p className="mt-2 text-sm font-black text-[#052b46]">Phone</p>
                <p className="font-semibold text-slate-700">{site.contact.phone}</p>
              </div>
              <div className="bg-[#f5f8fb] p-4">
                <Mail className="h-6 w-6 text-[#0b5b89]" />
                <p className="mt-2 text-sm font-black text-[#052b46]">Email</p>
                <p className="break-words font-semibold text-slate-700">
                  {site.contact.email}
                </p>
              </div>
              <div className="bg-[#f5f8fb] p-4">
                <MapPin className="h-6 w-6 text-[#0b5b89]" />
                <p className="mt-2 text-sm font-black text-[#052b46]">Address</p>
                <p className="font-semibold text-slate-700">{site.contact.address}</p>
              </div>
            </div>
          </Panel>
        </section>
      </main>

      <footer className="mt-4 bg-[#052b46] px-4 py-5 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-black">{site.brand.name}</p>
            <p className="text-sm font-semibold text-blue-100">{site.brand.tagline}</p>
          </div>
          <div className="flex flex-wrap gap-2 text-sm font-bold">
            {(site.footer.links || []).map((link) => (
              <Link
                key={link}
                to={footerLinkMap[link] || '/'}
                className="border border-white/20 px-3 py-2"
              >
                {link}
              </Link>
            ))}
          </div>
        </div>
      </footer>

      {isLoading ? (
        <div className="fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-lg ring-1 ring-slate-200">
          <Loader2 className="h-4 w-4 animate-spin text-[#0b5b89]" />
          Loading live hospital data
        </div>
      ) : null}
    </div>
  );
};

export default Home;
