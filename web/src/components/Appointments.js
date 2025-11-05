import React from 'react';
import './Appointments.css';
const Appointments = () => {
  const appointments = [
    { time: '09:00 AM', patient: 'Sarah Johnson', type: 'General Checkup', doctor: 'Dr. Sarah Smith', status: 'Confirmed' },
    { time: '10:30 AM', patient: 'Emily Rodriguez', type: 'Diabetes Consultation', doctor: 'Dr. Sarah Smith', status: 'Confirmed' },
  ];

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
            <span>2</span>
          </div>
          <div className="stat-tab">
            <p>Confirmed</p>
            <span>2</span>
          </div>
          <div className="stat-tab">
            <p>Pending</p>
            <span>0</span>
          </div>
          <div className="stat-tab">
            <p>Completed</p>
            <span>0</span>
          </div>
          <div className="stat-tab">
            <p>Cancelled</p>
            <span>0</span>
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
            <button className="new-appointment-btn"><img src="/assets/new.svg" alt="Add" /> New Appointment</button>
        </div>

        <div className="card appointments-list-card">
          <div className="table-header">
            <h3>Appointments List</h3>
            <p>Showing 2 appointments</p>
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
                  <tr key={appt.time}>
                    <td>{appt.time}</td>
                    <td>{appt.patient}</td>
                    <td>{appt.type}</td>
                    <td>{appt.doctor}</td>
                    <td><span className={`status-badge ${appt.status.toLowerCase()}`}>{appt.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Appointments;
