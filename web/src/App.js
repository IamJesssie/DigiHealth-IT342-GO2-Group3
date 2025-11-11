import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import SecuritySettings from './components/SecuritySettings';
import ProfileSettings from './components/ProfileSettings';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './components/Dashboard';
import Patients from './components/Patients';
import Appointments from './components/Appointments';
import Notifications from './components/Notifications';
import Schedule from './components/Schedule';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/profile-settings/security" element={<SecuritySettings />} />
          <Route path="/profile-settings/notifications" element={<Notifications />} />
          <Route path="/profile-settings/schedule" element={<Schedule />} />
          <Route path="/profile-settings" element={<ProfileSettings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
