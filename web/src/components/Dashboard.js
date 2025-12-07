import React, { useState, useEffect, useCallback } from "react";
import "./PageStyling.css";
import apiClient from "../api/client";
import { useAuth } from "../auth/auth";
import { PageWrapper, PageMessage, PageFolder } from "./PageComponents";
import { useAppointmentUpdates } from "../hooks/useAppointmentUpdates";

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

  const DASHBOARD_SUMMARY_URL = "/api/dashboard/summary";
  const TODAY_APPOINTMENTS_URL = "/api/appointments/today";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [summaryRes, appointmentsRes] = await Promise.all([
          apiClient.get(DASHBOARD_SUMMARY_URL),
          apiClient.get(TODAY_APPOINTMENTS_URL),
        ]);

        setSummary(
          summaryRes.data || {
            totalPatients: 0,
            todayConfirmed: 0,
            todayPending: 0,
            todayCompleted: 0,
          }
        );
        setTodayAppointments(
          Array.isArray(appointmentsRes.data) ? appointmentsRes.data : []
        );
      } catch (err) {
        // Gracefully handle auth/permission issues without crashing UI

        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [setSummary, setTodayAppointments]);

  const handleAppointmentUpdate = useCallback(async () => {
    await Promise.all([fetchSummary(), fetchTodayAppointments()]);
  }, [setSummary, setTodayAppointments]);

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
            <h3>My Appointments Today</h3>
            <a href="#" className="view-all-btn">
              View All
            </a>
          </div>
          <table className="page-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Patient Name</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {todayAppointments.map((appt) => (
                <tr key={appt.id}>
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
              ))}
            </tbody>
          </table>
        </div>
      </PageFolder>
    </PageWrapper>
  );
};

export default Dashboard;
