const siteFallback = {
  brand: {
    name: 'Aarogya Care Hospital',
    shortName: 'AarogyaCare',
    tagline: 'Advanced multispeciality care for every family',
    accreditation: 'NABH-aligned clinical protocols',
  },
  topbar: {
    emergencyLabel: 'Emergency',
    emergencyPhone: '+91 98765 43210',
    appointmentPhone: '+91 98765 43111',
    location: 'Sector 21, New Delhi',
  },
  nav: [
    { label: 'Specialities', href: '#departments' },
    { label: 'Doctors', href: '#doctors' },
    { label: 'Facilities', href: '#facilities' },
    { label: 'Contact', href: '#contact' },
  ],
  hero: {
    eyebrow: 'Trusted hospital care, day and night',
    title: 'Aarogya Care Hospital',
    subtitle:
      'A modern multispeciality hospital with senior doctors, smart diagnostics, critical care, and a patient-first appointment experience.',
    imageUrl: '/hospital-hero.png',
    primaryAction: { label: 'Book Appointment', href: '#appointment' },
    secondaryAction: { label: 'Call Emergency', href: 'tel:+919876543210' },
    highlights: [
      { value: '24x7', label: 'Emergency' },
      { value: '15 min', label: 'Triage target' },
      { value: '250+', label: 'Smart beds' },
    ],
  },
  metrics: [
    {
      key: 'emergency',
      value: '24x7',
      label: 'Emergency and trauma',
      icon: 'Ambulance',
    },
    {
      key: 'specialists',
      value: '40+',
      label: 'Senior specialists',
      icon: 'Stethoscope',
    },
    {
      key: 'departments',
      value: '18+',
      label: 'Clinical departments',
      icon: 'Building2',
    },
    {
      key: 'patients',
      value: '1.2L+',
      label: 'Patients cared for',
      icon: 'UsersRound',
    },
  ],
  services: [
    {
      title: 'Emergency & Trauma',
      icon: 'Ambulance',
      description:
        'Fast triage, resuscitation bays, ICU-ready transfers, and round-the-clock emergency physicians.',
      details: ['Rapid assessment', 'Critical care team', 'Ambulance support'],
    },
    {
      title: 'Advanced Diagnostics',
      icon: 'ScanLine',
      description:
        'Integrated lab, radiology, imaging, and preventive screening workflows for quicker decisions.',
      details: ['Pathology lab', 'Digital imaging', 'Health checkups'],
    },
    {
      title: 'Critical Care',
      icon: 'HeartPulse',
      description:
        'Dedicated ICU, HDU, ventilator support, infection control, and continuous monitoring.',
      details: ['ICU and HDU', 'Ventilator support', 'Nursing excellence'],
    },
    {
      title: 'Family Care',
      icon: 'Baby',
      description:
        'Compassionate care for mothers, children, elders, and chronic disease follow-ups.',
      details: ['Maternity care', 'Pediatrics', 'Senior care'],
    },
  ],
  departments: [
    {
      id: 'cardiology',
      name: 'Cardiology',
      icon: 'HeartPulse',
      description:
        'Heart consultation, ECG, echo, preventive cardiac care, and post-procedure follow-ups.',
      services: ['ECG and echo', 'Chest pain clinic', 'Cardiac rehab'],
      clinics: ['Aarogya Main Wing'],
    },
    {
      id: 'neurology',
      name: 'Neurology',
      icon: 'Brain',
      description:
        'Stroke readiness, seizure care, headache clinic, and neurological diagnostics.',
      services: ['Stroke care', 'EEG support', 'Neuro consultation'],
      clinics: ['Neuro Sciences Center'],
    },
    {
      id: 'orthopedics',
      name: 'Orthopedics',
      icon: 'Bone',
      description:
        'Joint pain, trauma, sports injury, spine evaluation, and physiotherapy planning.',
      services: ['Fracture care', 'Joint clinic', 'Sports injury'],
      clinics: ['Aarogya Main Wing'],
    },
    {
      id: 'pediatrics',
      name: 'Pediatrics',
      icon: 'Baby',
      description:
        'Child health, vaccination, growth tracking, fever clinic, and family counseling.',
      services: ['Vaccination', 'Newborn care', 'Growth tracking'],
      clinics: ['Mother & Child Care'],
    },
  ],
  doctors: [
    {
      id: 'dr-meera-rao',
      name: 'Dr. Meera Rao',
      initials: 'DM',
      specialization: 'Cardiology',
      experience: 14,
      fees: 900,
      availableTime: '09:00 AM - 02:00 PM',
      availableDays: ['Monday', 'Wednesday', 'Friday'],
      clinic: 'Aarogya Main Wing',
      phone: '+91 98765 43111',
    },
    {
      id: 'dr-aman-kapoor',
      name: 'Dr. Aman Kapoor',
      initials: 'DA',
      specialization: 'Neurology',
      experience: 11,
      fees: 1100,
      availableTime: '11:00 AM - 05:00 PM',
      availableDays: ['Tuesday', 'Thursday', 'Saturday'],
      clinic: 'Neuro Sciences Center',
      phone: '+91 98765 43111',
    },
    {
      id: 'dr-nisha-iyer',
      name: 'Dr. Nisha Iyer',
      initials: 'DN',
      specialization: 'Pediatrics',
      experience: 9,
      fees: 700,
      availableTime: '10:00 AM - 04:00 PM',
      availableDays: ['Monday', 'Tuesday', 'Friday'],
      clinic: 'Mother & Child Care',
      phone: '+91 98765 43111',
    },
  ],
  facilities: [
    {
      title: 'Modular operation theatres',
      icon: 'ShieldCheck',
      description:
        'Sterile OT suites with planned workflows for complex and routine surgeries.',
    },
    {
      title: 'Digital patient records',
      icon: 'ClipboardCheck',
      description:
        'Connected records help doctors see history, prescriptions, and follow-ups faster.',
    },
    {
      title: 'Cashless insurance desk',
      icon: 'BadgeIndianRupee',
      description:
        'Insurance support, estimate guidance, and payment coordination in one place.',
    },
    {
      title: 'Comfort recovery rooms',
      icon: 'BedDouble',
      description:
        'Clean rooms, nursing rounds, visitor coordination, and discharge assistance.',
    },
  ],
  carePath: [
    {
      title: 'Choose a speciality',
      description: 'Find the right department and doctor for your concern.',
      icon: 'SearchCheck',
    },
    {
      title: 'Confirm appointment',
      description: 'Share basic details and preferred time with the care desk.',
      icon: 'CalendarCheck',
    },
    {
      title: 'Visit with confidence',
      description:
        'Get consultation, diagnostics, prescriptions, and follow-up guidance.',
      icon: 'CheckCircle2',
    },
  ],
  testimonials: [
    {
      name: 'Priya Mehra',
      role: 'Cardiology patient',
      quote:
        'The emergency team moved quickly and kept our family informed at every step.',
      rating: 5,
    },
    {
      name: 'Rohit Sharma',
      role: 'Orthopedics patient',
      quote:
        'Appointment, tests, consultation, and discharge all felt coordinated and calm.',
      rating: 5,
    },
    {
      name: 'Anita Verma',
      role: 'Mother and child care',
      quote:
        'The doctors explained everything clearly and the nursing staff was very supportive.',
      rating: 5,
    },
  ],
  insurance: [
    'Cashless TPA support',
    'UPI, card, cash, and wallet payments',
    'Corporate health packages',
    'Preventive health plans',
  ],
  branches: [
    {
      id: 'main-wing',
      name: 'Aarogya Main Wing',
      address: 'Aarogya Care Hospital, Sector 21, New Delhi, India',
      phone: '+91 98765 43111',
      email: 'care@aarogyacare.example',
      departments: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics'],
    },
  ],
  contact: {
    phone: '+91 98765 43111',
    emergencyPhone: '+91 98765 43210',
    email: 'care@aarogyacare.example',
    address: 'Aarogya Care Hospital, Sector 21, New Delhi, India',
    hours: 'Open 24x7',
  },
  appointment: {
    title: 'Request an appointment',
    subtitle:
      'Our care desk will call you back with doctor availability and visit instructions.',
    timeSlots: ['Morning', 'Afternoon', 'Evening'],
    departments: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics'],
    doctors: [
      {
        id: 'dr-meera-rao',
        name: 'Dr. Meera Rao',
        specialization: 'Cardiology',
      },
      {
        id: 'dr-aman-kapoor',
        name: 'Dr. Aman Kapoor',
        specialization: 'Neurology',
      },
    ],
  },
  footer: {
    description:
      'Aarogya Care Hospital combines specialist doctors, modern diagnostics, emergency response, and coordinated patient care.',
    links: ['Privacy', 'Insurance', 'Careers', 'Feedback'],
  },
};

export default siteFallback;
