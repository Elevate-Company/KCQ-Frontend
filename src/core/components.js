import React, { useState, useEffect, useCallback } from 'react';
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
import scannerIcon from '../assets/issueticket.png'; // Using issue ticket icon temporarily for scanner

function Components() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(window.innerWidth > 768);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [isSidebarClosed, setIsSidebarClosed] = useState(false);

  // Function to toggle sidebar between expanded and collapsed states
  const toggleSidebar = useCallback(() => {
    if (isMobileView) {
      // In mobile view, toggle between fully closed and expanded
      setIsSidebarClosed(prevClosed => !prevClosed);
      setIsSidebarExpanded(prevClosed => !prevClosed);
    } else {
      // In desktop view, toggle between collapsed (mini) and expanded
      setIsSidebarExpanded(prevExpanded => !prevExpanded);
      setIsSidebarClosed(false); // Always ensure it's not fully closed on desktop
    }
  }, [isMobileView]);

  // Function to close the sidebar completely
  const closeSidebar = useCallback(() => {
    setIsSidebarExpanded(false);
    setIsSidebarClosed(true);
  }, []);

  // Resize handler to adjust sidebar state based on screen width
  const handleResize = useCallback(() => {
    const newIsMobileView = window.innerWidth <= 768;
    setIsMobileView(newIsMobileView);
    
    if (window.innerWidth > 768) {
      setIsSidebarExpanded(true);
      setIsSidebarClosed(false);
    } else {
      setIsSidebarExpanded(false);
    }
  }, []);

  // Close sidebar when overlay is clicked on mobile view
  const handleOverlayClick = useCallback(() => {
    if (isMobileView) {
      closeSidebar();
    }
  }, [isMobileView, closeSidebar]);

  // Setup event listeners including custom toggleSidebar event from navbar
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    
    // Listen for the custom toggleSidebar event from navbar
    const handleCustomToggle = () => {
      toggleSidebar();
    };
    
    document.addEventListener('toggleSidebar', handleCustomToggle);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('toggleSidebar', handleCustomToggle);
    };
  }, [toggleSidebar]); // Add toggleSidebar as a dependency
  
  // Setup menu icon click handler - this is a fallback in case the navbar event doesn't work
  useEffect(() => {
    // Add event listener for the menu icon in navbar
    const menuIcon = document.querySelector('.sidebar-toggle');
    if (menuIcon) {
      const handleMenuClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleSidebar();
      };
      
      // Remove previous event listener to avoid duplicates
      menuIcon.removeEventListener('click', handleMenuClick);
      // Add new event listener
      menuIcon.addEventListener('click', handleMenuClick);
      
      return () => {
        // Clean up event listener
        menuIcon.removeEventListener('click', handleMenuClick);
      };
    }
  }, [isSidebarExpanded, isSidebarClosed, isMobileView, toggleSidebar]); // Add toggleSidebar to dependencies

  return (
    <div className="container-fluid">
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
                to="/scanner"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <img src={scannerIcon} alt="Ticket Scanner" className="sidebar-icon" />
                {isSidebarExpanded && <span>Ticket Scanner</span>}
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