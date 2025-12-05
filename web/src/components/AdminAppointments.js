import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/auth';
import apiClient from '../api/client';
import AdminTabs from './AdminTabs';
import { useAppointmentUpdates } from '../hooks/useAppointmentUpdates';
import './AdminAppointments.css';

const AdminAppointments = ({ nested = false }) => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, loading: authLoading, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Authentication guard
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || currentUser?.role !== 'ADMIN')) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, currentUser, authLoading, navigate]);

  const fetchAppointments = useCallback(async () => {
    if (!isAuthenticated || currentUser?.role !== 'ADMIN') return;

    try {
      setLoading(true);
      const response = await apiClient.get('/api/admin/appointments');
      const appointmentsData = response.data.map(apt => ({
        id: apt.appointmentId,
        patientName: (apt.patient && apt.patient.user && apt.patient.user.fullName) ? apt.patient.user.fullName : 'Unknown Patient',
        doctorName: (apt.doctor && apt.doctor.user && apt.doctor.user.fullName) ? apt.doctor.user.fullName : 'Unknown Doctor',
        date: apt.appointmentDate,
        time: apt.appointmentTime,
        reason: apt.notes || apt.symptoms || 'Regular consultation',
        status: apt.status
      }));
      setAppointments(appointmentsData);
    } catch (err) {
      // If admin can't access doctor endpoints, use fallback data
      setError('Limited appointment data available');
      setAppointments([
        {
          id: 'DEMO001',
          patientName: 'Demo Patient',
          doctorName: 'Demo Doctor',
          date: new Date().toLocaleDateString(),
          time: '09:00',
          reason: 'Demo consultation',
          status: 'SCHEDULED'
        }
      ]);
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, currentUser]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleAppointmentUpdate = useCallback(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  useAppointmentUpdates(handleAppointmentUpdate);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleStatusChange = (appointmentId, newStatus) => {
    setAppointments(appointments.map(apt =>
      apt.id === appointmentId ? { ...apt, status: newStatus } : apt
    ));
  };

  const handleReschedule = (appointmentId) => {
    console.log('Reschedule appointment:', appointmentId);
  };

  const normalizeStatus = (s) => {
    const val = (s || '').toString().toLowerCase();
    if (val === 'scheduled') return 'pending';
    return val;
  };

  const filteredAppointments = appointments.filter(apt => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = (apt.patientName || '').toLowerCase().includes(term) ||
                         (apt.doctorName || '').toLowerCase().includes(term) ||
                         String(apt.id || '').toLowerCase().includes(term);
    const matchesStatus = selectedStatus === 'all' || normalizeStatus(apt.status) === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    {
      label: 'Total Doctors',
      value: new Set(appointments.map(apt => apt.doctorName)).size.toString(),
      subtitle: 'Active doctors',
      icon: '/assets/Admin-assets/Doctor-4.svg'
    },
    {
      label: 'Total Patients',
      value: new Set(appointments.map(apt => apt.patientName)).size.toString(),
      subtitle: 'With appointments',
      icon: '/assets/Admin-assets/Total-Patients.svg'
    },
    {
      label: 'Active Appointments',
      value: appointments.filter(apt =>
        ['SCHEDULED', 'CONFIRMED', 'Scheduled'].includes(apt.status)
      ).length.toString(),
      subtitle: 'Scheduled',
      icon: '/assets/Admin-assets/Active-Appointments.svg'
    },
    {
      label: 'Completed Today',
      value: appointments.filter(apt => {
        const today = new Date().toLocaleDateString();
        return apt.date === today && apt.status === 'COMPLETED';
      }).length.toString(),
      subtitle: 'Today',
      icon: '/assets/Admin-assets/Analytics.svg'
    }
  ];

  // Only show loading/error states if not in nested mode
  if (!nested) {
    if (loading) {
      return (
        <div className="admin-appointments-container">
          <div style={{ padding: '20px', textAlign: 'center' }}>
            Loading appointments data...
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="admin-appointments-container">
          <div style={{ padding: '20px', textAlign: 'center', color: 'orange' }}>
            ⚠️ {error} - Showing available data
          </div>
        </div>
      );
    }
  }

  // In nested mode, only render the content area
  if (nested) {
    return (
      <div className="appointments-content-area">
        {/* Search and Filters */}
        <div className="filters-section">
          <div className="search-container">
            <img src="/assets/search-icon.svg" alt="search" className="search-icon" />
            <input
              type="text"
              placeholder="Search by patient, doctor, or appointment ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-container">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="status-filter"
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="table-wrapper">
          <table className="appointments-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Time</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map(apt => (
                <tr key={apt.id}>
                  <td className="id-cell">{apt.id}</td>
                  <td className="patient-cell">{apt.patientName}</td>
                  <td className="doctor-cell">{apt.doctorName}</td>
                  <td>{apt.date}</td>
                  <td>{apt.time}</td>
                  <td>{apt.reason}</td>
                  <td>
                    <span className={`status-badge ${apt.status.toLowerCase()}`}>
                      {apt.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAppointments.length === 0 && (
          <div className="empty-state">
            <img src="/assets/Admin-assets/Active-Appointments.svg" alt="no appointments" className="empty-icon" />
            <h3>No appointments found</h3>
            <p>No appointments match your current search criteria.</p>
          </div>
        )}
      </div>
    );
  }

  // Standalone mode - render full page
  return (
    <div className="admin-appointments-container">
      {/* Header */}
      <header className="admin-header">
        <div className="header-left">
          <div className="logo-section">
            <div className="logo-circle">D</div>
          </div>
          <div className="header-title">
            <h1>DigiHealth Admin</h1>
            <p>System Administration Panel</p>
          </div>
        </div>
        <div className="header-right">
          <div className="user-info">
            <div className="user-avatar">SA</div>
            <div className="user-details">
              <p className="user-name">System Administrator</p>
              <p className="user-email">admin@digihealth.com</p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <img src="/assets/Admin-assets/Logout.svg" alt="logout" className="logout-icon-img" />
            Logout
          </button>
        </div>
      </header>

      {/* Stats Section */}
      <div className="stats-section">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <div className="stat-icon">
              <img src={stat.icon} alt={stat.label} />
            </div>
            <div className="stat-body">
              <p className="stat-label">{stat.label}</p>
              <p className="stat-value">{stat.value}</p>
              <p className="stat-subtitle">{stat.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs Navigation - Shared Component */}
      <AdminTabs />

      {/* Search and Filters */}
      <div className="filters-section">
        <div className="search-container">
          <img src="/assets/search-icon.svg" alt="search" className="search-icon" />
          <input
            type="text"
            placeholder="Search by patient, doctor, or appointment ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-container">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="status-filter"
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="content-area">
        <section className="content-section">
          <div className="section-header">
            <h2>All Appointments</h2>
            <p className="section-description">System-wide appointment overview</p>
          </div>

          <div className="table-wrapper">
            <table className="appointments-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Reason</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map(apt => (
                  <tr key={apt.id}>
                    <td className="id-cell">{apt.id}</td>
                    <td className="patient-cell">{apt.patientName}</td>
                    <td className="doctor-cell">{apt.doctorName}</td>
                    <td>{apt.date}</td>
                    <td>{apt.time}</td>
                    <td>{apt.reason}</td>
                    <td>
                      <span className={`status-badge ${apt.status.toLowerCase()}`}>
                        {apt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAppointments.length === 0 && (
            <div className="empty-state">
              <img src="/assets/Admin-assets/Active-Appointments.svg" alt="no appointments" className="empty-icon" />
              <h3>No appointments found</h3>
              <p>No appointments match your current search criteria.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminAppointments;
