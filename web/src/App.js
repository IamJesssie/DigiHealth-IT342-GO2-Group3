import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './auth/auth';
import './App.css';
import SecuritySettings from './components/SecuritySettings';
import ProfileSettings from './components/ProfileSettings';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './components/Dashboard';
import Patients from './components/Patients';
import Appointments from './components/Appointments';
import Notifications from './components/Notifications';
import Schedule from './components/Schedule';
import DigiHealthLoginScreen from './components/LoginScreen';
import DoctorRegistration from './components/DoctorRegistration';
import AdminPortal from './components/AdminPortal';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import AdminPatients from './components/AdminPatients';
import AdminAppointments from './components/AdminAppointments';
import AdminAnalytics from './components/AdminAnalytics';
import AdminDashboardSettings from './components/AdminDashboardSettings';

const AppRoutes = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading application...</div>;
  }

  return (
    <Routes>
      {/* Admin Routes - Always accessible */}
      <Route path="/admin" element={<AdminPortal />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/patients" element={<AdminPatients />} />
      <Route path="/admin/appointments" element={<AdminAppointments />} />
      <Route path="/admin/analytics" element={<AdminAnalytics />} />
      <Route path="/admin/settings" element={<AdminDashboardSettings />} />

      {/* Doctor Routes - Auth protected */}
      <Route path="/login" element={!isAuthenticated ? <DigiHealthLoginScreen /> : <Navigate to="/dashboard" replace />} />
      <Route path="/register" element={!isAuthenticated ? <DoctorRegistration /> : <Navigate to="/dashboard" replace />} />

      <Route path="/" element={isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" replace />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="patients" element={<Patients />} />
        <Route path="profile-settings/security" element={<SecuritySettings />} />
        <Route path="profile-settings/notifications" element={<Notifications />} />
        <Route path="profile-settings/schedule" element={<Schedule />} />
        <Route path="profile-settings" element={<ProfileSettings />} />
      </Route>

      <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
