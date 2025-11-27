import React, { useEffect, useState } from 'react';
import apiClient from '../api/client';
import AdminTabs from './AdminTabs';
import './AdminDashboardSettings.css';

const AdminDashboardSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchSettings = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiClient.get('/api/admin/settings');
      setSettings(res.data);
    } catch (e) {
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSettings(); }, []);

  const updateSettings = async (partial) => {
    const next = { ...(settings || {}), ...partial };
    setSettings(next);
    try {
      const res = await apiClient.put('/api/admin/settings', next);
      setSettings(res.data);
    } catch (e) {
      setError('Failed to save settings');
    }
  };

  if (loading || !settings) {
    return <div className="settings-container">Loading settings...</div>;
  }

  return (
    <div className="settings-container">
      <AdminTabs />

      {error && <div className="error-banner">{error}</div>}

      {/* Clinic Information */}
      <section className="settings-section">
        <div className="settings-header">
          <h2 className="settings-title">Clinic Information</h2>
          <p className="settings-subtitle">Basic information about your healthcare facility</p>
        </div>
        <div className="settings-body">
          <div className="grid-2">
            <div className="form-field">
              <label className="form-label">Clinic Name</label>
              <input className="form-input" value={settings.clinicName || ''} onChange={(e) => setSettings({ ...settings, clinicName: e.target.value })} />
            </div>
            <div className="form-field">
              <label className="form-label">Email</label>
              <input className="form-input" value={settings.email || ''} onChange={(e) => setSettings({ ...settings, email: e.target.value })} />
            </div>
            <div className="form-field">
              <label className="form-label">Phone</label>
              <input className="form-input" value={settings.phone || ''} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} />
            </div>
            <div className="form-field">
              <label className="form-label">Address</label>
              <input className="form-input" value={settings.address || ''} onChange={(e) => setSettings({ ...settings, address: e.target.value })} />
            </div>
            <div className="form-field">
              <label className="form-label">City</label>
              <input className="form-input" value={settings.city || ''} onChange={(e) => setSettings({ ...settings, city: e.target.value })} />
            </div>
            <div className="form-field">
              <label className="form-label">State</label>
              <input className="form-input" value={settings.state || ''} onChange={(e) => setSettings({ ...settings, state: e.target.value })} />
            </div>
            <div className="form-field">
              <label className="form-label">ZIP Code</label>
              <input className="form-input" value={settings.zip || ''} onChange={(e) => setSettings({ ...settings, zip: e.target.value })} />
            </div>
            <div className="form-field">
              <label className="form-label">Description</label>
              <textarea className="form-textarea" value={settings.description || ''} onChange={(e) => setSettings({ ...settings, description: e.target.value })} />
            </div>
          </div>
          <div className="btn-row">
            <button className="primary-btn" onClick={() => updateSettings({})}>Save Clinic Settings</button>
          </div>
        </div>
      </section>

      {/* Appointment Policies */}
      <section className="settings-section">
        <div className="settings-header">
          <h2 className="settings-title">Appointment Policies</h2>
          <p className="settings-subtitle">Configure appointment booking rules and time slots</p>
        </div>
        <div className="settings-body">
          <div className="grid-2">
            <div className="form-field">
              <label className="form-label">Appointment Slot Duration (minutes)</label>
              <input className="form-input" type="number" value={settings.appointmentSlotMinutes || 0} onChange={(e) => setSettings({ ...settings, appointmentSlotMinutes: Number(e.target.value) })} />
            </div>
            <div className="form-field">
              <label className="form-label">Maximum Advance Booking (days)</label>
              <input className="form-input" type="number" value={settings.maxAdvanceDays || 0} onChange={(e) => setSettings({ ...settings, maxAdvanceDays: Number(e.target.value) })} />
            </div>
            <div className="form-field">
              <label className="form-label">Minimum Advance Booking (hours)</label>
              <input className="form-input" type="number" value={settings.minAdvanceHours || 0} onChange={(e) => setSettings({ ...settings, minAdvanceHours: Number(e.target.value) })} />
            </div>
            <div className="form-field">
              <label className="form-label">Cancellation Deadline (hours)</label>
              <input className="form-input" type="number" value={settings.cancelDeadlineHours || 0} onChange={(e) => setSettings({ ...settings, cancelDeadlineHours: Number(e.target.value) })} />
            </div>
          </div>

          <div className="toggle-row">
            <div className="toggle-text">
              <span className="toggle-title">Auto-confirm Appointments</span>
              <span className="toggle-desc">Automatically confirm appointments without manual review</span>
            </div>
            <input className="switch" type="checkbox" checked={!!settings.autoConfirmAppointments} onChange={(e) => updateSettings({ autoConfirmAppointments: e.target.checked })} />
          </div>

          <div className="toggle-row" style={{ marginTop: 8 }}>
            <div className="toggle-text">
              <span className="toggle-title">Allow Same-day Booking</span>
              <span className="toggle-desc">Let patients book appointments on the same day</span>
            </div>
            <input className="switch" type="checkbox" checked={!!settings.allowSameDayBooking} onChange={(e) => updateSettings({ allowSameDayBooking: e.target.checked })} />
          </div>

          <div className="btn-row">
            <button className="primary-btn" onClick={() => updateSettings({})}>Save Appointment Settings</button>
          </div>
        </div>
      </section>

      {/* Notification Settings */}
      <section className="settings-section">
        <div className="settings-header">
          <h2 className="settings-title">Notification Settings</h2>
          <p className="settings-subtitle">Configure how and when notifications are sent</p>
        </div>
        <div className="settings-body">
          {[
            { key: 'notifEmail', title: 'Email Notifications', desc: 'Send notifications via email' },
            { key: 'notifSms', title: 'SMS Notifications', desc: 'Send notifications via SMS' },
            { key: 'notifDoctorOnNew', title: 'Notify Doctor on New Appointment', desc: 'Alert doctors when patients book appointments' },
            { key: 'notifPatientOnConfirm', title: 'Notify Patient on Confirmation', desc: 'Send confirmation to patients after booking' },
            { key: 'notifOnCancellation', title: 'Notify on Cancellation', desc: 'Alert both parties when appointments are cancelled' },
          ].map((t, idx) => (
            <div className="toggle-row" key={t.key} style={{ marginTop: idx ? 8 : 0 }}>
              <div className="toggle-text">
                <span className="toggle-title">{t.title}</span>
                <span className="toggle-desc">{t.desc}</span>
              </div>
              <input className="switch" type="checkbox" checked={!!settings[t.key]} onChange={(e) => updateSettings({ [t.key]: e.target.checked })} />
            </div>
          ))}

          <div className="form-field" style={{ marginTop: 12 }}>
            <label className="form-label">Appointment Reminder (hours before)</label>
            <input className="form-input" type="number" value={settings.reminderHoursBefore || 0} onChange={(e) => setSettings({ ...settings, reminderHoursBefore: Number(e.target.value) })} />
          </div>

          <div className="btn-row">
            <button className="primary-btn" onClick={() => updateSettings({})}>Save Notification Settings</button>
          </div>
        </div>
      </section>

      {/* System Settings */}
      <section className="settings-section">
        <div className="settings-header">
          <h2 className="settings-title">System Settings</h2>
          <p className="settings-subtitle">Configure system-wide security and access settings</p>
        </div>
        <div className="settings-body">
          {[
            { key: 'maintenanceMode', title: 'Maintenance Mode', desc: 'Temporarily disable system access for maintenance' },
            { key: 'allowNewRegistrations', title: 'Allow New Registrations', desc: 'Enable new doctor and patient registrations' },
            { key: 'requireEmailVerification', title: 'Require Email Verification', desc: 'Users must verify email before accessing system' },
          ].map((t, idx) => (
            <div className="toggle-row" key={t.key} style={{ marginTop: idx ? 8 : 0 }}>
              <div className="toggle-text">
                <span className="toggle-title">{t.title}</span>
                <span className="toggle-desc">{t.desc}</span>
              </div>
              <input className="switch" type="checkbox" checked={!!settings[t.key]} onChange={(e) => updateSettings({ [t.key]: e.target.checked })} />
            </div>
          ))}

          <div className="grid-2" style={{ marginTop: 12 }}>
            <div className="form-field">
              <label className="form-label">Session Timeout (minutes)</label>
              <input className="form-input" type="number" value={settings.sessionTimeoutMinutes || 0} onChange={(e) => setSettings({ ...settings, sessionTimeoutMinutes: Number(e.target.value) })} />
            </div>
            <div className="form-field">
              <label className="form-label">Max Login Attempts</label>
              <input className="form-input" type="number" value={settings.maxLoginAttempts || 0} onChange={(e) => setSettings({ ...settings, maxLoginAttempts: Number(e.target.value) })} />
            </div>
          </div>

          <div className="btn-row">
            <button className="primary-btn" onClick={() => updateSettings({})}>Save System Settings</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboardSettings;
