import React, { useEffect, useState } from 'react';
import './NewAppointmentModal.css';
import apiClient, { createDoctorAppointment, getDoctorPatients } from '../api/client';

const NewAppointmentModal = ({ show, onClose, onCreated }) => {
  // Function to stop click propagation
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  const [patients, setPatients] = useState([]);
  const [patientId, setPatientId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [status, setStatus] = useState('SCHEDULED');
  const [saving, setSaving] = useState(false);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const res = await getDoctorPatients();
        setPatients(res.data || []);
      } catch (e) {
        setPatients([]);
      }
    };
    if (show) loadPatients();
  }, [show]);

  useEffect(() => {
    const loadSlots = async () => {
      if (!date) { setSlots([]); return; }
      try {
        setLoadingSlots(true);
        const res = await apiClient.get(`/api/doctors/me/available-slots`, { params: { date } });
        setSlots(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        setSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };
    loadSlots();
  }, [date]);

  if (!show) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patientId || !date || !time) return;
    try {
      setSaving(true);
      const payload = {
        patientId,
        appointmentDate: new Date(date).toISOString().slice(0,10),
        appointmentTime: time,
        notes,
        symptoms,
        status
      };
      await createDoctorAppointment(payload);
      if (onCreated) onCreated();
      onClose();
    } catch (err) {
      alert('Failed to create appointment');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={handleModalContentClick}>
        <div className="modal-header">
          <h2>New Appointment</h2>
          <p>Schedule a new appointment for a patient</p>
        </div>
        <form className="appointment-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Patient *</label>
            <select value={patientId} onChange={(e) => setPatientId(e.target.value)}>
              <option value="">Select a patient</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Date *</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Time *</label>
              {slots.length > 0 ? (
                <select value={time} onChange={(e) => setTime(e.target.value)}>
                  <option value="">Select a slot</option>
                  {slots.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              ) : (
                <input type="time" value={time} onChange={(e) => setTime(e.target.value)} disabled={loadingSlots} />
              )}
            </div>
          </div>
          <div className="form-group">
            <label>Appointment Type *</label>
            <select disabled><option>Consultation</option></select>
          </div>
          <div className="form-group">
            <label>Doctor *</label>
            <select disabled><option>Current Doctor</option></select>
          </div>
          <div className="form-group">
            <label>Status *</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="SCHEDULED">Scheduled</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea placeholder="Add any additional notes or instructions..." value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
          </div>
          <div className="form-group">
            <label>Symptoms</label>
            <textarea placeholder="Enter symptoms" value={symptoms} onChange={(e) => setSymptoms(e.target.value)}></textarea>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              <img src="/assets/cancel-icon.svg" alt="Cancel" />
              Cancel
            </button>
            <button type="submit" className="btn-create" disabled={saving}>
              <img src="/assets/saveicon.svg" alt="Create" />
              {saving ? 'Creating...' : 'Create Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewAppointmentModal;
