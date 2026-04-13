# Hospital Frontend TODO - Modern React/Vite UI

## Setup (User to run):
1. cd frontend/vite-project
2. npm i -D tailwindcss postcss autoprefixer
3. npx tailwindcss init -p
4. npm i lucide-react react-router-dom axios @tanstack/react-query
5. Update tailwind.config.js content: 
```
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {} },
  plugins: [],
}
```
6. Add to src/index.css:
```
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Development Steps (BLACKBOXAI):
1. [ ] Create src/context/AuthContext.jsx (login state, JWT token)
2. [ ] Create src/hooks/useAuth.js, useApi.js
3. [ ] Components: Button.jsx, Input.jsx, Card.jsx, Table.jsx, Modal.jsx, Sidebar.jsx, DashboardTabs.jsx
4. [ ] Pages: Login.jsx, Register.jsx, Dashboard.jsx, Patients.jsx, Doctors.jsx, Appointments.jsx, Payments.jsx
5. [ ] App.jsx: Router + AuthProvider + Layout (sidebar + main)
6. [ ] Responsive design (mobile-first)
7. [ ] Test API calls to localhost:5000

**Start dev server: cd frontend/vite-project && npm run dev**
