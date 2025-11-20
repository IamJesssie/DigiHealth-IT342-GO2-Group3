import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/auth';
import apiClient from '../api/client';
import AdminTabs from './AdminTabs';
import './AdminPatients.css';

const AdminPatients = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, loading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Authentication guard
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || currentUser?.role !== 'ADMIN')) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, currentUser, authLoading, navigate]);

  // Fetch patients from API
  useEffect(() => {
    const fetchPatients = async () => {
      if (!isAuthenticated || currentUser?.role !== 'ADMIN') return;
      
      try {
        setLoading(true);
        const response = await apiClient.get('/api/admin/patients');
        const patientsData = response.data.map(user => ({
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          phone: user.phoneNumber || 'N/A',
          age: calculateAge(user.patient?.birthDate),
          gender: user.patient?.gender || 'N/A',
          status: user.isActive ? 'Active' : 'Inactive',
          lastVisit: 'N/A', // TODO: Calculate from appointments
          registeredDate: new Date(user.createdAt).toLocaleDateString(),
          appointmentsCount: 0 // TODO: Get from appointments
        }));
        setPatients(patientsData);
      } catch (err) {
        setError('Failed to load patients data');
        console.error('Error fetching patients:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [isAuthenticated, currentUser]);

  const calculateAge = (birthDate) => {
    if (!birthDate) return 'N/A';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const handlePatientView = (patientId) => {
    console.log('View patient details:', patientId);
  };

  const handleStatusChange = (patientId, newStatus) => {
    setPatients(patients.map(patient => 
      patient.id === patientId ? { ...patient, status: newStatus } : patient
    ));
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || patient.status.toLowerCase() === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    {
      label: 'Total Patients',
      value: patients.length.toString(),
      subtitle: `${patients.filter(p => p.status === 'Active').length} active`,
      icon: '/assets/Admin assets/Total Patients.svg'
    },
    {
      label: 'New This Month',
      value: patients.filter(p => {
        const regDate = new Date(p.registeredDate);
        const now = new Date();
        return regDate.getMonth() === now.getMonth() && regDate.getFullYear() === now.getFullYear();
      }).length.toString(),
      subtitle: 'Registered this month',
      icon: '/assets/Admin assets/Total Patients.svg'
    },
    {
      label: 'Active Patients',
      value: patients.filter(p => p.status === 'Active').length.toString(),
      subtitle: 'Currently active',
      icon: '/assets/Admin assets/Approved.svg'
    },
    {
      label: 'Total Appointments',
      value: patients.reduce((sum, p) => sum + p.appointmentsCount, 0).toString(),
      subtitle: 'All time',
      icon: '/assets/Admin assets/Active Appointments.svg'
    }
  ];

  if (loading) {
    return (
      <div className="admin-patients-container">
        <div style={{ padding: '20px', textAlign: 'center' }}>
          Loading patients data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-patients-container">
        <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-patients-container">
      {/* Header */}
      <header className="admin-header">
        <div className="header-left">
          <div className="logo-section">
            <div className="logo-circle">D</div>
          </div>
          <div className="header-title">
            <h1>DigiHealth Admin</h1>
            <p>Patient Management Panel</p>
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
            <img src="/assets/Admin assets/Logout.svg" alt="logout" className="logout-icon-img" />
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
            placeholder="Search patients by name or email..."
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Patients Table */}
      <div className="content-area">
        <section className="content-section">
          <div className="section-header">
            <h2>All Patients ({filteredPatients.length})</h2>
            <p className="section-description">Manage all registered patients in the system</p>
          </div>
          
          <div className="table-wrapper">
            <table className="patients-table">
              <thead>
                <tr>
                  <th>Patient ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Status</th>
                  <th>Last Visit</th>
                  <th>Appointments</th>
                  <th>Registered</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map(patient => (
                  <tr key={patient.id}>
                    <td className="id-cell">{patient.id}</td>
                    <td className="name-cell">{patient.name}</td>
                    <td>{patient.email}</td>
                    <td>{patient.phone}</td>
                    <td>{patient.age}</td>
                    <td>{patient.gender}</td>
                    <td>
                      <span className={`status-badge ${patient.status.toLowerCase()}`}>
                        ● {patient.status}
                      </span>
                    </td>
                    <td>{patient.lastVisit}</td>
                    <td className="appointments-cell">{patient.appointmentsCount}</td>
                    <td>{patient.registeredDate}</td>
                    <td className="actions-cell">
                      <button 
                        className="action-btn view" 
                        onClick={() => handlePatientView(patient.id)}
                      >
                        👁️ View
                      </button>
                      <select
                        value={patient.status}
                        onChange={(e) => handleStatusChange(patient.id, e.target.value)}
                        className="status-select"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPatients.length === 0 && (
            <div className="empty-state">
              <img src="/assets/Admin assets/Total Patients.svg" alt="no patients" className="empty-icon" />
              <h3>No patients found</h3>
              <p>No patients match your current search criteria.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminPatients;