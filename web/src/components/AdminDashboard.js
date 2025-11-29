import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/auth';
import apiClient from '../api/client';
import AdminTabs from './AdminTabs';
import AdminPatients from './AdminPatients';
import AdminAppointments from './AdminAppointments';
import AdminAnalytics from './AdminAnalytics';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, isAuthenticated, loading: authLoading, logout } = useAuth();
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const [allPatients, setAllPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Determine active tab based on current route (matching AdminTabs logic)
  const getActiveTab = () => {
    if (location.pathname === '/admin/dashboard' || location.pathname === '/admin') {
      return 'doctors';
    } else if (location.pathname === '/admin/patients') {
      return 'patients';
    } else if (location.pathname === '/admin/appointments') {
      return 'appointments';
    } else if (location.pathname === '/admin/analytics') {
      return 'analytics';
    }
    return 'doctors';
  };

  const activeTab = getActiveTab();

  // Authentication guard
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || currentUser?.role !== 'ADMIN')) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, currentUser, authLoading, navigate]);

  // Fetch data from backend
  useEffect(() => {
    if (isAuthenticated && currentUser?.role === 'ADMIN') {
      fetchData();
    }
  }, [isAuthenticated, currentUser]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [pendingResponse, approvedResponse, patientsResponse] = await Promise.all([
        apiClient.get('/api/admin/doctors/pending'),
        apiClient.get('/api/admin/doctors/approved'),
        apiClient.get('/api/admin/patients')
      ]);

      setPendingDoctors(pendingResponse.data);
      setAllDoctors([...approvedResponse.data, ...pendingResponse.data]);
      setAllPatients(patientsResponse.data);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveDoctor = async (doctorId) => {
    try {
      await apiClient.put(`/api/admin/doctors/${doctorId}/approve`);
      fetchData(); // Refresh data
    } catch (err) {
      console.error('Failed to approve doctor:', err);
      setError('Failed to approve doctor. Please try again.');
    }
  };

  const handleRejectDoctor = async (doctorId) => {
    try {
      await apiClient.put(`/api/admin/doctors/${doctorId}/reject`);
      fetchData(); // Refresh data
    } catch (err) {
      console.error('Failed to reject doctor:', err);
      setError('Failed to reject doctor. Please try again.');
    }
  };

  const handleToggleDoctorStatus = async (doctorId, isActive) => {
    if (!window.confirm(`Are you sure you want to ${isActive ? 'deactivate' : 'reactivate'} this doctor?`)) {
      return;
    }

    try {
      setLoading(true);
      const endpoint = isActive ? '/deactivate' : '/reactivate';
      await apiClient.put(`/api/admin/users/${doctorId}${endpoint}`);
      fetchData(); // Refresh data
      setError(''); // Clear any previous errors
    } catch (err) {
      console.error('Failed to toggle doctor status:', err);
      setError(err.response?.data?.error || 'Failed to toggle doctor status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show loading or error if authentication is still loading
  if (authLoading) {
    return <div className="admin-loading">Checking authentication...</div>;
  }

  // Redirect will happen in useEffect, but show loading meanwhile
  if (!isAuthenticated || currentUser?.role !== 'ADMIN') {
    return <div className="admin-loading">Redirecting to login...</div>;
  }

  // Remove old demo data setup - this is now in fetchData()

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // Filter patients based on search term and status
  const filteredPatients = allPatients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || patient.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const handleExportPatients = () => {
    console.log('Export patients data');
  };

  const stats = [
    {
      label: 'Total Doctors',
      value: allDoctors.length.toString(),
      subtitle: `${pendingDoctors.length} pending approval`,
      icon: '/assets/Admin-assets/Doctor-4.svg'
    },
    {
      label: 'Total Patients',
      value: allPatients.length.toString(),
      subtitle: 'Registered users',
      icon: '/assets/Admin-assets/Total-Patients.svg'
    },
    {
      label: 'Active Appointments',
      value: '0',
      subtitle: 'Loading...',
      icon: '/assets/Admin-assets/Active-Appointments.svg'
    },
    {
      label: 'System Activity',
      value: '98%',
      subtitle: '↗ System uptime',
      icon: '/assets/Admin-assets/Analytics.svg'
    }
  ];

  return (
    <div className="admin-dashboard-container">
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

      {/* Error Display */}
      {error && (
        <div className="error-banner">
          <span className="error-icon">❌</span>
          <span className="error-text">{error}</span>
        </div>
      )}

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

      {/* Alert Banner */}
      {pendingDoctors.length > 0 && (
        <div className="alert-banner">
          <span className="alert-icon">⚠️</span>
          <span className="alert-text">You have {pendingDoctors.length} doctor registration{pendingDoctors.length !== 1 ? 's' : ''} pending approval.</span>
        </div>
      )}

      {/* Tabs Navigation - Shared Component */}
      <AdminTabs />

      {/* Content */}
      <div className="content-area">
        {activeTab === 'doctors' && (
          <>
            {/* Pending Approvals */}
            <section className="content-section">
              <div className="section-header">
                <h2>Pending Doctor Approvals</h2>
                <p className="section-description">Review and approve or reject doctor registration requests</p>
              </div>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Specialization</th>
                      <th>License Number</th>
                      <th>Email</th>
                      <th>Registered Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingDoctors.map(doctor => (
                      <tr key={doctor.id}>
                        <td>{doctor.fullName}</td>
                        <td>{doctor.specialization}</td>
                        <td>{doctor.licenseNumber}</td>
                        <td>{doctor.email}</td>
                        <td>{new Date(doctor.createdAt || Date.now()).toLocaleDateString()}</td>
                        <td className="actions-cell">
                          <button className="action-btn approve" onClick={() => handleApproveDoctor(doctor.id)}>
                            ✓ Approve
                          </button>
                          <button className="action-btn reject" onClick={() => handleRejectDoctor(doctor.id)}>
                            ✕ Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* All Doctors */}
            <section className="content-section">
              <div className="section-header">
                <h2>All Doctors</h2>
                <p className="section-description">Manage all registered doctors in the system</p>
              </div>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Specialization</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Approval</th>
                      <th>Active Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allDoctors.map(doctor => (
                      <tr key={doctor.id}>
                        <td className="id-cell">{doctor.id}</td>
                        <td>{doctor.fullName}</td>
                        <td>{doctor.specialization}</td>
                        <td>{doctor.email}</td>
                        <td>{doctor.phoneNumber}</td>
                        <td>
                          <span className={`status-badge ${doctor.isApproved ? 'approved' : 'pending'}`}>
                            ● {doctor.isApproved ? 'Approved' : 'Pending'}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${doctor.isActive ? 'active' : 'inactive'}`}>
                            ● {doctor.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="actions-cell">
                          {doctor.isApproved && (
                            <button 
                              className={`action-btn ${doctor.isActive ? 'deactivate' : 'reactivate'}`}
                              onClick={() => handleToggleDoctorStatus(doctor.id, doctor.isActive)}
                              disabled={loading}
                            >
                              {doctor.isActive ? 'Deactivate' : 'Reactivate'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {activeTab === 'patients' && (
          <section className="content-section">
            <div className="section-header">
              <h2>Patients</h2>
              <p className="section-description">Patient management interface</p>
            </div>
            <AdminPatients
              patients={allPatients}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              handleExportPatients={handleExportPatients}
              onRefresh={fetchData}
              nested={true}
            />
          </section>
        )}

        {activeTab === 'appointments' && (
          <section className="content-section">
            <div className="section-header">
              <h2>Appointments</h2>
              <p className="section-description">Appointment management interface</p>
            </div>
            <AdminAppointments nested={true} />
          </section>
        )}

        {activeTab === 'analytics' && (
          <section className="content-section">
            <div className="section-header">
              <h2>Analytics</h2>
              <p className="section-description">Analytics and reporting interface</p>
            </div>
            <AdminAnalytics nested={true} />
          </section>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
