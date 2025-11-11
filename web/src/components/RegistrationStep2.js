import React from 'react';
import './RegisterScreen.css';

const RegistrationStep2 = ({ onNext, onBack, formData, setFormData }) => {
  return (
    <div className="form-card">
      <p className="form-title">Professional Information</p>
      <p className="form-subtitle">Tell us about your practice</p>
      <div className="form-inputs">
        <label>Specialization *</label>
        <select value={formData.specialization || ''} onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}>
          <option value="" disabled>Select your specialization</option>
          <option value="General Practitioner">General Practitioner</option>
          <option value="Cardiology">Cardiology</option>
          <option value="Dermatology">Dermatology</option>
          <option value="Pediatrics">Pediatrics</option>
          <option value="Neurology">Neurology</option>
          
        </select>
        <label>Medical License Number *</label>
        <input type="text" placeholder="MD-12345" value={formData.licenseNumber || ''} onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })} />
        <label>Phone Number *</label>
        <input type="text" placeholder="+63" value={formData.phoneNumber || ''} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} />
      </div>
      <div className="button-container">
        <button type="button" className="back-btn" onClick={onBack}>Back</button>
        <button type="button" className="next-btn" onClick={onNext}>Next</button>
      </div>
    </div>
  );
};

export default RegistrationStep2;
