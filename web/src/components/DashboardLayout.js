import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import PageHeader from "./PageHeader";
import "./PageStyling.css";

const DashboardLayout = () => {
  const location = useLocation();

  const getActivePage = () => {
    switch (location.pathname) {
      case "/appointments":
        return "Appointments";
      case "/patients":
        return "Patients";
      case "/dashboard":
      default:
        return "Dashboard";
    }
  };

  return (
    <div className="dashboard-layout">
      <PageHeader activePage={getActivePage()} />
      <main className="page-main">
        <Outlet /> {/* Routed components render here */}
      </main>
    </div>
  );
};

export default DashboardLayout;
