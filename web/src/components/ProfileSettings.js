import React, { useState, useEffect } from 'react';
import './ProfileSettings.css';
import { Link, useLocation } from 'react-router-dom';
import SecuritySettings from './SecuritySettings';
import Notifications from './Notifications';
import Schedule from './Schedule';
import apiClient from '../api/client';

const ProfileSettings = () => {
  const location = useLocation();

  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    specialization: '',
    medicalLicenseNumber: '',
    yearsOfExperience: '',
    professionalBio: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get('/api/users/me');
        setProfile(res.data);
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await apiClient.put('/api/users/me', profile);
      setProfile(res.data);
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile');
    }
  };

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
        <>
          {loading && <div>Loading...</div>}
          {error && <div style={{ color: 'red' }}>{error}</div>}
          {success && <div style={{ color: 'green' }}>{success}</div>}
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
                <p className="doctor-name">
                  {profile.fullName
                    ? profile.fullName
                    : 'Doctor'}
                </p>
                <p className="doctor-specialty">
                  {profile.specialization || 'Specialization not set'}
                </p>
                <div className="doctor-contact-info">
                  <div className="contact-badge">
                    <img src="/assets/email-icon.svg" alt="Email" />
                    <p>{profile.email || 'Email not set'}</p>
                  </div>
                  <div className="contact-badge">
                    <img src="/assets/phone-icon.svg" alt="Phone" />
                    <p>{profile.phone || 'Phone not set'}</p>
                  </div>
                  <div className="contact-badge">
                    <img src="/assets/license-icon.svg" alt="License" />
                    <p>{profile.medicalLicenseNumber || 'License not set'}</p>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="personal-info-card">
                <div className="card-header">
                  <img src="/assets/personal-info-icon.svg" alt="Personal Info" />
                  <p className="card-title">Personal Information</p>
                  <p className="card-description">Update your personal details and contact information</p>
                </div>
                <div className="card-content">
                  <div className="input-group">
                    <label>Full Name<span className="required">*</span></label>
                    <input type="text" name="fullName" value={profile.fullName} onChange={handleChange} />
                  </div>
                  <div className="input-group">
                    <label>Email Address<span className="required">*</span></label>
                    <input type="email" name="email" value={profile.email} onChange={handleChange} />
                  </div>
                  <div className="input-group">
                    <label>Phone Number</label>
                    <input type="text" name="phone" value={profile.phone} onChange={handleChange} />
                  </div>
                  <div className="input-group">
                    <label>Role</label>
                    <input type="text" name="role" value={profile.role} onChange={handleChange} className="disabled-input" readOnly />
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
                    <input type="text" name="department" value={profile.department} onChange={handleChange} />
                  </div>
                  <div className="input-group">
                    <label>Specialization</label>
                    <input type="text" name="specialization" value={profile.specialization} onChange={handleChange} />
                  </div>
                  <div className="input-group">
                    <label>Medical License Number</label>
                    <input type="text" name="medicalLicenseNumber" value={profile.medicalLicenseNumber} onChange={handleChange} />
                  </div>
                  <div className="input-group">
                    <label>Years of Experience</label>
                    <input type="text" name="yearsOfExperience" value={profile.yearsOfExperience} onChange={handleChange} />
                  </div>
                  <div className="input-group full-width">
                    <label>Professional Bio</label>
                    <textarea name="professionalBio" value={profile.professionalBio} onChange={handleChange}></textarea>
                    <p className="char-count">{profile.professionalBio.length} / 500 characters</p>
                  </div>
                  <div className="save-changes-section">
                    <button type="submit" className="save-changes-btn">
                      <img src="/assets/save-changes-icon.svg" alt="Save Changes" />
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </>
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
