import React, { useState, useEffect } from 'react';
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
import needHelpIcon from '../assets/needhelp.png'; // Reusing the needhelp icon for logs

function Components() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(window.innerWidth > 768);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [isSidebarClosed, setIsSidebarClosed] = useState(false);

  // Function to toggle sidebar between expanded and collapsed states
  const toggleSidebar = () => {
    if (isMobileView) {
      setIsSidebarClosed(!isSidebarClosed);
      setIsSidebarExpanded(!isSidebarClosed);
    } else {
      setIsSidebarExpanded(!isSidebarExpanded);
    }
  };

  // Function to close the sidebar completely
  const closeSidebar = () => {
    setIsSidebarExpanded(false);
    setIsSidebarClosed(true);
  };

  // Resize handler to adjust sidebar state based on screen width
  const handleResize = () => {
    setIsMobileView(window.innerWidth <= 768);
    if (window.innerWidth > 768) {
      setIsSidebarExpanded(true);
      setIsSidebarClosed(false);
    } else {
      setIsSidebarExpanded(false);
    }
  };

  // Close sidebar when overlay is clicked on mobile view
  const handleOverlayClick = () => {
    if (isMobileView) {
      closeSidebar();
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="container-fluid">
      <button onClick={toggleSidebar} className="btn-toggle-sidebar">
        <i className="fa fa-bars" aria-hidden="true"></i>
      </button>
      {isMobileView && isSidebarExpanded && (
        <div className="overlay visible" onClick={handleOverlayClick}></div>
      )}
      <div className="row">
        <div
          className={`sidebar ${isSidebarExpanded ? 'expanded' : 'collapsed'} ${isSidebarClosed ? 'closed' : ''}`}
        >
          <div className="sidebar-header">
            {isSidebarExpanded && <img src={logo} alt="KCQ Logo" className="sidebar-logo" />}
            {!isMobileView && isSidebarExpanded && (
              <button onClick={closeSidebar} className="btn-close-sidebar">
                X
              </button>
            )}
          </div>

          <ul className="nav flex-column">
            <li className="nav-item">
              <NavLink
                to="/dashboard"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <img src={dashboardIcon} alt="Dashboard" className="sidebar-icon" />
                {isSidebarExpanded && <span>Dashboard</span>}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/issue-ticket"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <img src={issueTicketIcon} alt="Issue Ticket" className="sidebar-icon" />
                {isSidebarExpanded && <span>Issue Ticket</span>}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/manage-trips"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <img src={manageTripsIcon} alt="Manage Trips" className="sidebar-icon" />
                {isSidebarExpanded && <span>Manage Trips</span>}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/manage-tickets"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <img src={manageTicketsIcon} alt="Manage Tickets" className="sidebar-icon" />
                {isSidebarExpanded && <span>Manage Tickets</span>}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/passenger"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <img src={profileIcon} alt="Profile" className="sidebar-icon" />
                {isSidebarExpanded && <span>Passenger</span>}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/reports"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <img src={reportsIcon} alt="Reports" className="sidebar-icon" />
                {isSidebarExpanded && <span>Reports</span>}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/settings"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <img src={settingsIcon} alt="Settings" className="sidebar-icon" />
                {isSidebarExpanded && <span>Settings</span>}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/logs"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <img src={needHelpIcon} alt="Logs" className="sidebar-icon" />
                {isSidebarExpanded && <span>Logs</span>}
              </NavLink>
            </li>
          </ul>

          <div className="d-flex align-items-center need-help">
            <NavLink
              to="/need-help"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <img src={needHelpIcon} alt="Need Help" className="sidebar-icon" />
              {isSidebarExpanded && <span className="ms-2">Need Help?</span>}
            </NavLink>
          </div>
        </div>

        <div
          className={`main-content ${isSidebarClosed ? 'closed' : isSidebarExpanded ? 'expanded' : 'collapsed'} col p-4`}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Components;