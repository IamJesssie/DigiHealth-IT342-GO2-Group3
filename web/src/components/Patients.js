import React from 'react';
import './Patients.css';
const Patients = () => {
  const patients = [
    { id: 'P001', name: 'Sarah Johnson', phone: '+1 (555) 123-4567', email: 'sarah.johnson@email.com', lastVisit: 'Oct 15, 2025' },
    { id: 'P003', name: 'Emily Rodriguez', phone: '+1 (555) 345-6789', email: 'emily.rodriguez@email.com', lastVisit: 'Oct 12, 2025' },
  ];

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
            <p>Showing 1-2 of 2 patients</p>
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
              {patients.map(patient => (
                <tr key={patient.id}>
                  <td>{patient.id}</td>
                  <td>{patient.name}</td>
                  <td>{patient.phone}</td>
                  <td>{patient.email}</td>
                  <td>{patient.lastVisit}</td>
                </tr>
              ))}
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
