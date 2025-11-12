import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ProfileDropdown.css';
import { clearToken } from '../auth/auth';

const ProfileDropdown = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear JWT from storage
    clearToken();
    // Hard redirect to ensure all state is reset and protected routes re-evaluate
    navigate('/login', { replace: true });
  };

  return (
    <div className="profile-dropdown">
      <div className="dropdown-section">
        <strong>My Account</strong>
      </div>
      <div className="dropdown-divider"></div>
      <div className="dropdown-section">
        <Link to="/profile-settings" className="dropdown-item">
          Profile Settings
        </Link>
        <Link to="/preferences" className="dropdown-item">Preferences</Link>
      </div>
      <div className="dropdown-divider"></div>
      <div className="dropdown-section">
        <button className="dropdown-item logout-btn" onClick={handleLogout}>
          <img src="/assets/logout.svg" alt="Logout" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;
