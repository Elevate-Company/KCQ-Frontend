import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/settings/changepassword.css';

function ChangePassword() {
  const navigate = useNavigate();

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

  return (
    <div className="change-password-container ms-3 mt-4">
      <div className="change-password-content">
        <p className="change-password-title">Change Password</p>

        <div className="password-field">
          <label htmlFor="current-password" className="change-password-label">CURRENT PASSWORD</label>
          <div className="password-input-container">
            <input
              type="password"
              id="current-password"
              className="change-password-input current-password-input"
              placeholder="Enter current password"
            />
          </div>
        </div>

        <div className="password-field">
          <label htmlFor="new-password" className="change-password-label">NEW PASSWORD</label>
          <div className="password-input-container">
            <input
              type="password"
              id="new-password"
              className="change-password-input new-password-input"
              placeholder="Enter new password"
            />
          </div>
        </div>

        <div className="password-field">
          <label htmlFor="repeat-new-password" className="change-password-label">REPEAT NEW PASSWORD</label>
          <div className="password-input-container">
            <input
              type="password"
              id="repeat-new-password"
              className="change-password-input repeat-password-input"
              placeholder="Repeat new password"
            />
          </div>
        </div>

        <div className="button-container">
          <button className="change-password-button">Change Password</button>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;