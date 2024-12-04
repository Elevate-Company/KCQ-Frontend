import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/settings/changepassword.css';

function ChangePassword() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [repeatPasswordVisible, setRepeatPasswordVisible] = useState(false);
  const navigate = useNavigate();

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

  return (
    <div className="change-password-container ms-3 mt-4">
      <div className="change-password-content">
        <p className="change-password-title">Change Password</p>

        <div className="password-field">
          <label htmlFor="current-password" className="change-password-label">CURRENT PASSWORD</label>
          <div className="password-input-container">
            <input
              type={passwordVisible ? "text" : "password"}
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
              type={passwordVisible ? "text" : "password"}
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
              type={repeatPasswordVisible ? "text" : "password"}
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