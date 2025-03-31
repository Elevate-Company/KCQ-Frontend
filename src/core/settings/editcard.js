import React, { useState, useEffect } from 'react';
import '../../css/settings/editcard.css';
import axios from 'axios';

function EditCard() {
  const [username, setUsername] = useState('N/A');
  const [phone, setPhone] = useState('N/A');
  const [email, setEmail] = useState('N/A');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('accessToken');
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/accounts/my-account/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        });

        const data = response.data;
        setUsername(data.username || 'N/A');
        setPhone(data.mobile_number || 'N/A');
        setEmail(data.email || 'N/A');
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to fetch user data');
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="editcard-container ms-3 mt-4">
      <div className="editcard-content">
        <p className="editcard-title">Edit Profile</p>
        
        {error && <p className="text-danger">{error}</p>}

        <label htmlFor="username" className="editcard-label">USERNAME:</label>
        <input
          type="text"
          id="username"
          className="editcard-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label htmlFor="phone" className="editcard-label">PHONE NUMBER:</label>
        <input
          type="text"
          id="phone"
          className="editcard-input"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <label htmlFor="email" className="editcard-label">EMAIL:</label>
        <input
          type="email"
          id="email"
          className="editcard-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="editcard-button-container">
          <button className="update-profile-button">Update Profile</button>
        </div>
      </div>
    </div>
  );
}

export default EditCard;