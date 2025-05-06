import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/navbar/navbar.css';
import profileImage from '../../assets/avatar.png';
import menuImage from '../../assets/menu.png';
import logo from '../../assets/Logo1.png';
import { FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

function Navbar() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
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
  }, [apiUrl]);

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
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
        <img src={menuImage} alt="Menu" className="menu-icon" />
        <i className="fas fa-bell notification-icon"></i>
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