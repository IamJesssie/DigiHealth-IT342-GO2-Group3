import { useState } from 'react';
import { Toaster } from 'sonner@2.0.3';
import { LoadingScreen } from './components/LoadingScreen';
import { PatientLogin } from './components/PatientLogin';
import { PatientRegistration } from './components/PatientRegistration';
import { PatientDashboard } from './components/PatientDashboard';
import { PatientAppointments } from './components/PatientAppointments';
import { PatientMedicalRecords } from './components/PatientMedicalRecords';
import { PatientDoctorSearch } from './components/PatientDoctorSearch';
import { PatientProfile } from './components/PatientProfile';
import { PatientBookAppointment } from './components/PatientBookAppointment';

export type Screen = 'login' | 'register' | 'dashboard' | 'appointments' | 'patient-records' | 'search' | 'patient-profile' | 'book-appointment' | 'doctor-profile';

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  emergencyContact: string;
  medicalHistory: string;
  profilePicture?: string;
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);

  const handlePatientLogin = (patient: any) => {
    setIsLoggedIn(true);
    setCurrentUser(patient);
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setSelectedDoctor(null);
    setCurrentScreen('login');
  };

  const handleRegister = () => {
    setCurrentScreen('register');
  };

  const handleBackToLogin = () => {
    setCurrentScreen('login');
  };

  const navigateToScreen = (screen: Screen, data?: any) => {
    // Handle doctor selection for booking
    if (screen === 'doctor-profile' && data) {
      setSelectedDoctor(data);
    } else if (screen === 'book-appointment' && data) {
      setSelectedDoctor(data);
    } else if (screen === 'dashboard') {
      // Reset navigation state
      setSelectedDoctor(null);
    }
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    // Patient is logged in - show patient portal
    if (isLoggedIn) {
      switch (currentScreen) {
        case 'dashboard':
          return <PatientDashboard patient={currentUser} onNavigate={navigateToScreen} onLogout={handleLogout} />;
        case 'appointments':
          return <PatientAppointments patient={currentUser} onNavigate={navigateToScreen} onLogout={handleLogout} />;
        case 'patient-records':
          return <PatientMedicalRecords patient={currentUser} onNavigate={navigateToScreen} onLogout={handleLogout} />;
        case 'search':
          return <PatientDoctorSearch patient={currentUser} onNavigate={navigateToScreen} onLogout={handleLogout} />;
        case 'patient-profile':
          return <PatientProfile patient={currentUser} onNavigate={navigateToScreen} onLogout={handleLogout} />;
        case 'book-appointment':
          return (
            <PatientBookAppointment
              doctor={selectedDoctor}
              patient={currentUser}
              onBack={() => navigateToScreen(selectedDoctor ? 'search' : 'dashboard')}
              onComplete={() => navigateToScreen('appointments')}
            />
          );
        default:
          return <PatientDashboard patient={currentUser} onNavigate={navigateToScreen} onLogout={handleLogout} />;
      }
    }

    // Login/registration flow
    if (currentScreen === 'register') {
      return <PatientRegistration onBackToLogin={handleBackToLogin} onRegister={handlePatientLogin} />;
    }
    
    return <PatientLogin onLogin={handlePatientLogin} onRegister={handleRegister} />;
  };

  // Show loading screen first
  if (isLoading) {
    return <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />;
  }

  return (
    <div className="min-h-screen">
      {renderScreen()}
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;
