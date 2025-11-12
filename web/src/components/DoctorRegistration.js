import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/auth';
import RegistrationStep1 from './RegistrationStep1';
import RegistrationStep2 from './RegistrationStep2';
import RegistrationStep3 from './RegistrationStep3';
import SuccessModal from './SuccessModal';
import './DoctorRegistration.css';

import { registerDoctor } from '../api/client';

const DoctorRegistration = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const isRegistrationComplete = () => {
    return (
      formData.fullName &&
      formData.email &&
      formData.password &&
      formData.specialization &&
      formData.licenseNumber &&
      formData.phoneNumber &&
      formData.workDays &&
      formData.workDays.length > 0
    );
  };

  const handleRegistrationSubmit = async () => {
    if (!isRegistrationComplete()) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }
    console.log('Submitting Registration Data:', formData);
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      await registerDoctor(formData);

      // On successful registration, use AuthContext login to properly set user state
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration or login failed:', error);

      const response = error.response;
      const status = response?.status;
      const backendMessage =
        response?.data?.message ||
        response?.data?.error ||
        (typeof response?.data === 'string' ? response.data : null);

      // Handle duplicate email with auto-login attempt
      if (status === 400 && backendMessage && backendMessage.toLowerCase().includes('email already exists')) {
        try {
          await login(formData.email, formData.password);
          navigate('/dashboard');
          return;
        } catch (loginError) {
          
          setErrorMsg('Account already exists. Please confirm your credentials or log in manually.');
          return;
        }
      }

      // Generic 400 - validation or bad request
      if (status === 400) {
        setErrorMsg(backendMessage || 'Invalid registration details. Please review and try again.');
        return;
      }

      // 401 - unauthorized / bad credentials
      if (status === 401) {
        setErrorMsg(backendMessage || 'Invalid email or password.');
        return;
      }

      // Other errors (500, network, etc.)
      setErrorMsg(backendMessage || 'Registration failed due to a server error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };


  const renderStep = () => {
    switch (step) {
      case 1:
        return <RegistrationStep1 onNext={nextStep} onNavigateToLogin={() => navigate('/login')} formData={formData} setFormData={setFormData} />;
      case 2:
        return <RegistrationStep2 onNext={nextStep} onBack={prevStep} formData={formData} setFormData={setFormData} />;
      case 3:
        return <RegistrationStep3 onBack={prevStep} onSubmit={handleRegistrationSubmit} formData={formData} setFormData={setFormData} isComplete={isRegistrationComplete()} isSubmitting={isSubmitting} />;
      default:
        return <div>Registration Complete!</div>;
    }
  };

  return (
    <div className="registration-container">
        <div className="header-container">
          <div className="logo-container">
            <img alt="DigiHealth Logo" className="logo-image" src="/assets/icon.svg" />
          </div>
          <p className="header-title">DigiHealth</p>
          <p className="header-subtitle">Doctor Registration</p>
        </div>
        {errorMsg && <div className="error-message">{errorMsg}</div>}
        {/* You can add the stepper component here */}
        {renderStep()}
        <div className="footer-container">
          <p>DigiHealth Clinic Management System</p>
          <p>© 2025 DigiHealth. All rights reserved.</p>
        </div>
    </div>
  );
};

export default DoctorRegistration;
