import React from 'react';
import './RegisterScreen.css';

const RegistrationStep1 = ({ onNext, onNavigateToLogin, formData, setFormData }) => {
  return (
    <div className="form-card">
      <p className="form-title">Basic Information</p>
      <p className="form-subtitle">Create your doctor account</p>
      <button type="button" className="google-btn">
        <img alt="Google Icon" src="/assets/doctorlogin.svg" />
        Continue with Google
      </button>
      <div className="divider-container">
        <div className="divider-line" />
        <p className="divider-text">Or register with email</p>
        <div className="divider-line" />
      </div>
      <div className="form-inputs">
        <label>Full Name *</label>
        <input type="text" placeholder="Dr. John Doe" value={formData.fullName || ''} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
        <label>Email Address *</label>
        <input type="email" placeholder="doctor@example.com" value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
        <label>Password *</label>
        <input type="password" placeholder="Minimum 8 characters" value={formData.password || ''} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
        <label>Confirm Password *</label>
        <input type="password" placeholder="Re-enter password" value={formData.confirmPassword || ''} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} />
      </div>
      <div className="button-container">
        <button type="button" className="back-btn" onClick={onNavigateToLogin}>Back to Login</button>
        <button type="button" className="next-btn" onClick={onNext}>Next</button>
      </div>
    </div>
  );
};

export default RegistrationStep1;
