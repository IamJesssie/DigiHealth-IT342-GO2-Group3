import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import DashboardHeader from './DashboardHeader';
import AppointmentsHeader from './AppointmentsHeader';

const DashboardLayout = () => {
  const location = useLocation();

  const getHeader = () => {
    switch (location.pathname) {
      case '/appointments':
        return <AppointmentsHeader />;
      // Add other cases for different headers if needed
      default:
        return <DashboardHeader />;
    }
  };

  return (
    <div className="dashboard-layout">
      {getHeader()}
      <main>
        <Outlet /> {/* This is where the routed components will be rendered */}
      </main>
    </div>
  );
};

export default DashboardLayout;
