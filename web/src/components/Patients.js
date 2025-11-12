import React, { useState, useEffect } from 'react';
import './Patients.css';
import apiClient from '../api/client';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const PATIENTS_URL = '/api/doctors/me/patients';

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(PATIENTS_URL);
        setPatients(res.data);
      } catch (err) {
        setError('Failed to load patients');
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="patients-container">
      <main className="patients-main">
        <div className="patients-header">
          <h2>My Patients</h2>
          <p>View patients assigned to your care</p>
        </div>

        <div className="card search-card">
          <div className="search-bar">
            <img src="/assets/search-icon.svg" alt="Search" />
            <input type="text" placeholder="Search by name, ID, or phone..." />
          </div>
          <div className="filter-dropdown">
            <span>All Patients</span>
            <img src="/assets/dropdownicon.svg" alt="Filter" />
          </div>
        </div>

        <div className="card patients-table-card">
          <div className="table-header">
            <h3>Patient Records</h3>
            <p>Showing 1-{patients.length} of {patients.length} patients</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Last Visit</th>
              </tr>
            </thead>
            <tbody>
              {patients.length === 0 ? (
                <tr>
                  <td colSpan="5">No patients found</td>
                </tr>
              ) : (
                patients.map(patient => (
                  <tr key={patient.id}>
                    <td>{patient.id || 'N/A'}</td>
                    <td>{patient.name || 'N/A'}</td>
                    <td>{patient.phone || 'N/A'}</td>
                    <td>{patient.email || 'N/A'}</td>
                    <td>{patient.lastVisit || 'N/A'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="table-footer">
            <p>Page 1 of 1</p>
            <div className="pagination-buttons">
              <button disabled><img src="/assets/previcon.svg" alt="Previous" /> Previous</button>
              <button disabled>Next <img src="/assets/nexticon.svg" alt="Next" /></button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Patients;
