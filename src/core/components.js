import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import '../css/dashboard/dashboard.css';
import '../css/components.css';
import logo from '../assets/kcq.png';
import dashboardIcon from '../assets/dashboard.png';
import issueTicketIcon from '../assets/issueticket.png';
import manageTicketsIcon from '../assets/managetickets.png';
import manageTripsIcon from '../assets/managetrips.png';
import profileIcon from '../assets/profile.png';
import reportsIcon from '../assets/reports.png';
import settingsIcon from '../assets/setting.png';
import needHelpIcon from '../assets/needhelp.png';

function Components() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {}
        <div className={`sidebar ${isSidebarExpanded ? 'expanded' : 'collapsed'}`}>
          <div className="sidebar-header">
            {}
            {isSidebarExpanded ? (
              <img src={logo} alt="KCQ Logo" className="sidebar-logo" />
            ) : (
              <button onClick={toggleSidebar} className="btn-toggle-sidebar arrow-right">
                →
              </button>
            )}

            {}
            {isSidebarExpanded && (
              <button onClick={toggleSidebar} className="btn-toggle-sidebar">
                ×
              </button>
            )}
          </div>

          {}
          <ul className="nav flex-column">
            <li className="nav-item">
              <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <img src={dashboardIcon} alt="Dashboard" className="sidebar-icon" />
                {isSidebarExpanded && 'Dashboard'}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/issue-ticket" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <img src={issueTicketIcon} alt="Issue Ticket" className="sidebar-icon" />
                {isSidebarExpanded && 'Issue Ticket'}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/manage-trips" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <img src={manageTripsIcon} alt="Manage Trips" className="sidebar-icon" />
                {isSidebarExpanded && 'Manage Trips'}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/manage-tickets" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <img src={manageTicketsIcon} alt="Manage Tickets" className="sidebar-icon" />
                {isSidebarExpanded && 'Manage Tickets'}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <img src={profileIcon} alt="Profile" className="sidebar-icon" />
                {isSidebarExpanded && 'Profile'}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/reports" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <img src={reportsIcon} alt="Reports" className="sidebar-icon" />
                {isSidebarExpanded && 'Reports'}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/settings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <img src={settingsIcon} alt="Settings" className="sidebar-icon" />
                {isSidebarExpanded && 'Settings'}
              </NavLink>
            </li>
          </ul>

          <div className="d-flex align-items-center need-help">
            <img src={needHelpIcon} alt="Need Help" className="sidebar-icon" />
            {isSidebarExpanded && <span className="ms-2">Need Help?</span>}
          </div>
        </div>

        <div className={`main-content ${isSidebarExpanded ? 'expanded' : 'collapsed'} col p-4`}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Components;
