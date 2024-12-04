import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/navbar/navbar.css';
import profileImage from '../../assets/avatar.png';
import menuImage from '../../assets/menu.png'; // Import the menu image
import { FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa'; // Import the icons

function Navbar() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (confirmLogout) {
      localStorage.clear(); // Clears all items in localStorage
      alert('Logged out!');
      navigate('/login'); // Navigate to the login screen
    } else {
      alert('Logout canceled.');
    }
  };
  

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  return (
    <div className="navbar-card1">
      <div className="search-container">
        <i className="fas fa-search search-icon"></i>
        <input type="text" placeholder="Search..." className="search-input" />
      </div>
      <div className="notification-profile">
        <img src={menuImage} alt="Menu" className="menu-icon" />
        <i className="fas fa-bell notification-icon"></i>
        <div className="profile-avatar" onClick={toggleProfileMenu}>
          <img src={profileImage} alt="Profile" className="avatar" />
        </div>
        {showProfileMenu && (
          <div className="profile-menu">
            <div className="profile-menu-header">
              <img src={profileImage} alt="Profile" className="profile-menu-avatar" />
              <div>
                <span className="profile-menu-name">John Doe</span>
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
    </div>
  );
}

export default Navbar;