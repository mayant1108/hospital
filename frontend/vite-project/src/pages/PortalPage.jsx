import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BadgeIndianRupee,
  Bell,
  Building2,
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  Clock3,
  ClipboardCheck,
  FileText,
  HeartPulse,
  Home,
  Loader2,
  Mail,
  MapPin,
  PhoneCall,
  SearchCheck,
  ShieldCheck,
  Stethoscope,
  UsersRound,
} from 'lucide-react';
import { api } from '../hooks/useApi';
import siteFallback from '../data/siteFallback';

const portalPages = {
  'about-college': {
    title: 'About College',
    group: 'About Us',
    description: 'Institution profile, hospital mission, departments and public services.',
  },
  'about-principal': {
    title: 'About Principal',
    group: 'About Us',
    description: 'Principal profile and administrative leadership information.',
  },
  'additional-principal': {
    title: 'Additional Principal',
    group: 'About Us',
    description: 'Additional principal office and coordination information.',
  },
  'patient-care': {
    title: 'Patient Care',
    group: 'About Us',
    description: 'OPD, emergency, appointment desk and patient help services.',
  },
  'opd-services': {
    title: 'OPD Services',
    group: 'Patient Care',
    description: 'Department-wise outpatient registration and consultation support.',
  },
  'emergency-services': {
    title: 'Emergency Services',
    group: 'Patient Care',
    description: 'Round-the-clock emergency, trauma and ambulance information.',
  },
  'appointment-help': {
    title: 'Appointment Help',
    group: 'Patient Care',
    description: 'Online appointment request and visit assistance.',
    appointment: true,
  },
  'principal-message': {
    title: 'Principal Message',
    group: 'About Us',
    description: 'Message from the hospital administration for patients and visitors.',
  },
  committee: {
    title: 'Committee',
    group: 'About Us',
    description: 'Hospital committees and patient welfare committee information.',
  },
  'hospital-committee': {
    title: 'Hospital Committee',
    group: 'Committee',
    description: 'Administrative and service review committee details.',
  },
  'patient-welfare-committee': {
    title: 'Patient Welfare Committee',
    group: 'Committee',
    description: 'Patient welfare, assistance and grievance support committee.',
  },
  'rti-related': {
    title: 'RTI Related',
    group: 'About Us',
    description: 'Right to Information details and public information contacts.',
  },
  'rti-information': {
    title: 'RTI Information',
    group: 'RTI Related',
    description: 'RTI process, information access and public disclosure section.',
  },
  'public-information-officer': {
    title: 'Public Information Officer',
    group: 'RTI Related',
    description: 'Public information officer contact and RTI assistance details.',
  },
  'major-achievement': {
    title: 'Major Achievement',
    group: 'About Us',
    description: 'Major hospital achievements, service milestones and recognitions.',
  },
  'clinical-material': {
    title: 'Clinical Material',
    group: 'Student Zone',
    description: 'Clinical learning material and public health resources.',
  },
  nirf: {
    title: 'NIRF',
    group: 'Student Zone',
    description: 'Institutional ranking, reporting and academic information.',
  },
  'contact-details': {
    title: 'Contact Details',
    group: 'About Us',
    description: 'Hospital phone, email, address and helpline details.',
    contact: true,
  },
  departments: {
    title: 'All Departments',
    group: 'Hospitals & Departments',
    description: 'Department-wise services and available specialties.',
    departments: true,
  },
  'doctor-directory': {
    title: 'Doctor Directory',
    group: 'Hospitals & Departments',
    description: 'Doctor list, specialty and availability information.',
    doctors: true,
  },
  facilities: {
    title: 'Facilities',
    group: 'Hospitals & Departments',
    description: 'Patient facilities, billing support and hospital infrastructure.',
    facilities: true,
  },
  admissions: {
    title: 'Admissions',
    group: 'Student Zone',
    description: 'Admission notices and student information.',
  },
  notices: {
    title: 'Notices',
    group: 'Student Zone',
    description: 'Latest public notices and important hospital updates.',
    notices: true,
  },
  'online-appointment': {
    title: 'Online Appointment',
    group: 'Services',
    description: 'Submit an online appointment request.',
    appointment: true,
  },
  'emergency-helpline': {
    title: 'Emergency Helpline',
    group: 'Services',
    description: 'Emergency and trauma helpline details.',
    contact: true,
  },
  'billing-insurance': {
    title: 'Billing & Insurance',
    group: 'Services',
    description: 'Cashless billing, insurance and payment support details.',
  },
  'contact-directory': {
    title: 'Contact Directory',
    group: 'Services',
    description: 'Hospital contact directory and help desk information.',
    contact: true,
  },
  privacy: {
    title: 'Privacy',
    group: 'Footer',
    description: 'Privacy and visitor information policy.',
  },
  insurance: {
    title: 'Insurance',
    group: 'Footer',
    description: 'Insurance, TPA and cashless billing support information.',
  },
  careers: {
    title: 'Careers',
    group: 'Footer',
    description: 'Career and recruitment information for hospital services.',
  },
  feedback: {
    title: 'Feedback',
    group: 'Footer',
    description: 'Feedback and public grievance support information.',
  },
};

