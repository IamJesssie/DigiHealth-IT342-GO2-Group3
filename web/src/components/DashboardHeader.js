import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './DashboardHeader.css';

const DashboardHeader = () => {
  return (
    <header className="dashboard-header">
      <div className="header-logo-container">
        <img src="/assets/header-logo.svg" alt="DigiHealth Logo" />
        <div className="header-title-container">
          <h1>DigiHealth</h1>
          <p>Doctor Portal</p>
        </div>
      </div>
      <nav className="header-nav">
        <NavLink to="/dashboard" className="nav-item">
          <img src="/assets/dashboard-icon.svg" alt="Dashboard" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/patients" className="nav-item">
          <img src="/assets/patients-nav-icon.svg" alt="Patients" />
          <span>Patients</span>
        </NavLink>
        <NavLink to="/appointments" className="nav-item">
          <img src="/assets/appointments-nav-icon.svg" alt="Appointments" />
          <span>Appointments</span>
        </NavLink>
      </nav>
      <div className="header-user-container">
        <div className="notification-icon">
          <img src="/assets/notification-icon.svg" alt="Notifications" />
          <span className="notification-badge">2</span>
        </div>
        <div className="user-profile">
          <img src="/assets/profile-pic.svg" alt="Dr. Sarah Smith" className="profile-pic" />
          <div className="user-info">
            <p className="user-name">Dr. Sarah Smith</p>
            <p className="user-specialty">General Practitioner</p>
          </div>
          <img src="/assets/dropdown-icon.svg" alt="Dropdown" className="dropdown-icon" />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;