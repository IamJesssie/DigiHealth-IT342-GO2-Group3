import React from 'react';
import './ProfileSettings.css';
import { Link, useLocation } from 'react-router-dom';
import SecuritySettings from './SecuritySettings';
import Notifications from './Notifications';
import Schedule from './Schedule';
import { useAuth } from '../auth/auth';

const ProfileSettings = () => {
  const location = useLocation();
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (!currentUser) {
    return <div>Could not load user profile. Please try logging in again.</div>;
  }

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

      {location.pathname === '/profile-settings' && (
        <div className="profile-content-card">
          <div className="profile-banner"></div>

          <div className="profile-header-content">
            <div className="profile-pic-wrapper">
              <img src="/assets/profile-pic.svg" alt="Profile" className="profile-pic" />
              <div className="camera-icon-wrapper">
                <img src="/assets/camera-icon.svg" alt="Camera" />
              </div>
            </div>
            <div className="doctor-info">
              <p className="doctor-name">{currentUser.fullName}</p>
              <p className="doctor-specialty">{currentUser.specialization || 'N/A'} • Internal Medicine</p>
              <div className="doctor-contact-info">
                <div className="contact-badge">
                  <img src="/assets/email-icon.svg" alt="Email" />
                  <p>{currentUser.email}</p>
                </div>
                <div className="contact-badge">
                  <img src="/assets/phone-icon.svg" alt="Phone" />
                  <p>{currentUser.phoneNumber || 'N/A'}</p>
                </div>
                <div className="contact-badge">
                  <img src="/assets/license-icon.svg" alt="License" />
                  <p>{currentUser.licenseNumber || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="personal-info-card">
            <div className="card-header">
              <img src="/assets/personal-info-icon.svg" alt="Personal Info" />
              <p className="card-title">Personal Information</p>
              <p className="card-description">Update your personal details and contact information</p>
            </div>
            <div className="card-content">
              <div className="input-group">
                <label>Full Name<span className="required">*</span></label>
                <input type="text" value={currentUser.fullName} readOnly />
              </div>
              <div className="input-group">
                <label>Email Address<span className="required">*</span></label>
                <input type="email" value={currentUser.email} readOnly />
              </div>
              <div className="input-group">
                <label>Phone Number</label>
                <input type="text" value={currentUser.phoneNumber || ''} readOnly />
              </div>
              <div className="input-group">
                <label>Role</label>
                <input type="text" value={currentUser.role} readOnly className="disabled-input" />
              </div>
            </div>
          </div>

          <div className="professional-info-card">
            <div className="card-header">
              <img src="/assets/professional-info-icon.svg" alt="Professional Info" />
              <p className="card-title">Professional Information</p>
              <p className="card-description">Your medical credentials and specialization</p>
            </div>
            <div className="card-content">
              <div className="input-group">
                <label>Department</label>
                <input type="text" value="Internal Medicine" readOnly />
              </div>
              <div className="input-group">
                <label>Specialization</label>
                <input type="text" value={currentUser.specialization || ''} readOnly />
              </div>
              <div className="input-group">
                <label>Medical License Number</label>
                <input type="text" value={currentUser.licenseNumber || ''} readOnly />
              </div>
              <div className="input-group">
                <label>Years of Experience</label>
                <input type="text" value="12" readOnly />
              </div>
              <div className="input-group full-width">
                <label>Professional Bio</label>
                <textarea readOnly>Brief description of your professional background...</textarea>
                <p className="char-count">114 / 500 characters</p>
              </div>
              <div className="save-changes-section">
                <button className="save-changes-btn">
                  <img src="/assets/save-changes-icon.svg" alt="Save Changes" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {location.pathname === '/profile-settings/security' && (
        <SecuritySettings />
      )}

      {location.pathname === '/profile-settings/notifications' && (
        <Notifications />
      )}

      {location.pathname === '/profile-settings/schedule' && (
        <Schedule />
      )}
    </div>
  );
};

export default ProfileSettings;
