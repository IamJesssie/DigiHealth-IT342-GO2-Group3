import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPortal.css';

const AdminPortal = () => {
  const navigate = useNavigate();

  const handleContinueAsAdmin = () => {
    navigate('/admin/login');
  };

  return (
    <div className="admin-portal-container">
      {/* Background gradient */}
      <div className="admin-portal-background"></div>

      {/* Logo at top */}
      <div className="admin-portal-logo">
        <svg viewBox="0 0 60 60" className="logo-icon">
          <path
            d="M30 5L45 15V35C45 48 30 55 30 55C30 55 15 48 15 35V15L30 5Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M30 25L24 31L28 37L36 29"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Main card */}
      <div className="admin-portal-card">
        {/* Shield icon */}
        <div className="admin-portal-icon">
          <svg viewBox="0 0 64 64" className="shield-icon">
            <path
              d="M32 8L12 18V32C12 46 32 56 32 56C32 56 52 46 52 32V18L32 8Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Title and description */}
        <div className="admin-portal-content">
          <h1 className="admin-portal-title">DigiHealth</h1>
          <p className="admin-portal-subtitle">Admin Portal</p>
          <p className="admin-portal-description">
            Access system administration panel to manage the platform
          </p>
        </div>

        {/* Continue button */}
        <button className="admin-continue-btn" onClick={handleContinueAsAdmin}>
          Continue as Admin
        </button>
      </div>

      {/* Footer */}
      <div className="admin-portal-footer">
        <p>DigiHealth Clinic Management System</p>
        <p>© 2025 DigiHealth. All rights reserved.</p>
      </div>
    </div>
  );
};

export default AdminPortal;
