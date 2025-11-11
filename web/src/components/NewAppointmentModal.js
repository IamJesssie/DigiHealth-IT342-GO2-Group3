import React from 'react';
import './NewAppointmentModal.css';

const NewAppointmentModal = ({ show, onClose }) => {
  if (!show) {
    return null;
  }

  // Function to stop click propagation
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={handleModalContentClick}>
        <div className="modal-header">
          <h2>New Appointment</h2>
          <p>Schedule a new appointment for a patient</p>
        </div>
        <form className="appointment-form">
          <div className="form-group">
            <label>Patient *</label>
            <select><option>Select a patient</option></select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Date *</label>
              <input type="date" />
            </div>
            <div className="form-group">
              <label>Time *</label>
              <input type="time" />
            </div>
          </div>
          <div className="form-group">
            <label>Appointment Type *</label>
            <select><option>Select type</option></select>
          </div>
          <div className="form-group">
            <label>Doctor *</label>
            <select><option>Select doctor</option></select>
          </div>
          <div className="form-group">
            <label>Status *</label>
            <select><option>Pending</option></select>
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea placeholder="Add any additional notes or instructions..."></textarea>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              <img src="/assets/cancel-icon.svg" alt="Cancel" />
              Cancel
            </button>
            <button type="submit" className="btn-create">
              <img src="/assets/saveicon.svg" alt="Create" />
              Create Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewAppointmentModal;
