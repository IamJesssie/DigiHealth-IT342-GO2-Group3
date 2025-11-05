import React from 'react';
import './Dashboard.css';
const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <main className="dashboard-main">
        <div className="welcome-message">
          <h2>Welcome back, Dr. Sarah Smith</h2>
          <p>Today is Monday, October 20, 2025</p>
        </div>

        <div className="stats-cards">
          <div className="stat-card">
            <div className="card-header">
              <p>My Patients</p>
              <div className="card-icon patients">
                <img src="/assets/patients-icon.svg" alt="My Patients" />
              </div>
            </div>
            <div className="card-body">
              <p className="stat-number">2</p>
              <p className="stat-description">Total patients assigned</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="card-header">
              <p>Confirmed Today</p>
              <div className="card-icon confirmed">
                <img src="/assets/confirmed-icon.svg" alt="Confirmed Today" />
              </div>
            </div>
            <div className="card-body">
              <p className="stat-number">2</p>
              <p className="stat-description">Ready for consultation</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="card-header">
              <p>Pending Today</p>
              <div className="card-icon pending">
                <img src="/assets/pending-icon.svg" alt="Pending Today" />
              </div>
            </div>
            <div className="card-body">
              <p className="stat-number">0</p>
              <p className="stat-description">Needs confirmation</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="card-header">
              <p>Completed Today</p>
              <div className="card-icon completed">
                <img src="/assets/completed-icon.svg" alt="Completed Today" />
              </div>
            </div>
            <div className="card-body">
              <p className="stat-number">0</p>
              <p className="stat-description">Finished consultations</p>
            </div>
          </div>
        </div>

        <div className="appointments-table-card">
            <div className="card-header">
                <h3>My Appointments Today</h3>
                <a href="#" className="view-all-btn">View All</a>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>Patient Name</th>
                        <th>Type</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>09:00 AM</td>
                        <td>Sarah Johnson</td>
                        <td>General Checkup</td>
                        <td><span className="status-badge confirmed">Confirmed</span></td>
                    </tr>
                    <tr>
                        <td>10:30 AM</td>
                        <td>Emily Rodriguez</td>
                        <td>Diabetes Consultation</td>
                        <td><span className="status-badge confirmed">Confirmed</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
