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
      const response = await axios.post('https://api.kcq-express.co/api/accounts/update-password/', {
        current_password: currentPassword,
        new_password: newPassword,
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      });

      setSuccess('Password changed successfully');
      setError('');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      setError('Failed to change password');
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