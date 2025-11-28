import React, { useState } from 'react';
import './DoctorEditAppointment.css';
import { updateAppointmentStatus } from '../api/client';

const DoctorEditAppointment = ({ appointment, onClose, onSaved, onCancelled }) => {
  const [date, setDate] = useState(appointment?.startDateTime || appointment?.appointmentTime || '');
  const [time, setTime] = useState(appointment?.startDateTime || appointment?.appointmentTime || '');
  const [type, setType] = useState(appointment?.type || '');
  const [doctorName, setDoctorName] = useState(appointment?.doctorName || '');
  const [status, setStatus] = useState(appointment?.status || 'CONFIRMED');
  const [notes, setNotes] = useState(appointment?.notes || '');
  const [saving, setSaving] = useState(false);

  if (!appointment) return null;

  const handleSave = async () => {
    try {
      setSaving(true);
      // Currently only status update is supported by backend
      await updateAppointmentStatus(appointment.id, status);
      onSaved && onSaved({ status });
      onClose && onClose();
    } catch (e) {
      console.error('Failed to save changes', e);
      alert('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelAppointment = async () => {
    try {
      setSaving(true);
      await updateAppointmentStatus(appointment.id, 'CANCELLED');
      onCancelled && onCancelled();
      onClose && onClose();
    } catch (e) {
      console.error('Failed to cancel appointment', e);
      alert('Failed to cancel appointment');
    } finally {
      setSaving(false);
    }
  };

  const localDate = date ? new Date(date).toISOString().slice(0, 10) : '';
  const localTime = time ? new Date(time).toTimeString().slice(0,5) : '';

  return (
    <div className="appointment-modal-overlay" role="dialog" aria-modal="true">
      <div className="appointment-modal">
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <img src="/assets/figma-exports/edit-appointment-close-icon.svg" alt="Close" />
        </button>

        <div className="dialog-header">
          <h2>Edit Appointment</h2>
          <p>Update appointment information</p>
        </div>

        <div className="form">
          <div className="form-group">
            <label>Patient <span className="req">*</span></label>
            <div className="input readonly">
              <span>{appointment.patientName} {appointment.patientCode ? `(${appointment.patientCode})` : ''}</span>
              <img src="/assets/figma-exports/edit-appointment-dropdown-icon.svg" alt="dropdown" />
            </div>
            <div className="subtext">Phone: {appointment.patientPhone || '—'} | Email: {appointment.patientEmail || '—'}</div>
          </div>

          <div className="row">
            <div className="form-group half">
              <label>Date <span className="req">*</span></label>
              <input type="date" value={localDate} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="form-group half">
              <label>Time <span className="req">*</span></label>
              <input type="time" value={localTime} onChange={(e) => setTime(e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label>Appointment Type <span className="req">*</span></label>
            <div className="input">
              <span>{type || 'Select type'}</span>
              <img src="/assets/figma-exports/edit-appointment-type-dropdown-icon.svg" alt="dropdown" />
            </div>
          </div>

          <div className="form-group">
            <label>Doctor <span className="req">*</span></label>
            <div className="input">
              <span>{doctorName || 'Select doctor'}</span>
              <img src="/assets/figma-exports/edit-doctor-dropdown-icon.svg" alt="dropdown" />
            </div>
          </div>

          <div className="form-group">
            <label>Status <span className="req">*</span></label>
            <div className="input">
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="CONFIRMED">Confirmed</option>
                <option value="PENDING">Pending</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea placeholder="Add any additional notes or instructions..." value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        </div>

        <div className="dialog-footer">
          <button className="btn btn-outline" onClick={onClose}>
            <img src="/assets/figma-exports/edit-appointment-cancel-icon.svg" alt="Cancel" />
            Cancel
          </button>
          <button className="btn btn-gradient" onClick={handleSave} disabled={saving}>
            <img src="/assets/figma-exports/edit-appointment-save-icon.svg" alt="Save" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button className="btn btn-danger" onClick={handleCancelAppointment} disabled={saving}>
            Cancel Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorEditAppointment;
