import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/navbar/navbar.css';
import profileImage from '../../assets/avatar.png';
import menuImage from '../../assets/menu.png';
import logo from '../../assets/Logo1.png';
import { FaUser, FaCog, FaSignOutAlt, FaBell } from 'react-icons/fa';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

function Navbar() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [username, setUsername] = useState('');
  const [userProfileImage, setUserProfileImage] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  
  const apiUrl = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';

  useEffect(() => {
    const usernameID = localStorage.getItem('username');
    setUsername(usernameID);
    
    // Fetch user profile image
    const fetchUserProfileImage = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) return;
      
      try {
        const response = await axios.get(`${apiUrl}/api/accounts/my-account/`, {
          headers: {
            'Authorization': `Token ${token}`,
          }
        });
        
        if (response.data && response.data.profile_image) {
          setUserProfileImage(`${apiUrl}${response.data.profile_image}`);
        }
      } catch (error) {
        console.error('Error fetching user profile image:', error);
      }
    };
    
    fetchUserProfileImage();

    // Load notifications from localStorage
    const savedNotifications = localStorage.getItem('tripNotifications');
    if (savedNotifications) {
      const parsedNotifications = JSON.parse(savedNotifications);
      setNotifications(parsedNotifications);
      // Count only unread notifications
      setNotificationCount(parsedNotifications.filter(notification => !notification.read).length);
    }

    // Set up event listener for trip updates
    window.addEventListener('tripScheduleUpdated', handleTripUpdate);
    
    return () => {
      window.removeEventListener('tripScheduleUpdated', handleTripUpdate);
    };
  }, [apiUrl]);

  // Create a formatted time string for notifications
  const formatNotificationTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    
    // If today, show only time
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If this year, show month and day
    if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
    
    // Otherwise show full date
    return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Handle trip schedule update events
  const handleTripUpdate = (event) => {
    const { trip } = event.detail;
    
    // Create a new notification
    const newNotification = {
      id: Date.now(),
      type: 'trip_update',
      tripId: trip.id,
      tripName: trip.name || `Trip #${trip.id}`,
      message: `Trip schedule updated for ${trip.origin} to ${trip.destination}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    
    // Use functional updates to guarantee we're working with the latest state
    setNotifications(prevNotifications => {
      const updatedNotifications = [newNotification, ...prevNotifications];
      
      // Save to localStorage
      localStorage.setItem('tripNotifications', JSON.stringify(updatedNotifications));
      
      return updatedNotifications;
    });
    
    // Update notification count - also needs to be based on latest state
    setNotificationCount(prevCount => prevCount + 1);
    
    // Show toast notification
    toast.info(`Trip schedule updated for ${trip.origin} to ${trip.destination}`);
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
    if (showNotifications) setShowNotifications(false);
  };

  const toggleNotifications = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setShowNotifications(!showNotifications);
    if (showProfileMenu) setShowProfileMenu(false);
  };

  const handleNotificationClick = (notification) => {
    // Mark notification as read using functional update
    setNotifications(prevNotifications => {
      const updatedNotifications = prevNotifications.map(n => 
        n.id === notification.id ? { ...n, read: true } : n
      );
      
      // Save to localStorage
      localStorage.setItem('tripNotifications', JSON.stringify(updatedNotifications));
      
      return updatedNotifications;
    });
    
    // Update notification count
    setNotificationCount(prevCount => {
      // If this notification was unread, decrement the count
      return notification.read ? prevCount : prevCount - 1;
    });
    
    // Navigate to trip details
    if (notification.type === 'trip_update' && notification.tripId) {
      navigate(`/trip-details/${notification.tripId}`);
    }
    
    // Close notification panel
    setShowNotifications(false);
  };

  const clearAllNotifications = (e) => {
    // Prevent event from propagating to the notification container
    if (e) e.stopPropagation();
    
    // Clear notifications
    setNotifications([]);
    setNotificationCount(0);
    
    // Clear localStorage
    localStorage.setItem('tripNotifications', JSON.stringify([]));
    
    // Close notification panel
    setShowNotifications(false);
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };
  
  const confirmLogout = () => {
    localStorage.clear();
    toast.success('Logged out successfully!');
    navigate('/login');
    setShowLogoutModal(false);
  };
  
  const cancelLogout = () => {
    setShowLogoutModal(false);
    toast.info('Logout cancelled');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  return (
    <div className="navbar-card1">
      <div className="logo-container">
        <img src={logo} alt="KCQ Express" className="navbar-logo" />
      </div>
      <div className="notification-profile">
        <div className="sidebar-toggle" onClick={(e) => {
          // Dispatch a custom event that components.js will listen for
          const toggleEvent = new CustomEvent('toggleSidebar', { detail: { source: 'navbar' } });
          document.dispatchEvent(toggleEvent);
          e.stopPropagation(); // Prevent event bubbling
        }}>
          <img src={menuImage} alt="Menu" className="menu-icon" />
        </div>
        <div className="notification-container" onClick={toggleNotifications}>
          <div className="notification-icon-wrapper">
            <FaBell className="notification-icon" />
            {notificationCount > 0 && (
              <span className="notification-badge">{notificationCount}</span>
            )}
          </div>
          {showNotifications && (
            <div className="notifications-menu">
              <div className="notifications-header">
                <span>Notifications</span>
                {notifications.length > 0 && (
                  <button className="clear-notifications" onClick={(e) => clearAllNotifications(e)}>
                    Clear All
                  </button>
                )}
              </div>
              <div className="notifications-content">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="notification-icon">
                        <FaBell />
                      </div>
                      <div className="notification-details">
                        <p className="notification-message">{notification.message}</p>
                        <p className="notification-time">
                          {formatNotificationTime(notification.timestamp || notification.time)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="notifications-empty">
                    <span>No new notifications</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="profile-avatar" onClick={toggleProfileMenu}>
          <img 
            src={userProfileImage || profileImage} 
            alt="Profile" 
            className="avatar"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = profileImage;
            }}
          />
        </div>
        {showProfileMenu && (
          <div className="profile-menu">
            <div className="profile-menu-header">
              <img 
                src={userProfileImage || profileImage} 
                alt="Profile" 
                className="profile-menu-avatar"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = profileImage;
                }}
              />
              <div>
                <span className="profile-menu-name">{username}</span>
                <span className="profile-menu-role">Employee</span>
              </div>
            </div>
            <div className="profile-menu-item" onClick={handleProfileClick}>
              <FaUser className="profile-menu-icon" />
              <span>My Profile</span>
            </div>
            <div className="profile-menu-item" onClick={handleSettingsClick}>
              <FaCog className="profile-menu-icon" />
              <span>Settings</span>
            </div>
            <div className="profile-menu-item profile-menu-logout" onClick={handleLogout}>
              <FaSignOutAlt className="profile-menu-icon" />
              <span>Logout</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Logout Confirmation Modal */}
      <Modal show={showLogoutModal} onHide={cancelLogout} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to log out?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelLogout}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmLogout} style={{ backgroundColor: '#091057', borderColor: '#091057' }}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Navbar;