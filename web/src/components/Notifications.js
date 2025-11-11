import React from 'react';
import './Notifications.css';
import './ProfileSettings.css';
import { Link, useLocation } from 'react-router-dom';

const Notifications = () => {
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

      <div className="card notification-settings-card">
        <div className="card-header">
          <img src="/assets/notification-icon.svg" alt="Notification Preferences" />
          <p className="card-title">Notification Preferences</p>
          <p className="card-description">Choose how you want to receive notifications and alerts</p>
        </div>
        <div className="card-content">
          <div className="notification-item">
            <div className="notification-item-icon-wrapper">
              <img src="/assets/email-icon.svg" alt="Email Notifications" />
            </div>
            <div className="notification-item-text">
              <p className="notification-item-title">Email Notifications</p>
              <p className="notification-item-subtitle">Receive important updates via email</p>
            </div>
            <div className="toggle-switch active">
              <div className="toggle-handle"></div>
            </div>
          </div>
          <hr />
          <div className="notification-item">
            <div className="notification-item-icon-wrapper">
              <img src="/assets/appointments-nav-icon.svg" alt="Appointment Reminders" />
            </div>
            <div className="notification-item-text">
              <p className="notification-item-title">Appointment Reminders</p>
              <p className="notification-item-subtitle">Get notified about upcoming appointments</p>
            </div>
            <div className="toggle-switch active">
              <div className="toggle-handle"></div>
            </div>
          </div>
          <hr />
          <div className="notification-item">
            <div className="notification-item-icon-wrapper">
              <img src="/assets/patients-nav-icon.svg" alt="Patient Updates" />
            </div>
            <div className="notification-item-text">
              <p className="notification-item-title">Patient Updates</p>
              <p className="notification-item-subtitle">Notifications about patient record changes</p>
            </div>
            <div className="toggle-switch active">
              <div className="toggle-handle"></div>
            </div>
          </div>
          <hr />
          <div className="notification-item">
            <div className="notification-item-icon-wrapper">
              <img src="/assets/security-tab-icon.svg" alt="System Alerts" />
            </div>
            <div className="notification-item-text">
              <p className="notification-item-title">System Alerts</p>
              <p className="notification-item-subtitle">Important system and security notifications</p>
            </div>
            <div className="toggle-switch active">
              <div className="toggle-handle"></div>
            </div>
          </div>
          <hr />
          <div className="notification-item">
            <div className="notification-item-icon-wrapper">
              <img src="/assets/dashboard-icon.svg" alt="Weekly Reports" />
            </div>
            <div className="notification-item-text">
              <p className="notification-item-title">Weekly Reports</p>
              <p className="notification-item-subtitle">Receive weekly summary of clinic activities</p>
            </div>
            <div className="toggle-switch">
              <div className="toggle-handle"></div>
            </div>
          </div>
          <div className="save-preferences-section">
            <button className="save-preferences-btn">
              <img src="/assets/save-icon.svg" alt="Save Preferences" />
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