const pageContent = {
  'about-college': {
    sections: [
      {
        title: 'Institution Overview',
        body:
          'The hospital portal represents a teaching and patient-care institution with coordinated outpatient, emergency, diagnostic, clinical and administrative services.',
      },
      {
        title: 'Core Objectives',
        body:
          'Provide accessible patient care, maintain transparent public information, support academic clinical learning and keep citizens connected with departments and hospital services.',
      },
      {
        title: 'Key Public Services',
        list: ['OPD registration', 'Emergency care', 'Specialty consultation', 'Diagnostics', 'Billing support', 'Online appointment request'],
      },
    ],
  },
  'about-principal': {
    sections: [
      {
        title: 'Principal Office',
        body:
          'The principal office supervises academic coordination, hospital service standards, clinical governance and public service delivery across departments.',
      },
      {
        title: 'Responsibilities',
        list: ['Academic leadership', 'Clinical quality review', 'Hospital coordination', 'Public communication', 'Departmental supervision'],
      },
    ],
    table: {
      columns: ['Office', 'Responsibility', 'Contact'],
      rows: [
        ['Principal Office', 'Academic and clinical administration', 'principal@hospital.example'],
        ['Administrative Cell', 'Records, notices and public communication', 'admin@hospital.example'],
      ],
    },
  },
  'additional-principal': {
    sections: [
      {
        title: 'Additional Principal Office',
        body:
          'The additional principal office supports coordination between hospital departments, academic units, committees and public service desks.',
      },
      {
        title: 'Coordination Areas',
        list: ['Department meetings', 'Student affairs', 'Committee follow-up', 'Patient service review', 'Infrastructure coordination'],
      },
    ],
  },
  'patient-care': {
    sections: [
      {
        title: 'Patient Services',
        body:
          'Patient care includes OPD consultation, emergency response, appointment assistance, diagnostics, billing guidance and follow-up support.',
      },
      {
        title: 'Help Desk Services',
        list: ['Registration guidance', 'Department directions', 'Doctor availability', 'Emergency escalation', 'Billing and insurance support'],
      },
    ],
    table: {
      columns: ['Service', 'Timing', 'Support Desk'],
      rows: [
        ['OPD Registration', '09:00 AM - 02:00 PM', 'Main registration counter'],
        ['Emergency Care', '24x7', 'Emergency and trauma desk'],
        ['Appointment Desk', '10:00 AM - 05:00 PM', 'Patient help desk'],
      ],
    },
  },
  'opd-services': {
    sections: [
      {
        title: 'OPD Workflow',
        list: ['Register at OPD counter', 'Select department', 'Consult assigned doctor', 'Complete diagnostics if advised', 'Collect prescription and follow-up date'],
      },
      {
        title: 'Patient Instructions',
        body:
          'Patients should carry previous prescriptions, investigation reports, identity proof and registered mobile number for faster service.',
      },
    ],
  },
  'emergency-services': {
    sections: [
      {
        title: 'Emergency Services',
        body:
          'Emergency services operate round the clock with triage, first response, stabilization and specialty referral support.',
      },
      {
        title: 'Available Support',
        list: ['Trauma response', 'Critical care coordination', 'Ambulance assistance', 'Emergency diagnostics', 'Referral management'],
      },
    ],
    table: {
      columns: ['Desk', 'Availability', 'Phone'],
      rows: [
        ['Emergency Help Desk', '24x7', '+91 98765 43210'],
        ['Ambulance Coordination', '24x7', '+91 98765 43210'],
      ],
    },
  },
  'appointment-help': {
    sections: [
      {
        title: 'Appointment Help',
        body:
          'Use the appointment form to send patient details, preferred department, doctor and visit date. The care desk will follow up.',
      },
      {
        title: 'Before Submitting',
        list: ['Enter correct phone number', 'Choose department carefully', 'Mention symptoms briefly', 'Keep reports ready for visit'],
      },
    ],
  },
  'principal-message': {
    sections: [
      {
        title: 'Message',
        body:
          'Our priority is timely patient care, clear public information and responsible clinical service. The hospital portal is designed to help citizens reach the right department quickly.',
      },
      {
        title: 'Focus Areas',
        list: ['Patient safety', 'Transparent services', 'Academic excellence', 'Emergency readiness', 'Digital access'],
      },
    ],
  },
  committee: {
    sections: [
      {
        title: 'Committee Overview',
        body:
          'Committees review patient services, hospital operations, welfare activities, public grievances and administrative coordination.',
      },
    ],
    table: {
      columns: ['Committee', 'Purpose', 'Meeting Frequency'],
      rows: [
        ['Hospital Committee', 'Service and infrastructure review', 'Monthly'],
        ['Patient Welfare Committee', 'Patient support and welfare review', 'Monthly'],
        ['Grievance Committee', 'Public feedback and resolution', 'As required'],
      ],
    },
  },
  'hospital-committee': {
    sections: [
      {
        title: 'Hospital Committee Functions',
        list: ['Review OPD services', 'Monitor emergency readiness', 'Track infrastructure needs', 'Coordinate departmental issues'],
      },
    ],
    table: {
      columns: ['Role', 'Responsibility'],
      rows: [
        ['Chairperson', 'Overall committee supervision'],
        ['Member Secretary', 'Meeting records and follow-up'],
        ['Department Representatives', 'Department-level reporting'],
      ],
    },
  },
  'patient-welfare-committee': {
    sections: [
      {
        title: 'Patient Welfare Activities',
        list: ['Help desk support', 'Financial guidance', 'Patient feedback review', 'Counselling assistance', 'Public grievance coordination'],
      },
    ],
  },
  'rti-related': {
    sections: [
      {
        title: 'RTI Related Information',
        body:
          'This section provides public information access, RTI officer details and citizen guidance for information requests.',
      },
      {
        title: 'Available Information',
        list: ['Public information officer', 'Application process', 'Department records guidance', 'Public disclosure documents'],
      },
    ],
  },
  'rti-information': {
    sections: [
      {
        title: 'RTI Application Process',
        list: ['Prepare application with clear subject', 'Submit to public information office', 'Provide contact details', 'Track response as per RTI rules'],
      },
    ],
  },
  'public-information-officer': {
    table: {
      columns: ['Officer', 'Designation', 'Contact'],
      rows: [
        ['Public Information Officer', 'Administrative Officer', 'pio@hospital.example'],
        ['Assistant PIO', 'Records Section', 'apio@hospital.example'],
      ],
    },
    sections: [
      {
        title: 'Office Hours',
        body: 'RTI assistance is available during regular office hours on working days.',
      },
    ],
  },
  'major-achievement': {
    sections: [
      {
        title: 'Achievements',
        list: ['Expanded emergency response coverage', 'Digital appointment request workflow', 'Integrated department information', 'Improved patient help desk access'],
      },
    ],
    table: {
      columns: ['Year', 'Achievement', 'Impact'],
      rows: [
        ['2024', 'Digital patient services initiated', 'Improved citizen access'],
        ['2025', 'Department information portal upgraded', 'Faster service discovery'],
        ['2026', 'Online appointment workflow added', 'Reduced help desk load'],
      ],
    },
  },
  'clinical-material': {
    sections: [
      {
        title: 'Clinical Material',
        body:
          'Clinical learning and reference material is organized department-wise for students, interns and clinical teams.',
      },
      {
        title: 'Material Categories',
        list: ['Case sheets', 'Clinical protocols', 'OPD guidelines', 'Emergency checklists', 'Patient education handouts'],
      },
    ],
    table: {
      columns: ['Department', 'Material', 'Status'],
      rows: [
        ['Medicine', 'OPD case format', 'Available'],
        ['Emergency', 'Triage checklist', 'Available'],
        ['Pediatrics', 'Growth chart reference', 'Available'],
      ],
    },
  },
  nirf: {
    sections: [
      {
        title: 'NIRF Information',
        body:
          'This section contains institutional ranking, academic reporting and public disclosure information used for NIRF-style documentation.',
      },
      {
        title: 'Reporting Areas',
        list: ['Teaching and learning', 'Research and professional practice', 'Graduation outcomes', 'Outreach and inclusivity', 'Peer perception'],
      },
    ],
  },
  admissions: {
    sections: [
      {
        title: 'Admissions',
        body:
          'Admission notices, document requirements and student reporting information will be displayed here for applicants.',
      },
      {
        title: 'Common Documents',
        list: ['Application form', 'Identity proof', 'Academic certificates', 'Category certificate if applicable', 'Fee receipt'],
      },
    ],
  },
  notices: {
    table: {
      columns: ['Date', 'Notice', 'Category'],
      rows: [
        ['17 Apr 2026', 'OPD timing update for all departments', 'Patient Services'],
        ['16 Apr 2026', 'Emergency help desk contact updated', 'Emergency'],
        ['15 Apr 2026', 'Clinical material section updated', 'Academic'],
      ],
    },
  },
  'contact-details': {
    sections: [
      {
        title: 'Main Contact Points',
        list: ['General enquiry desk', 'Emergency helpline', 'Appointment counter', 'Administrative office'],
      },
      {
        title: 'Visitor Guidance',
        body:
          'Patients and visitors can use the contact desk for department directions, appointment help, emergency escalation and billing guidance.',
      },
    ],
    table: {
      columns: ['Desk', 'Purpose', 'Availability'],
      rows: [
        ['Reception', 'General hospital information', '08:00 AM - 08:00 PM'],
        ['Emergency Desk', 'Emergency and trauma support', '24x7'],
        ['Appointment Desk', 'OPD visit assistance', '10:00 AM - 05:00 PM'],
      ],
    },
  },
  departments: {
    sections: [
      {
        title: 'Department Services',
        body:
          'Department pages show specialty services, doctor availability, clinic location and key patient instructions in one place.',
      },
      {
        title: 'Common Department Support',
        list: ['OPD consultation', 'Follow-up planning', 'Diagnostics coordination', 'Referral support', 'Patient education'],
      },
    ],
  },
  'doctor-directory': {
    sections: [
      {
        title: 'Doctor Directory',
        body:
          'The directory helps patients identify available specialists, department timing and appointment action quickly.',
      },
      {
        title: 'Before Visit',
        list: ['Carry old prescriptions', 'Bring reports and scans', 'Keep registered mobile number active', 'Reach counter before OPD closing time'],
      },
    ],
  },
  facilities: {
    sections: [
      {
        title: 'Patient Facilities',
        body:
          'Facilities are organized to support clinical care, diagnostics, billing, recovery and public help desk workflows.',
      },
      {
        title: 'Facility Standards',
        list: ['Clean patient areas', 'Digital records support', 'Cashless desk guidance', 'Emergency-ready infrastructure'],
      },
    ],
  },
  'online-appointment': {
    sections: [
      {
        title: 'Online Request Flow',
        list: ['Fill patient details', 'Select department', 'Choose preferred date', 'Submit request', 'Wait for care desk confirmation'],
      },
      {
        title: 'Confirmation Note',
        body:
          'Submitting the form creates an appointment request. Final visit timing depends on doctor availability and help desk confirmation.',
      },
    ],
  },
  'emergency-helpline': {
    sections: [
      {
        title: 'Emergency Helpline',
        body:
          'Emergency and trauma services remain available round the clock. Call the emergency desk for urgent patient movement or ambulance coordination.',
      },
      {
        title: 'Use This For',
        list: ['Accident and trauma', 'Chest pain', 'Severe breathlessness', 'Stroke symptoms', 'Critical patient transfer'],
      },
    ],
    table: {
      columns: ['Service', 'Availability', 'Action'],
      rows: [
        ['Emergency Desk', '24x7', 'Call emergency helpline'],
        ['Ambulance Coordination', '24x7', 'Call before arrival if possible'],
        ['Triage Counter', '24x7', 'Report directly at emergency entry'],
      ],
    },
  },
  'contact-directory': {
    sections: [
      {
        title: 'Contact Directory',
        body:
          'Use the directory to reach the correct desk for enquiry, appointment, emergency support, billing and administrative information.',
      },
    ],
    table: {
      columns: ['Unit', 'Support Area', 'Recommended Contact'],
      rows: [
        ['Help Desk', 'General patient enquiry', 'Main hospital phone'],
        ['Emergency Desk', 'Urgent care and ambulance', 'Emergency phone'],
        ['Billing Desk', 'Invoice, estimate and payment support', 'Billing counter'],
        ['Administration', 'Records, notices and public information', 'Administrative office'],
      ],
    },
  },
  'billing-insurance': {
    sections: [
      {
        title: 'Billing Support',
        list: ['Cash billing', 'UPI and card payments', 'Estimate guidance', 'Invoice support', 'Refund coordination'],
      },
      {
        title: 'Insurance Desk',
        body:
          'The insurance desk assists patients with cashless processing, document verification and TPA coordination.',
      },
    ],
  },
  privacy: {
    sections: [
      {
        title: 'Privacy Policy',
        body:
          'Patient and visitor details submitted through the portal are used only for hospital service coordination and appointment follow-up.',
      },
      {
        title: 'Data Use',
        list: ['Appointment communication', 'Patient help desk support', 'Administrative record keeping'],
      },
    ],
  },
  insurance: {
    sections: [
      {
        title: 'Insurance Services',
        list: ['TPA desk assistance', 'Cashless claim support', 'Document checklist guidance', 'Billing coordination'],
      },
    ],
  },
  careers: {
    sections: [
      {
        title: 'Careers',
        body:
          'Recruitment and vacancy notices for clinical, nursing, technical and administrative roles will be displayed on this page.',
      },
      {
        title: 'Common Roles',
        list: ['Doctors', 'Nursing staff', 'Lab technicians', 'Front desk operators', 'Administrative staff'],
      },
    ],
  },
  feedback: {
    sections: [
      {
        title: 'Feedback',
        body:
          'Patients and visitors can share feedback related to service experience, OPD flow, emergency care, billing support and public information.',
      },
      {
        title: 'Feedback Categories',
        list: ['Patient care', 'Cleanliness', 'Staff behaviour', 'Billing', 'Appointment support'],
      },
    ],
  },
};

