import React from 'react';
import './RegisterScreen.css';

const RegistrationStep3 = ({ onBack, onSubmit, formData, setFormData, isComplete, isSubmitting }) => {

  const handleDayToggle = (day) => {
    const currentDays = formData.workDays || [];
    if (currentDays.includes(day)) {
      setFormData({ ...formData, workDays: currentDays.filter(d => d !== day) });
    } else {
      setFormData({ ...formData, workDays: [...currentDays, day] });
    }
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
        <button type="button" className="next-btn" onClick={onSubmit} disabled={!isComplete || isSubmitting}>
          {isSubmitting ? 'Registering...' : 'Complete Registration'}
        </button>
      </div>
    </div>
  );
};

export default RegistrationStep3;
