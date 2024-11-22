import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import '../../css/changepassword.css';

function ChangePassword() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [repeatPasswordVisible, setRepeatPasswordVisible] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate hook

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleRepeatPasswordVisibility = () => {
    setRepeatPasswordVisible(!repeatPasswordVisible);
  };

  const handleLogout = () => {
    // Navigate to the Login page after logging out
    navigate('/login'); // This will route to Login page
  };

  return (
    <div className="change-password-container ms-3 mt-4">
      <div className="change-password-content">
        <p className="change-password-title">Change Password</p>

        <div className="password-fields-container">
          <div className="password-field">
            <label htmlFor="current-password" className="change-password-label">CURRENT PASSWORD:</label>
            <div className="password-input-container">
              <input
                type={passwordVisible ? "text" : "password"}
                id="current-password"
                className="change-password-input current-password-input"
                placeholder="Enter current password"
              />
              <i
                className={`fa${passwordVisible ? 's fa-eye-slash' : 's fa-eye'} eye-icon`}
                onClick={togglePasswordVisibility}
              ></i>
            </div>
          </div>

          <div className="password-field">
            <label htmlFor="new-password" className="change-password-label">NEW PASSWORD:</label>
            <div className="password-input-container">
              <input
                type={passwordVisible ? "text" : "password"}
                id="new-password"
                className="change-password-input new-password-input"
                placeholder="Enter new password"
              />
              <i
                className={`fa${passwordVisible ? 's fa-eye-slash' : 's fa-eye'} eye-icon`}
                onClick={togglePasswordVisibility}
              ></i>
            </div>
          </div>
        </div>

        <div className="password-field last">
          <div className="repeat-password-field">
            <label htmlFor="repeat-new-password" className="change-password-label">REPEAT NEW PASSWORD:</label>
            <div className="password-input-container">
              <input
                type={repeatPasswordVisible ? "text" : "password"}
                id="repeat-new-password"
                className="change-password-input repeat-password-input"
                placeholder="Repeat new password"
              />
              <i
                className={`fa${repeatPasswordVisible ? 's fa-eye-slash' : 's fa-eye'} eye-icon`}
                onClick={toggleRepeatPasswordVisibility}
              ></i>
            </div>
          </div>
          <button className="change-password-button mt-3">Change Password</button>
        </div>

        {/* Logout button that triggers routing to login page */}
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default ChangePassword;
