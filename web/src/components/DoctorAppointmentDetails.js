import React from 'react';
import './DoctorAppointmentDetails.css';
import { updateAppointmentStatus } from '../api/client';

const DoctorAppointmentDetails = ({ appointment, onClose, onEdit, onStatusUpdated }) => {
  if (!appointment) return null;

  const handleComplete = async () => {
    try {
      await updateAppointmentStatus(appointment.id, 'COMPLETED');
      onStatusUpdated && onStatusUpdated('COMPLETED');
      onClose && onClose();
    } catch (e) {
      console.error('Failed to complete appointment', e);
      alert('Failed to mark as completed');
    }
  };

  const formatDate = (dateTime) => {
    if (!dateTime) return 'N/A';
    const date = new Date(dateTime);
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatTime = (dateTime) => {
    if (!dateTime) return 'N/A';
    const date = new Date(dateTime);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  return (
    <div className="appointment-modal-overlay" role="dialog" aria-modal="true">
      <div className="appointment-modal">
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <img src="/assets/figma-exports/appointment-close-icon.svg" alt="Close" />
        </button>

        <div className="dialog-header">
          <h2>Appointment Details</h2>
          <p>View appointment information and details</p>
        </div>

        <div className="dialog-body">
          <div className="row space-between">
            <div className="col">
              <label>Patient</label>
              <div className="value">{appointment.patientName || 'N/A'}</div>
            </div>
            <div className="col status-col">
              <label>Status</label>
              <div className="status-actions">
                <span className={`badge ${appointment.status?.toLowerCase()}`}>{appointment.status}</span>
                {appointment.status !== 'COMPLETED' && (
                  <button className="btn btn-primary-sm" onClick={handleComplete}>Complete</button>
                )}
              </div>
            </div>
          </div>

          <div className="row space-between icons-row">
            <div className="icon-group">
              <div className="icon-box">
                <img src="/assets/figma-exports/appointment-calendar-icon.svg" alt="Calendar" />
              </div>
              <div className="col">
                <label>Date</label>
                <div className="value">{formatDate(appointment.startDateTime || appointment.appointmentTime)}</div>
              </div>
            </div>
            <div className="icon-group">
              <div className="icon-box">
                <img src="/assets/figma-exports/appointment-clock-icon.svg" alt="Time" />
              </div>
              <div className="col">
                <label>Time</label>
                <div className="value">{formatTime(appointment.startDateTime || appointment.appointmentTime)}</div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col">
              <label>Type</label>
              <div className="value">{appointment.type || 'N/A'}</div>
            </div>
          </div>

          <div className="row">
            <div className="col">
              <label>Doctor</label>
              <div className="value">{appointment.doctorName || 'N/A'}</div>
            </div>
          </div>

          <div className="row">
            <div className="col">
              <label>Notes</label>
              <div className="value">{appointment.notes || '—'}</div>
            </div>
          </div>
        </div>

        <div className="dialog-footer">
          <button className="btn btn-outline" onClick={onEdit}>
            <img src="/assets/figma-exports/appointment-edit-icon.svg" alt="Edit" />
            Edit Appointment
          </button>
          <button className="btn btn-gradient" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointmentDetails;

