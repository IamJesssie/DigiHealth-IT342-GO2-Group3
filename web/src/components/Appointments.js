import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./PageStyling.css";
import NewAppointmentModal from "./NewAppointmentModal";
import DoctorAppointmentDetails from "./DoctorAppointmentDetails";
import DoctorEditAppointment from "./DoctorEditAppointment";
import apiClient from "../api/client";
import { PageWrapper, PageMessage, PageFolder } from "./PageComponents";
import { useAppointmentUpdates } from "../hooks/useAppointmentUpdates";

const Appointments = () => {
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liveUpdatedId, setLiveUpdatedId] = useState(null);
  const [liveBanner, setLiveBanner] = useState("");
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const location = useLocation();

  const APPOINTMENTS_URL = "/api/doctors/me/appointments";

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(APPOINTMENTS_URL);
      setAppointments(res.data);
    } catch (err) {
      setError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  useEffect(() => {
    if (location.state && appointments.length > 0) {
      const { date, appointmentId, selectedDate: navSelectedDate } = location.state;
      // Handle selectedDate from dashboard navigation or date from notification
      const dateToUse = navSelectedDate || date;
      if (dateToUse) {
        try {
          let d;
          if (typeof dateToUse === 'string') {
            // Handle ISO date string or YYYY-MM-DD format
            if (dateToUse.includes('T')) {
              d = new Date(dateToUse);
            } else {
              const parts = dateToUse.split('-');
              d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
            }
            setSelectedDate(d);
          }
        } catch (err) {
          console.error('Error parsing date:', err);
        }
      }
      if (appointmentId) {
        const appt = appointments.find(a => (a.appointmentId === appointmentId || a.id === appointmentId));
        if (appt) {
          setSelected(appt);
          setShowDetails(true);
        }
      }
    }
  }, [location.state, appointments]);

  const onLiveUpdate = (appt) => {
    try {
      const id = appt?.appointmentId || appt?.id || null;
      if (id) {
        setLiveUpdatedId(id.toString());
        setLiveBanner("Live update received");
        setTimeout(() => setLiveBanner(""), 3000);
      }
      loadAppointments();
    } catch {}
  };

  const { disconnect } = useAppointmentUpdates(onLiveUpdate);

  const getStatusCounts = () => {
    const counts = {
      all: appointments.length,
      confirmed: 0,
      pending: 0,
      completed: 0,
      cancelled: 0,
    };
    appointments.forEach((appt) => {
      const status = appt.status?.toLowerCase();
      if (status === "confirmed") counts.confirmed++;
      else if (status === "pending") counts.pending++;
      else if (status === "completed") counts.completed++;
      else if (status === "cancelled") counts.cancelled++;
    });
    return counts;
  };

  const counts = getStatusCounts();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const formatTime = (dateTime) => {
    if (!dateTime) return "N/A";
    const date = new Date(dateTime);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <PageWrapper>
      <PageMessage
        title="Appointments"
        message="Manage your scheduled appointments"
      />

      <PageFolder>
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
              <span onClick={() => setShowDatePicker(true)} style={{cursor:'pointer'}}>
                {selectedDate.toDateString().includes(new Date().toDateString()) ? 'Today - ' : ''}
                {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <img src="/assets/today-dropdown.svg" alt="dropdown" />
            </div>
          </div>
          <div className="view-toggle">
            <button className={`toggle-btn ${viewMode==='list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>
              <img src="/assets/burger.svg" alt="List" /> List
            </button>
            <button className={`toggle-btn ${viewMode==='calendar' ? 'active' : ''}`} onClick={() => setViewMode('calendar')}>
              <img src="/assets/calendar.svg" alt="Calendar" /> Calendar
            </button>
          </div>
          <button
            className="new-appointment-btn"
            onClick={() => setShowModal(true)}
          >
            <img src="/assets/new.svg" alt="Add" /> New Appointment
          </button>
        </div>
        {showDatePicker && (
          <div className="card" style={{ padding: '12px' }}>
            <input
              type="date"
              value={selectedDate.toLocaleDateString('en-CA')}
              onChange={(e) => {
                const parts = e.target.value.split('-');
                const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
                setSelectedDate(d);
                setShowDatePicker(false);
              }}
            />
          </div>
        )}
        {viewMode === 'list' && (
        <div className="card appointments-list-card">
          <div className="table-header">
            <h3>Appointments List</h3>
            <p>Showing {appointments.filter(a => {
              try {
                const dt = new Date(a.startDateTime);
                return dt.toLocaleDateString('en-CA') === selectedDate.toLocaleDateString('en-CA');
              } catch { return true; }
            }).length} appointments</p>
          </div>
          <div className="page-table">
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
                {appointments.filter(a => {
                  try {
                    const dt = new Date(a.startDateTime);
                    return dt.toLocaleDateString('en-CA') === selectedDate.toLocaleDateString('en-CA');
                  } catch { return true; }
                }).map((appt) => (
                  <tr
                    key={appt.id}
                    onClick={() => {
                      setSelected(appt);
                      setShowDetails(true);
                    }}
                    className={`clickable-row ${
                      liveUpdatedId && appt.id === liveUpdatedId
                        ? "row-live"
                        : ""
                    }`}
                  >
                    <td>
                      {formatTime(appt.startDateTime || appt.appointmentTime)}
                    </td>
                    <td>{appt.patientName || "N/A"}</td>
                    <td>{appt.type || "N/A"}</td>
                    <td>{appt.doctorName || "N/A"}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          appt.status?.toLowerCase() || "unknown"
                        }`}
                      >
                        {appt.status || "Unknown"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        )}
        {viewMode === 'calendar' && (
          <div className="card appointments-list-card">
            <div className="table-header"><h3>Calendar View</h3></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
              {[...Array(35)].map((_, i) => {
                const first = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
                const startDay = first.getDay();
                const dayNum = i - startDay + 1;
                const cellDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), dayNum);
                const valid = dayNum > 0 && dayNum <= new Date(selectedDate.getFullYear(), selectedDate.getMonth()+1, 0).getDate();
                const count = valid ? appointments.filter(a => {
                  try { return new Date(a.startDateTime).toLocaleDateString('en-CA') === cellDate.toLocaleDateString('en-CA'); } catch { return false; }
                }).length : 0;
                return (
                  <div key={i} className={`calendar-cell ${valid ? '' : 'disabled'}`} style={{ border: '1px solid #eee', padding: '8px', borderRadius: '6px' }}>
                    {valid ? (
                      <div>
                        <div style={{ fontWeight: '600' }}>{cellDate.getDate()}</div>
                        <div style={{ fontSize: '12px', color: '#555' }}>{count} appt</div>
                      </div>
                    ) : (
                      <div>&nbsp;</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PageFolder>
      <NewAppointmentModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onCreated={() => loadAppointments()}
      />
      {showDetails && selected && (
        <DoctorAppointmentDetails
          appointment={selected}
          onClose={() => setShowDetails(false)}
          onEdit={() => {
            setShowDetails(false);
            setShowEdit(true);
          }}
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
    </PageWrapper>
  );
};

export default Appointments;
