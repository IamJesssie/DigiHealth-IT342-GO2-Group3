import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { isAuthenticated } from './auth/auth';
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

const LoginWrapper = () => {
  const navigate = useNavigate();
  return (
    <DigiHealthLoginScreen
      onLoginSuccess={() => navigate('/dashboard')}
      onNavigateToRegister={() => navigate('/register')}
    />
  );
};

const RegisterWrapper = () => {
  const navigate = useNavigate();
  return (
    <DoctorRegistration
      onNavigateToLogin={() => navigate('/login')}
    />
  );
};

const requireAuthElement = (element) => {
  return isAuthenticated() ? element : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public auth routes */}
        <Route
          path="/login"
          element={
            isAuthenticated() ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginWrapper />
            )
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated() ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <RegisterWrapper />
            )
          }
        />

        {/* Protected application shell */}
        <Route
          path="/"
          element={
            isAuthenticated() ? (
              <DashboardLayout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={requireAuthElement(<Dashboard />)} />
          <Route path="appointments" element={requireAuthElement(<Appointments />)} />
          <Route path="patients" element={requireAuthElement(<Patients />)} />
          <Route
            path="profile-settings/security"
            element={requireAuthElement(<SecuritySettings />)}
          />
          <Route
            path="profile-settings/notifications"
            element={requireAuthElement(<Notifications />)}
          />
          <Route
            path="profile-settings/schedule"
            element={requireAuthElement(<Schedule />)}
          />
          <Route
            path="profile-settings"
            element={requireAuthElement(<ProfileSettings />)}
          />
        </Route>

        {/* Fallback */}
        <Route
          path="*"
          element={
            isAuthenticated() ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
export { App };
