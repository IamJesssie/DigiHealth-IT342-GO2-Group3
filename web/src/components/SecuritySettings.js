import React from 'react';
import './SecuritySettings.css';
import './ProfileSettings.css';
import { Link, useLocation } from 'react-router-dom';

const SecuritySettings = () => {
  const location = useLocation();

  return (
    <div className="profile-settings-container">
      <div className="profile-settings-header">
        <h2>Profile Settings</h2>
        <p>Manage your account settings and preferences</p>
        <div className="active-account-badge">
          <img src="/assets/active-account.svg" alt="Active Account" />
          <p>Active Account</p>
        </div>
      </div>

      <div className="profile-completion-card">
        <div className="profile-completion-info">
          <div className="profile-completion-icon-wrapper">
            <img src="/assets/profile-completion-icon.svg" alt="Profile Completion" />
          </div>
          <div className="profile-completion-text">
            <p className="profile-completion-title">Profile Completion</p>
            <p className="profile-completion-subtitle">Keep your profile updated for better security</p>
          </div>
        </div>
        <div className="profile-completion-percentage">
          <p className="percentage-value">100%</p>
          <p className="percentage-label">Complete</p>
        </div>
        <div className="profile-completion-progress"></div>
      </div>

      <div className="profile-tabs">
        <Link to="/profile-settings" className={`profile-tab ${location.pathname === '/profile-settings' ? 'active' : ''}`}>
          <img src="/assets/profile-tab-icon.svg" alt="Profile" />
          <p>Profile</p>
        </Link>
        <Link to="/profile-settings/security" className={`profile-tab ${location.pathname === '/profile-settings/security' ? 'active' : ''}`}>
          <img src="/assets/security-tab-icon.svg" alt="Security" />
          <p>Security</p>
        </Link>
        <Link to="/profile-settings/notifications" className={`profile-tab ${location.pathname === '/profile-settings/notifications' ? 'active' : ''}`}>
          <img src="/assets/notifications-tab-icon.svg" alt="Notifications" />
          <p>Notifications</p>
        </Link>
        <Link to="/profile-settings/schedule" className={`profile-tab ${location.pathname === '/profile-settings/schedule' ? 'active' : ''}`}>
          <img src="/assets/schedule-tab-icon.svg" alt="Schedule" />
          <p>Schedule</p>
        </Link>
      </div>

      <div className="card change-password-card">
        <div className="card-header">
          <img src="/assets/security-tab-icon.svg" alt="Change Password" />
          <p className="card-title">Change Password</p>
          <p className="card-description">Update your password to keep your account secure</p>
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
          <p className="card-title">Two-Factor Authentication</p>
          <p className="card-description">Add an extra layer of security to your account</p>
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
