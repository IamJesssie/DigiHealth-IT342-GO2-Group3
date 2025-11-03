import React, { useState } from 'react';
import RegistrationStep1 from './RegistrationStep1';
import RegistrationStep2 from './RegistrationStep2';
import RegistrationStep3 from './RegistrationStep3';
import './RegisterScreen.css'; // Main CSS for the container

const DoctorRegistration = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const renderStep = () => {
    switch (step) {
      case 1:
        return <RegistrationStep1 onNext={nextStep} formData={formData} setFormData={setFormData} />;
      case 2:
        return <RegistrationStep2 onNext={nextStep} onBack={prevStep} formData={formData} setFormData={setFormData} />;
      case 3:
        return <RegistrationStep3 onBack={prevStep} formData={formData} setFormData={setFormData} />;
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
