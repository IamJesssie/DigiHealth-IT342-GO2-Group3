import React, { useState, useEffect, useCallback } from "react";
import "./PageStyling.css";
import apiClient from "../api/client";
import { useAuth } from "../auth/auth";
import { PageWrapper, PageMessage, PageFolder } from "./PageComponents";
import { useAppointmentUpdates } from "../hooks/useAppointmentUpdates";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const DASHBOARD_SUMMARY_URL = "/api/dashboard/summary";
  const UPCOMING_APPOINTMENTS_URL = "/api/appointments/upcoming";

  // Define fetch functions that will be used by both useEffect and WebSocket callback
  const fetchSummary = useCallback(async () => {
    try {
      const res = await apiClient.get(DASHBOARD_SUMMARY_URL);
      setSummary(
        res.data || {
          totalPatients: 0,
          todayConfirmed: 0,
          todayPending: 0,
          todayCompleted: 0,
        }
      );
    } catch (err) {
      console.error("Failed to fetch summary:", err);
    }
  }, []);

  const fetchTodayAppointments = useCallback(async () => {
    try {
      const res = await apiClient.get(UPCOMING_APPOINTMENTS_URL);
      setTodayAppointments(
        Array.isArray(res.data) ? res.data : []
      );
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchSummary(), fetchTodayAppointments()]);
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [fetchSummary, fetchTodayAppointments]);

  const handleAppointmentUpdate = useCallback(async () => {
    // Reload both summary and appointments when WebSocket notification received
    await Promise.all([fetchSummary(), fetchTodayAppointments()]);
  }, [fetchSummary, fetchTodayAppointments]);

  useAppointmentUpdates(handleAppointmentUpdate);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const stats = [
    {
      label: "My Patients",
      valueKey: "totalPatients",
      description: "Total patients assigned",
      icon: "/assets/patients-icon.svg",
      className: "patients",
    },
    {
      label: "Confirmed Today",
      valueKey: "todayConfirmed",
      description: "Ready for consultation",
      icon: "/assets/confirmed-icon.svg",
      className: "confirmed",
    },
    {
      label: "Pending Today",
      valueKey: "todayPending",
      description: "Needs confirmation",
      icon: "/assets/pending-icon.svg",
      className: "pending",
    },
    {
      label: "Completed Today",
      valueKey: "todayCompleted",
      description: "Finished consultations",
      icon: "/assets/completed-icon.svg",
      className: "completed",
    },
  ];

  return (
    <PageWrapper>
      <PageMessage
        title={`Welcome back, ${currentUser?.fullName || "Doctor"}`}
        message={`Today is ${new Date().toLocaleDateString(undefined, {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}`}
      />

      <PageFolder>
        <div className="stats-cards">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-card">
              <div className="stat-header">
                <p>{stat.label}</p>
                <div className={`card-icon ${stat.className}`}>
                  <img src={stat.icon} alt={stat.label} />
                </div>
              </div>
              <div className="card-body">
                <p className="stat-number">{summary[stat.valueKey]}</p>
                <p className="stat-description">{stat.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="appointments-table-card">
          <div className="appointment-header">
            <h3>Upcoming Appointments</h3>
            <button
              className="view-all-btn"
              onClick={() => navigate("/appointments")}
            >
              View All
            </button>
          </div>
          <table className="page-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Patient Name</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {todayAppointments.map((appt) => {
                // Format date for display and navigation state - handle various date field names
                let displayDate = "N/A";
                let dateForNav = null;
                if (appt.startDateTime) {
                  displayDate = new Date(appt.startDateTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                  dateForNav = appt.startDateTime.split('T')[0]; // ISO format to YYYY-MM-DD
                } else if (appt.appointmentDate) {
                  const dateStr = typeof appt.appointmentDate === 'string' 
                    ? appt.appointmentDate 
                    : appt.appointmentDate;
                  displayDate = new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                  dateForNav = dateStr.split('T')[0];
                } else if (appt.date) {
                  const dateStr = typeof appt.date === 'string' 
                    ? appt.date 
                    : appt.date;
                  displayDate = new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                  dateForNav = dateStr.split('T')[0];
                }
                
                return (
                <tr
                  key={appt.id}
                  onClick={() => navigate("/appointments", { state: { selectedDate: dateForNav } })}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f5f5f5")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "")}
                >
                  <td>{displayDate}</td>
                  <td>{appt.time}</td>
                  <td>{appt.patientName}</td>
                  <td>{appt.type}</td>
                  <td>
                    <span
                      className={`status-badge ${appt.status.toLowerCase()}`}
                    >
                      {appt.status}
                    </span>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </PageFolder>
    </PageWrapper>
  );
};

export default Dashboard;