const fieldClass =
  'mt-2 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#0b5b89] focus:ring-4 focus:ring-cyan-100';

const iconMap = {
  BadgeIndianRupee,
  Building2,
  CalendarCheck,
  CheckCircle2,
  ClipboardCheck,
  HeartPulse,
  SearchCheck,
  ShieldCheck,
  Stethoscope,
  UsersRound,
};

const Icon = ({ name, className }) => {
  const Component = iconMap[name] || Stethoscope;
  return <Component className={className} aria-hidden="true" />;
};

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

const getEmergencyPhone = (site) =>
  site?.contact?.emergencyPhone || site?.topbar?.emergencyPhone || site?.contact?.phone || '';

const getRelatedLinks = (currentSlug, group) => {
  const sameGroup = Object.entries(portalPages)
    .filter(([key, item]) => key !== currentSlug && item.group === group)
    .map(([key, item]) => ({ slug: key, title: item.title }));

  const essentials = [
    'online-appointment',
    'emergency-helpline',
    'departments',
    'doctor-directory',
    'contact-details',
  ].map((key) => ({ slug: key, title: portalPages[key].title }));

  const seen = new Set();
  return [...sameGroup, ...essentials]
    .filter((item) => {
      if (item.slug === currentSlug || seen.has(item.slug)) return false;
      seen.add(item.slug);
      return true;
    })
    .slice(0, 6);
};

