import React from 'react';
import './RegisterScreen.css';

const RegistrationStep3 = ({ onBack, formData, setFormData }) => {

  const handleDayToggle = (day) => {
    const currentDays = formData.workDays || [];
    if (currentDays.includes(day)) {
      setFormData({ ...formData, workDays: currentDays.filter(d => d !== day) });
    } else {
      setFormData({ ...formData, workDays: [...currentDays, day] });
    }
  };

  const handleSubmit = () => {
    console.log("Submitting Registration Data:", formData);
    // Here you would make the API call to the backend to register the doctor
  };

  return (
    <div className="form-card">
      <p className="form-title">Set Your Availability</p>
      <p className="form-subtitle">Define your working hours</p>
      <div className="availability-form">
        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
          <div key={day} className="day-row">
            <div className="day-label">
              <input 
                type="checkbox" 
                checked={formData.workDays?.includes(day) || false}
                onChange={() => handleDayToggle(day)}
              />
              <label>{day}</label>
            </div>
            {formData.workDays?.includes(day) ? (
              <div className="time-inputs">
                <input type="time" />
                <span>to</span>
                <input type="time" />
              </div>
            ) : (
              <div className="unavailable-text">Unavailable</div>
            )}
          </div>
        ))}
      </div>
      <div className="button-container">
        <button type="button" className="back-btn" onClick={onBack}>Back</button>
        <button type="button" className="next-btn" onClick={handleSubmit}>Complete Registration</button>
      </div>
    </div>
  );
};

export default RegistrationStep3;
