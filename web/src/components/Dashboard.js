import React, { useState, useEffect, useCallback } from 'react';
import './Dashboard.css';
import apiClient from '../api/client';
import { useAuth } from '../auth/auth';
import { useAppointmentUpdates } from '../hooks/useAppointmentUpdates';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [summary, setSummary] = useState({
    totalPatients: 0,
    todayConfirmed: 0,
    todayPending: 0,
    todayCompleted: 0,
  });
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const DASHBOARD_SUMMARY_URL = '/api/dashboard/summary';
  const TODAY_APPOINTMENTS_URL = '/api/appointments/today';

  const fetchSummary = useCallback(async () => {
    try {
      const res = await apiClient.get(DASHBOARD_SUMMARY_URL);
      setSummary(res.data || {
        totalPatients: 0,
        todayConfirmed: 0,
        todayPending: 0,
        todayCompleted: 0,
      });
    } catch (err) {
      console.error('Error fetching summary:', err);
    }
  }, []);

  const fetchTodayAppointments = useCallback(async () => {
    try {
      const res = await apiClient.get(TODAY_APPOINTMENTS_URL);
      setTodayAppointments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchSummary(), fetchTodayAppointments()]);
      setLoading(false);
    };
    fetchData();
  }, [fetchSummary, fetchTodayAppointments]);

  const handleAppointmentUpdate = useCallback(async () => {
    await Promise.all([fetchSummary(), fetchTodayAppointments()]);
  }, [fetchSummary, fetchTodayAppointments]);

  useAppointmentUpdates(handleAppointmentUpdate);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="dashboard-container">
      <main className="dashboard-main">
        <div className="welcome-message">
          <h2>
            Welcome back,{' '}
            {currentUser && currentUser.fullName
              ? currentUser.fullName
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
