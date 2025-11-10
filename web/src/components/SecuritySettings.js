import React from 'react';
import './SecuritySettings.css';

const SecuritySettings = () => {
  return (
    <div className="security-settings-container">
      <div className="card change-password-card">
        <div className="card-header">
          <img src="/assets/security-tab-icon.svg" alt="Change Password" />
          <div className="card-header-text">
            <p className="card-title">Change Password</p>
            <p className="card-description">Update your password to keep your account secure</p>
          </div>
        </div>
        <div className="card-content">
          <div className="input-group">
            <label>Current Password</label>
            <input type="password" placeholder="Enter your current password" />
          </div>
          <hr />
          <div className="input-group">
            <label>New Password</label>
            <input type="password" placeholder="Enter your new password" />
          </div>
          <div className="input-group">
            <label>Confirm New Password</label>
            <input type="password" placeholder="Re-enter your new password" />
          </div>
          <div className="password-requirements-card">
            <img src="/assets/shield.svg" alt="Password Requirements" />
            <div className="password-requirements-content">
              <p className="password-requirements-title">Password Requirements:</p>
              <ul>
                <li>Minimum 8 characters long</li>
                <li>Contains uppercase and lowercase letters</li>
                <li>Includes at least one number</li>
                <li>Contains at least one special character</li>
              </ul>
            </div>
          </div>
          <div className="update-password-section">
            <button className="update-password-btn">
              <img src="/assets/save-changes-icon.svg" alt="Update Password" />
              Update Password
            </button>
          </div>
        </div>
      </div>

      <div className="card two-factor-auth-card">
        <div className="card-header">
          <img src="/assets/shield.svg" alt="Two-Factor Authentication" />
          <div className="card-header-text">
            <p className="card-title">Two-Factor Authentication</p>
            <p className="card-description">Add an extra layer of security to your account</p>
          </div>
        </div>
        <div className="card-content">
          <div className="two-factor-auth-toggle-card">
            <div className="two-factor-auth-icon-wrapper">
              <img src="/assets/security.svg" alt="Enable Two-Factor Authentication" />
            </div>
            <div className="two-factor-auth-text">
              <p className="two-factor-auth-title">Enable Two-Factor Authentication</p>
              <p className="two-factor-auth-subtitle">Secure your account with SMS or authenticator app verification</p>
            </div>
            <div className="toggle-switch">
              <div className="toggle-handle"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;