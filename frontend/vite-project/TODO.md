# Hospital Frontend Implementation Plan

## Progress Tracking

### 1. Setup Dependencies & Config [x]
- Install TailwindCSS, PostCSS, Autoprefixer
- Init Tailwind config
- Install lucide-react, react-router-dom, axios, @tanstack/react-query
- Update tailwind.config.js
- Add Tailwind directives to src/index.css

### 2. Core Context & Hooks [x]
- Create src/context/AuthContext.jsx
- Create src/hooks/useAuth.js
- Create src/hooks/useApi.js

### 3. Reusable Components [x]
- Button.jsx, Input.jsx, Card.jsx, Table.jsx, Modal.jsx, Sidebar.jsx

### 4. Pages [x]
- Login.jsx, Register.jsx, Dashboard.jsx
- Patients.jsx, Doctors.jsx, Appointments.jsx, Payments.jsx

### 5. App Structure [x]
- Update App.jsx: Router, AuthProvider, Layout
- Update main.jsx: Providers

### 6. API Integration & Testing [ ]
- Connect hooks to backend APIs
- Responsive design check
- `npm run dev` and test flows

**Backend API base: http://localhost:5000**

Updated when step complete.
