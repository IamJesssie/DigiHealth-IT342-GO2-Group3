import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import apiClient from '../api/client';

const Dashboard = () => {
  const [summary, setSummary] = useState({
    totalPatients: 0,
    todayConfirmed: 0,
    todayPending: 0,
    todayCompleted: 0,
  });
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const DASHBOARD_SUMMARY_URL = '/api/dashboard/summary';
  const TODAY_APPOINTMENTS_URL = '/api/appointments/today';
  const CURRENT_USER_URL = '/api/users/me';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [userRes, summaryRes, appointmentsRes] = await Promise.all([
          apiClient.get(CURRENT_USER_URL),
          apiClient.get(DASHBOARD_SUMMARY_URL),
          apiClient.get(TODAY_APPOINTMENTS_URL),
        ]);

        setProfile(userRes.data || null);
        setSummary(summaryRes.data || {
          totalPatients: 0,
          todayConfirmed: 0,
          todayPending: 0,
          todayCompleted: 0,
        });
        setTodayAppointments(Array.isArray(appointmentsRes.data) ? appointmentsRes.data : []);
      } catch (err) {
        // Gracefully handle auth/permission issues without crashing UI
        console.error('Failed to load dashboard data', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="dashboard-container">
      <main className="dashboard-main">
        <div className="welcome-message">
          <h2>
            Welcome back,{' '}
            {profile && profile.fullName
              ? profile.fullName
              : 'Doctor'}
          </h2>
          <p>
            Today is{' '}
            {new Date().toLocaleDateString(undefined, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
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
              <p className="stat-number">{summary.totalPatients}</p>
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
              <p className="stat-number">{summary.todayConfirmed}</p>
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
              <p className="stat-number">{summary.todayPending}</p>
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
              <p className="stat-number">{summary.todayCompleted}</p>
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
                    {todayAppointments.map(appt => (
                      <tr key={appt.id}>
                        <td>{appt.time}</td>
                        <td>{appt.patientName}</td>
                        <td>{appt.type}</td>
                        <td><span className={`status-badge ${appt.status.toLowerCase()}`}>{appt.status}</span></td>
                      </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
