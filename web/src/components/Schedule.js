import React from 'react';
import './Schedule.css';
import './ProfileSettings.css';
import { Link, useLocation } from 'react-router-dom';

const Schedule = () => {
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

      <div className="card schedule-management-card">
        <div className="card-header">
          <img src="/assets/schedule-tab-icon.svg" alt="Working Hours" />
          <p className="card-title">Working Hours</p>
          <p className="card-description">Set your availability for appointments throughout the week</p>
        </div>
        <div className="card-content">
          <div className="day-schedule">
            <div className="day-info">
              <div className="toggle-switch active">
                <div className="toggle-handle"></div>
              </div>
              <div className="day-icon-wrapper">
                <img src="/assets/calendar.svg" alt="Monday" />
              </div>
              <p className="day-name">monday</p>
            </div>
            <div className="time-inputs">
              <input type="text" />
              <p>to</p>
              <input type="text" />
            </div>
          </div>
          <hr />
          <div className="day-schedule">
            <div className="day-info">
              <div className="toggle-switch active">
                <div className="toggle-handle"></div>
              </div>
              <div className="day-icon-wrapper">
                <img src="/assets/calendar.svg" alt="Tuesday" />
              </div>
              <p className="day-name">tuesday</p>
            </div>
            <div className="time-inputs">
              <input type="text" />
              <p>to</p>
              <input type="text" />
            </div>
          </div>
          <hr />
          <div className="day-schedule">
            <div className="day-info">
              <div className="toggle-switch active">
                <div className="toggle-handle"></div>
              </div>
              <div className="day-icon-wrapper">
                <img src="/assets/calendar.svg" alt="Wednesday" />
              </div>
              <p className="day-name">wednesday</p>
            </div>
            <div className="time-inputs">
              <input type="text" />
              <p>to</p>
              <input type="text" />
            </div>
          </div>
          <hr />
          <div className="day-schedule">
            <div className="day-info">
              <div className="toggle-switch active">
                <div className="toggle-handle"></div>
              </div>
              <div className="day-icon-wrapper">
                <img src="/assets/calendar.svg" alt="Thursday" />
              </div>
              <p className="day-name">thursday</p>
            </div>
            <div className="time-inputs">
              <input type="text" />
              <p>to</p>
              <input type="text" />
            </div>
          </div>
          <hr />
          <div className="day-schedule">
            <div className="day-info">
              <div className="toggle-switch active">
                <div className="toggle-handle"></div>
              </div>
              <div className="day-icon-wrapper">
                <img src="/assets/calendar.svg" alt="Friday" />
              </div>
              <p className="day-name">friday</p>
            </div>
            <div className="time-inputs">
              <input type="text" />
              <p>to</p>
              <input type="text" />
            </div>
          </div>
          <hr />
          <div className="day-schedule">
            <div className="day-info">
              <div className="toggle-switch">
                <div className="toggle-handle"></div>
              </div>
              <div className="day-icon-wrapper">
                <img src="/assets/calendar.svg" alt="Saturday" />
              </div>
              <p className="day-name">saturday</p>
            </div>
            <div className="unavailable-badge">
              <p>Unavailable</p>
            </div>
          </div>
          <hr />
          <div className="day-schedule">
            <div className="day-info">
              <div className="toggle-switch">
                <div className="toggle-handle"></div>
              </div>
              <div className="day-icon-wrapper">
                <img src="/assets/calendar.svg" alt="Sunday" />
              </div>
              <p className="day-name">sunday</p>
            </div>
            <div className="unavailable-badge">
              <p>Unavailable</p>
            </div>
          </div>
          <div className="schedule-summary-card">
            <img src="/assets/schedule-tab-icon.svg" alt="Schedule Summary" />
            <div className="schedule-summary-text">
              <p className="schedule-summary-title">Schedule Summary</p>
              <p className="schedule-summary-subtitle">You are available 5 days per week. Your working hours will be visible to patients when booking appointments.</p>
            </div>
          </div>
          <div className="save-schedule-section">
            <button className="save-schedule-btn">
              <img src="/assets/save-icon.svg" alt="Save Schedule" />
              Save Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
