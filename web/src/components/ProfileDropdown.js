import React from 'react';
import { Link } from 'react-router-dom';
import './ProfileDropdown.css';

const ProfileDropdown = () => {
  return (
    <div className="profile-dropdown">
      <div className="dropdown-section">
        <strong>My Account</strong>
      </div>
      <div className="dropdown-divider"></div>
      <div className="dropdown-section">
        <Link to="/profile-settings" className="dropdown-item">Profile Settings</Link>
        <Link to="/preferences" className="dropdown-item">Preferences</Link>
      </div>
      <div className="dropdown-divider"></div>
      <div className="dropdown-section">
        <button className="dropdown-item logout-btn">
          <img src="/assets/logout.svg" alt="Logout" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;
