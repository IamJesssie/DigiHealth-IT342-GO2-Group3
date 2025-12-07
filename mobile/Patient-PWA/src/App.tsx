import { useEffect, useState } from 'react';
import { Toaster } from 'sonner';
import { LoadingScreen } from './components/LoadingScreen';
import { PatientLogin } from './components/PatientLogin';
import { PatientRegistration } from './components/PatientRegistration';
import { PatientDashboard } from './components/PatientDashboard';
import { PatientAppointments } from './components/PatientAppointments';
import { PatientMedicalRecords } from './components/PatientMedicalRecords';
import { PatientDoctorSearch } from './components/PatientDoctorSearch';
import { PatientProfile } from './components/PatientProfile';
import { PatientBookAppointment } from './components/PatientBookAppointment';
import { Button } from './components/ui/button';

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
  const [installPromptEvent, setInstallPromptEvent] = useState<any>(null);
  const [showInstallCTA, setShowInstallCTA] = useState(false);

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

  useEffect(() => {
    const handleBip = (e: any) => {
      e.preventDefault();
      setInstallPromptEvent(e);
      setShowInstallCTA(true);
    };
    const handleInstalled = () => {
      setShowInstallCTA(false);
      setInstallPromptEvent(null);
    };
    window.addEventListener('beforeinstallprompt', handleBip);
    window.addEventListener('appinstalled', handleInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBip);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  // Show loading screen first
  if (isLoading) {
    return <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />;
  }

  return (
    <div className="min-h-screen">
      {renderScreen()}
      <Toaster position="top-right" richColors />
      {showInstallCTA && (
        <div style={{ position: 'fixed', right: 16, bottom: 16, zIndex: 50 }}>
          <Button
            onClick={async () => {
              try {
                if (!installPromptEvent) return;
                await installPromptEvent.prompt();
                const choice = await installPromptEvent.userChoice;
                if (choice && choice.outcome !== 'accepted') {
                  setShowInstallCTA(false);
                }
              } catch {}
            }}
            style={{
              background: 'linear-gradient(135deg, #0093E9 0%, #80D0C7 100%)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
            }}
          >
            Install DigiHealth
          </Button>
        </div>
      )}
    </div>
  );
}

export default App;
