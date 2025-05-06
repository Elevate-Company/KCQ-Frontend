import React, { useState, useEffect } from 'react';
import '../../css/navbar/profilecard.css';
import avatar from '../../assets/avatar.png';
import axios from 'axios';
import { toast } from 'react-toastify';

// Define consistent colors for the application
const THEME = {
  primary: '#0a215a',  // Changed to match the sidebar dark blue
  secondary: '#071c4d', // Darker variant
  accent: '#e8f0fe',
  success: '#34a853',
  danger: '#ea4335',
  warning: '#fbbc04',
  dark: '#071440', 
  light: '#f8f9fa'
};

function ProfileCard() {
  const [userData, setUserData] = useState({
    username: 'N/A',
    first_name: 'N/A',
    last_name: 'N/A',
    email: 'N/A',
    mobile_number: 'N/A',
    profile_image: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const apiUrl = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      try {
        const response = await axios.get(`${apiUrl}/api/accounts/my-account/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        });

        const data = response.data;
        setUserData({
          username: data.username || 'N/A',
          first_name: data.first_name || 'N/A',
          last_name: data.last_name || 'N/A',
          email: data.email || 'N/A',
          mobile_number: data.mobile_number || 'N/A',
          profile_image: data.profile_image ? `${apiUrl}${data.profile_image}` : null
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to fetch user data');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [apiUrl]);

  const fullName = userData.first_name !== 'N/A' && userData.last_name !== 'N/A' 
    ? `${userData.first_name} ${userData.last_name}` 
    : userData.username;

  return (
    <div className="profile-card-container ms-1 mt-4">
      {/* Header */}
      <div className="profile-card-header" style={{ 
        background: THEME.primary,
        color: 'white',
        padding: '15px',
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
        marginBottom: '15px',
        display: 'flex',
        alignItems: 'center'
      }}>
        <i className="fas fa-user-circle me-2"></i>
        <h5 className="mb-0 fw-bold">My Profile</h5>
      </div>

      <div className="profile-card-content">
        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <>
            <div className="profile-info-container">
              <div className="profile-avatar-holder">
                <img 
                  src={userData.profile_image || avatar} 
                  alt="Profile Avatar" 
                  className="profile-avatar-settings" 
                />
              </div>
              <div className="profile-text">
                <h4>{fullName}</h4>
                <p className="profile-position">EMPLOYEE</p>
              </div>
            </div>
            <div className="profile-name-section">
              <p className="profile-name-label">Name:</p>
              <p className="profile-name">{fullName}</p>
            </div>
            <hr />
            <div className="profile-email-section">
              <p className="profile-email-label">Email:</p>
              <p className="profile-email">{userData.email}</p>
            </div>
            <hr />
            <div className="profile-number-section">
              <p className="profile-number-label">Mobile:</p>
              <p className="profile-number">{userData.mobile_number}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ProfileCard;