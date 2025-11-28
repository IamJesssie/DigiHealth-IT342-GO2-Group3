import React, { useState, useEffect } from 'react';
import './Appointments.css';
import NewAppointmentModal from './NewAppointmentModal';
import DoctorAppointmentDetails from './DoctorAppointmentDetails';
import DoctorEditAppointment from './DoctorEditAppointment';
import apiClient from '../api/client';

const Appointments = () => {
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const APPOINTMENTS_URL = '/api/doctors/me/appointments';

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(APPOINTMENTS_URL);
      setAppointments(res.data);
    } catch (err) {
      setError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAppointments(); }, []);

  const getStatusCounts = () => {
    const counts = { all: appointments.length, confirmed: 0, pending: 0, completed: 0, cancelled: 0 };
    appointments.forEach(appt => {
      const status = appt.status?.toLowerCase();
      if (status === 'confirmed') counts.confirmed++;
      else if (status === 'pending') counts.pending++;
      else if (status === 'completed') counts.completed++;
      else if (status === 'cancelled') counts.cancelled++;
    });
    return counts;
  };

  const counts = getStatusCounts();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const formatTime = (dateTime) => {
    if (!dateTime) return 'N/A';
    const date = new Date(dateTime);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  return (
    <div className="appointments-container">
      <main className="appointments-main">
        <div className="appointments-header">
          <h2>My Appointments</h2>
          <p>View and manage your scheduled appointments</p>
        </div>

        <div className="stats-tabs">
          <div className="stat-tab active">
            <p>All Appointments</p>
            <span>{counts.all}</span>
          </div>
          <div className="stat-tab">
            <p>Confirmed</p>
            <span>{counts.confirmed}</span>
          </div>
          <div className="stat-tab">
            <p>Pending</p>
            <span>{counts.pending}</span>
          </div>
          <div className="stat-tab">
            <p>Completed</p>
            <span>{counts.completed}</span>
          </div>
          <div className="stat-tab">
            <p>Cancelled</p>
            <span>{counts.cancelled}</span>
          </div>
        </div>

        <div className="card filter-card">
            <div className="date-filter">
                <img src="/assets/today-icon.svg" alt="Calendar" />
                <div className="date-dropdown">
                    <span>Today - Oct 20, 2025</span>
                    <img src="/assets/today-dropdown.svg" alt="dropdown" />
                </div>
            </div>
            <div className="view-toggle">
                <button className="toggle-btn active"><img src="/assets/burger.svg" alt="List" /> List</button>
                <button className="toggle-btn"><img src="/assets/calendar.svg" alt="Calendar" /> Calendar</button>
            </div>
            <button className="new-appointment-btn" onClick={() => setShowModal(true)}><img src="/assets/new.svg" alt="Add" /> New Appointment</button>
        </div>

        <div className="card appointments-list-card">
          <div className="table-header">
            <h3>Appointments List</h3>
            <p>Showing {appointments.length} appointments</p>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Patient</th>
                  <th>Type</th>
                  <th>Doctor</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(appt => (
                  <tr key={appt.id} onClick={() => { setSelected(appt); setShowDetails(true); }} className="clickable-row">
                    <td>{formatTime(appt.startDateTime || appt.appointmentTime)}</td>
                    <td>{appt.patientName || 'N/A'}</td>
                    <td>{appt.type || 'N/A'}</td>
                    <td>{appt.doctorName || 'N/A'}</td>
                    <td><span className={`status-badge ${appt.status?.toLowerCase() || 'unknown'}`}>{appt.status || 'Unknown'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <NewAppointmentModal show={showModal} onClose={() => setShowModal(false)} />
      {showDetails && selected && (
        <DoctorAppointmentDetails
          appointment={selected}
          onClose={() => setShowDetails(false)}
          onEdit={() => { setShowDetails(false); setShowEdit(true); }}
          onStatusUpdated={() => loadAppointments()}
        />
      )}
      {showEdit && selected && (
        <DoctorEditAppointment
          appointment={selected}
          onClose={() => setShowEdit(false)}
          onSaved={() => loadAppointments()}
          onCancelled={() => loadAppointments()}
        />
      )}
    </div>
  );
};

export default Appointments;
