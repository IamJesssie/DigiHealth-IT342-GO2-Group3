import React from 'react';
import './SuccessModal.css';

const SuccessModal = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-icon-container">
             {/* Assuming you have an icon named 'mail-icon.svg' */}
            <img src="/assets/mail-icon.svg" alt="Success" />
          </div>
          <h2>Registration Submitted!</h2>
        </div>
        <div className="modal-body">
          <p>Your registration has been submitted successfully.</p>
          <p>Your account is pending approval from the system administrator. You will receive an email notification once your account has been reviewed.</p>
          <p>This typically takes 24-48 hours.</p>
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="modal-button">Back to Login</button>
        </div>
        <button onClick={onClose} className="close-button">X</button>
      </div>
    </div>
  );
};

export default SuccessModal;
