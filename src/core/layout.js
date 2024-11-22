
import React from 'react';
import { Outlet } from 'react-router-dom';
import Dashboard from './dashboard';
import '../css/dashboard.css';

const Layout = () => {
  return (
    <div className="layout">
      <Dashboard /> {}
      <div className="main-content">
        <Outlet /> {}
      </div>
    </div>
  );
};

export default Layout;