const InfoCard = ({ title, children, icon }) => {
  const CardIcon = icon || FileText;

  return (
    <article className="group relative overflow-hidden rounded-md border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-lg">
      <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#0b5b89] via-cyan-500 to-[#f4b24f]" />
      <div className="flex h-11 w-11 items-center justify-center rounded-md bg-cyan-50 text-[#0b5b89] ring-1 ring-cyan-100 transition group-hover:bg-[#0b5b89] group-hover:text-white">
        <CardIcon className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-base font-black text-[#052b46]">{title}</h3>
      <div className="mt-2 text-sm font-semibold leading-6 text-slate-600">
        {children}
      </div>
    </article>
  );
};

const SectionTitle = ({ eyebrow, title, subtitle, icon }) => {
  const TitleIcon = icon || ClipboardCheck;

  return (
    <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? (
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0b5b89]">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-1 flex items-center gap-2 text-xl font-black text-[#052b46]">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[#052b46] text-white">
            <TitleIcon className="h-5 w-5" />
          </span>
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-600">
            {subtitle}
          </p>
        ) : null}
      </div>
    </div>
  );
};

const DataTable = ({ title = 'Official Details', columns, rows }) => (
  <section className="mb-5 overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
    <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-[#f8fafc] px-5 py-4">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.16em] text-[#0b5b89]">
          Data Table
        </p>
        <h2 className="mt-1 text-lg font-black text-[#052b46]">{title}</h2>
      </div>
      <ClipboardCheck className="h-7 w-7 text-[#0b5b89]" />
    </div>
    <div className="overflow-auto">
      <table className="w-full min-w-[680px] text-left text-sm">
        <thead className="bg-[#052b46] text-white">
          <tr>
            {columns.map((column) => (
              <th key={column} className="px-5 py-3 font-black">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {rows.map((row, rowIndex) => (
            <tr key={`${title}-${rowIndex}`} className="hover:bg-cyan-50/50">
              {row.map((cell, cellIndex) => (
                <td
                  key={`${title}-${rowIndex}-${cellIndex}`}
                  className="px-5 py-4 font-semibold leading-6 text-slate-700"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

const ContentSections = ({ content }) => {
  if (!content) return null;

  return (
    <>
      {content.sections?.length ? (
        <section className="mb-5">
          <SectionTitle
            eyebrow="Page Information"
            title="Key Information"
            subtitle="Important details are organized for quick reading and public-service use."
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {content.sections.map((section) => (
              <InfoCard key={section.title} title={section.title} icon={ClipboardCheck}>
                {section.body ? <p>{section.body}</p> : null}
                {section.list?.length ? (
                  <ul className="grid gap-2">
                    {section.list.map((item) => (
                      <li key={item} className="flex gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </InfoCard>
            ))}
          </div>
        </section>
      ) : null}

      {content.table ? (
        <DataTable
          title={content.table.title || 'Official Details'}
          columns={content.table.columns}
          rows={content.table.rows}
        />
      ) : null}
    </>
  );
};

const PortalPage = () => {
  const { slug } = useParams();
  const page = portalPages[slug];
  const content = pageContent[slug];
  const [site, setSite] = useState(siteFallback);
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

  const minDate = useMemo(() => new Date().toISOString().split('T')[0], []);
  const appointmentDoctors = site.appointment?.doctors || [];
  const filteredDoctorOptions =
    appointmentDoctors.filter((doctor) => doctor.specialization === form.department)
      .length > 0
      ? appointmentDoctors.filter((doctor) => doctor.specialization === form.department)
      : appointmentDoctors;

  if (!page) {
    return <Navigate to="/" replace />;
  }

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

  const relatedLinks = getRelatedLinks(slug, page.group);
  const emergencyPhone = getEmergencyPhone(site);
  const contactPhone = site.contact?.phone || site.topbar?.appointmentPhone || '';
  const appointmentDepartments =
    site.appointment?.departments || site.departments?.map((department) => department.name) || [];
  const appointmentTimeSlots = site.appointment?.timeSlots || ['Morning', 'Afternoon', 'Evening'];
  const publicMetrics = (site.metrics || []).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#edf3f7] text-slate-950">
      <header className="relative overflow-hidden bg-[#052b46] text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-[#052b46] via-[#06395d] to-[#0b5b89]" />
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-cyan-400 via-[#f4b24f] to-emerald-400" />
        <div className="relative mx-auto max-w-7xl px-4 py-5">
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm font-bold">
            <div className="flex min-w-0 flex-wrap items-center gap-2 text-cyan-100">
              <Link to="/" className="inline-flex items-center gap-2 hover:text-white">
                <Home className="h-4 w-4" />
                Home
              </Link>
              <ChevronRight className="h-4 w-4 text-cyan-300" />
              <span className="text-white">{page.group}</span>
            </div>
            <Link
              to="/"
              className="inline-flex w-fit items-center gap-2 rounded-md border border-white/25 bg-white/10 px-4 py-2 text-sm font-black text-white shadow-sm transition hover:bg-white hover:text-[#052b46]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
            <div>
              <p className="inline-flex items-center gap-2 rounded-md bg-cyan-400 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-[#052b46]">
                <Stethoscope className="h-4 w-4" />
                {page.group}
              </p>
              <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight sm:text-5xl">
                {page.title}
              </h1>
              <p className="mt-4 max-w-3xl text-base font-semibold leading-7 text-blue-50">
                {page.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/info/online-appointment"
                  className="inline-flex items-center gap-2 rounded-md bg-[#f4b24f] px-5 py-3 text-sm font-black text-[#052b46] shadow-sm transition hover:bg-white"
                >
                  Online Appointment
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={`tel:${emergencyPhone}`}
                  className="inline-flex items-center gap-2 rounded-md border border-white/30 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white hover:text-[#052b46]"
                >
                  <PhoneCall className="h-4 w-4" />
                  Emergency Help
                </a>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-md border border-white/15 bg-white/10 p-4 shadow-sm backdrop-blur">
                <div className="flex items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-white text-[#0b5b89]">
                    <Clock3 className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="text-sm font-black">24x7 Emergency</p>
                    <p className="mt-1 text-sm font-semibold text-blue-50">
                      {emergencyPhone || 'Emergency desk available'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-md border border-white/15 bg-white/10 p-4 shadow-sm backdrop-blur">
                <div className="flex items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-white text-[#0b5b89]">
                    <CalendarCheck className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="text-sm font-black">Patient Help Desk</p>
                    <p className="mt-1 text-sm font-semibold text-blue-50">
                      {contactPhone || 'Appointment support available'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        {publicMetrics.length ? (
          <section className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {publicMetrics.map((metric) => (
              <article
                key={metric.key}
                className="rounded-md border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-cyan-50 text-[#0b5b89]">
                    <Icon name={metric.icon} className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="text-2xl font-black text-[#052b46]">{metric.value}</p>
                    <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
                      {metric.label}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </section>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0">
            <section className="mb-5 overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
              <div className="grid gap-4 p-5 md:grid-cols-[auto_1fr] md:items-start">
                <span className="flex h-14 w-14 items-center justify-center rounded-md bg-[#052b46] text-white">
                  <FileText className="h-7 w-7" />
                </span>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0b5b89]">
                    Overview
                  </p>
                  <h2 className="mt-1 text-2xl font-black text-[#052b46]">
                    {page.title}
                  </h2>
                  <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">
                    {page.description}
                  </p>
                </div>
              </div>
            </section>

            <ContentSections content={content} />

            {page.departments ? (
              <section className="mb-5">
                <SectionTitle
                  eyebrow="Hospitals & Departments"
                  title="Department Services"
                  subtitle="Live department data with available services and clinic information."
                  icon={Building2}
                />
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {(site.departments || []).map((department) => (
                    <article
                      key={department.id || department.name}
                      className="rounded-md border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-cyan-50 text-[#0b5b89]">
                          <Icon name={department.icon} className="h-6 w-6" />
                        </span>
                        <div>
                          <h3 className="font-black text-[#052b46]">{department.name}</h3>
                          <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                            {department.description}
                          </p>
                        </div>
                      </div>
                      {department.services?.length ? (
                        <ul className="mt-4 grid gap-2 border-t border-slate-200 pt-4">
                          {department.services.map((service) => (
                            <li
                              key={service}
                              className="flex gap-2 text-sm font-semibold text-slate-700"
                            >
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                              {service}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      {department.clinics?.length ? (
                        <p className="mt-4 rounded-md bg-[#f8fafc] px-3 py-2 text-xs font-black uppercase tracking-[0.08em] text-[#0b5b89]">
                          Clinic: {department.clinics.join(', ')}
                        </p>
                      ) : null}
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

            {page.doctors ? (
              <section className="mb-5">
                <SectionTitle
                  eyebrow="Doctor Directory"
                  title="Available Specialists"
                  subtitle="Doctor details, department, experience and consultation timing."
                  icon={Stethoscope}
                />
                <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
                  <div className="overflow-auto">
                    <table className="w-full min-w-[820px] text-left text-sm">
                      <thead className="bg-[#052b46] text-white">
                        <tr>
                          <th className="px-5 py-3">Doctor</th>
                          <th className="px-5 py-3">Department</th>
                          <th className="px-5 py-3">Experience</th>
                          <th className="px-5 py-3">Availability</th>
                          <th className="px-5 py-3">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {(site.doctors || []).map((doctor) => (
                          <tr key={doctor.id || doctor.name} className="hover:bg-cyan-50/50">
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-cyan-50 text-sm font-black text-[#0b5b89]">
                                  {doctor.initials || doctor.name?.slice(0, 2)}
                                </span>
                                <div>
                                  <p className="font-black text-[#052b46]">{doctor.name}</p>
                                  <p className="text-xs font-bold text-slate-500">
                                    {doctor.clinic || 'Hospital OPD'}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-4 font-semibold text-slate-700">
                              {doctor.specialization}
                            </td>
                            <td className="px-5 py-4 font-semibold text-slate-700">
                              {doctor.experience}+ years
                            </td>
                            <td className="px-5 py-4 font-semibold text-slate-700">
                              {doctor.availableTime}
                            </td>
                            <td className="px-5 py-4">
                              <Link
                                to="/info/online-appointment"
                                className="inline-flex items-center gap-2 rounded-md bg-[#f4b24f] px-3 py-2 text-xs font-black text-[#052b46] hover:bg-[#ffd58b]"
                              >
                                Book
                                <ArrowRight className="h-3.5 w-3.5" />
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            ) : null}

            {page.appointment ? (
              <section className="mb-5 overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
                <div className="grid lg:grid-cols-[minmax(0,1fr)_280px]">
                  <form onSubmit={handleSubmit} className="p-5">
                    <SectionTitle
                      eyebrow="Appointment"
                      title="Submit Request"
                      subtitle="Fill patient details and the care desk will confirm availability."
                      icon={CalendarCheck}
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
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
                          {appointmentDepartments.map((department) => (
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
                      <label className="text-sm font-bold text-slate-700">
                        Time
                        <select
                          name="preferredTime"
                          value={form.preferredTime}
                          onChange={handleInputChange}
                          className={fieldClass}
                        >
                          {appointmentTimeSlots.map((slot) => (
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
                      className="mt-5 inline-flex items-center gap-2 rounded-md bg-[#0b5b89] px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#052b46] disabled:bg-slate-400"
                    >
                      {submitState.status === 'submitting' ? 'Submitting...' : 'Submit Request'}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    {submitState.message ? (
                      <p
                        className={`mt-3 rounded-md px-3 py-2 text-sm font-bold ${
                          submitState.status === 'success'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {submitState.message}
                      </p>
                    ) : null}
                  </form>

                  <div className="border-t border-slate-200 bg-[#f8fafc] p-5 lg:border-l lg:border-t-0">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0b5b89]">
                      Help Desk
                    </p>
                    <h3 className="mt-2 text-lg font-black text-[#052b46]">
                      Request Checklist
                    </h3>
                    <ul className="mt-4 grid gap-3 text-sm font-semibold text-slate-700">
                      {['Correct mobile number', 'Preferred department', 'Old reports if available', 'Emergency cases call helpline'].map((item) => (
                        <li key={item} className="flex gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <a
                      href={`tel:${contactPhone}`}
                      className="mt-5 inline-flex items-center gap-2 rounded-md bg-[#052b46] px-4 py-3 text-sm font-black text-white"
                    >
                      <PhoneCall className="h-4 w-4" />
                      Call Desk
                    </a>
                  </div>
                </div>
              </section>
            ) : null}

            {page.contact ? (
              <section className="mb-5">
                <SectionTitle
                  eyebrow="Contact"
                  title="Hospital Contact Points"
                  subtitle="Reach the right desk for enquiry, appointment, emergency and visitor support."
                  icon={PhoneCall}
                />
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <InfoCard title="Phone" icon={PhoneCall}>
                    {contactPhone}
                  </InfoCard>
                  <InfoCard title="Emergency" icon={HeartPulse}>
                    {emergencyPhone}
                  </InfoCard>
                  <InfoCard title="Email" icon={Mail}>
                    <span className="break-words">{site.contact?.email}</span>
                  </InfoCard>
                  <InfoCard title="Address" icon={MapPin}>
                    {site.contact?.address}
                  </InfoCard>
                </div>
              </section>
            ) : null}

            {page.facilities ? (
              <section className="mb-5">
                <SectionTitle
                  eyebrow="Facilities"
                  title="Patient Facilities"
                  subtitle="Facilities available for care, diagnostics, recovery and billing support."
                  icon={ShieldCheck}
                />
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {(site.facilities || []).map((facility) => (
                    <InfoCard key={facility.title} title={facility.title} icon={CheckCircle2}>
                      {facility.description}
                    </InfoCard>
                  ))}
                </div>
              </section>
            ) : null}

            {!content && !page.departments && !page.doctors && !page.appointment && !page.contact && !page.facilities ? (
              <section className="mb-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <InfoCard title="Overview" icon={Home}>
                  {page.description}
                </InfoCard>
                <InfoCard title="Public Information" icon={ClipboardCheck}>
                  This section is available as a separate portal page for visitors.
                </InfoCard>
                <InfoCard title="Hospital Help Desk" icon={PhoneCall}>
                  For assistance, call {contactPhone}.
                </InfoCard>
              </section>
            ) : null}
          </div>

          <aside className="grid content-start gap-4">
            <section className="rounded-md border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 bg-[#f8fafc] px-4 py-3">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#0b5b89]">
                  Related Pages
                </p>
                <h2 className="mt-1 text-base font-black text-[#052b46]">
                  Quick Navigation
                </h2>
              </div>
              <div className="grid gap-2 p-4">
                {relatedLinks.map((item) => (
                  <Link
                    key={item.slug}
                    to={`/info/${item.slug}`}
                    className="flex items-center justify-between rounded-md bg-[#f2f6fa] px-3 py-3 text-sm font-black text-[#052b46] transition hover:bg-cyan-50 hover:text-[#0b5b89]"
                  >
                    {item.title}
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                ))}
              </div>
            </section>

            <section className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-red-50 text-red-600">
                  <PhoneCall className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-red-600">
                    Emergency
                  </p>
                  <h2 className="mt-1 text-lg font-black text-[#052b46]">
                    {emergencyPhone || '24x7 Helpline'}
                  </h2>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                    For urgent care, call before arrival or report directly at the emergency entry.
                  </p>
                  <a
                    href={`tel:${emergencyPhone}`}
                    className="mt-4 inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-black text-white"
                  >
                    Call Now
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </section>

            <section className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-amber-50 text-[#b26b00]">
                  <Bell className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#0b5b89]">
                    Portal Status
                  </p>
                  <h2 className="mt-1 text-lg font-black text-[#052b46]">
                    Public Information Updated
                  </h2>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                    This page is connected with live hospital content where available and fallback public data for visitors.
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </div>

        {isLoading ? (
          <div className="fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 rounded-md bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-lg ring-1 ring-slate-200">
            <Loader2 className="h-4 w-4 animate-spin text-[#0b5b89]" />
            Loading live data
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default PortalPage;
