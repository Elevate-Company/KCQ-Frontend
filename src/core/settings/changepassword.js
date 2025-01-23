import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/settings/changepassword.css';
import axios from 'axios';

function ChangePassword() {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (confirmLogout) {
      localStorage.clear();
      alert('Logged out!');
      navigate('/login'); 
    } else {
      alert('Logout canceled.');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setError('New password and confirm new password do not match');
      return;
    }

    const token = localStorage.getItem('accessToken');
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/accounts/update-password/`, {
        old_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmNewPassword,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      });

      setSuccess('Password changed successfully');
      setError('');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
        setError(error.response.data.detail || JSON.stringify(error.response.data) || 'Failed to change password');
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Request data:', error.request);
        setError('Failed to change password: No response from server');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
        setError(`Failed to change password: ${error.message}`);
      }
      setSuccess('');
    }
  };

  return (
    <div className="change-password-container ms-3 mt-4">
      <div className="change-password-content">
        <p className="change-password-title">Change Password</p>

        <form onSubmit={handleChangePassword}>
          <div className="password-field">
            <label htmlFor="current-password" className="change-password-label">CURRENT PASSWORD</label>
            <div className="password-input-container">
              <input
                type="password"
                id="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="password-field">
            <label htmlFor="new-password" className="change-password-label">NEW PASSWORD</label>
            <div className="password-input-container">
              <input
                type="password"
                id="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="password-field">
            <label htmlFor="confirm-new-password" className="change-password-label">CONFIRM NEW PASSWORD</label>
            <div className="password-input-container">
              <input
                type="password"
                id="confirm-new-password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && <p className="text-danger">{error}</p>}
          {success && <p className="text-success">{success}</p>}

          <button type="submit" className="btn btn-primary mt-3">Change Password</button>
        </form>

        <button onClick={handleLogout} className="btn btn-danger mt-3">Logout</button>
      </div>
    </div>
  );
}

export default ChangePassword;