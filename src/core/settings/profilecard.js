import React from 'react';
import '../../css/profilecard.css';
import avatar from '../../assets/avatar.png';

function ProfileCard() {
  return (
    <div className="profile-card-container ms-1 mt-4">
      <div className="profile-card-content">
        <p>My Profile</p>
        <div className="profile-info-container">
          <div className="profile-avatar-holder">
            <img src={avatar} alt="Profile Avatar" className="profile-avatar-settings" />
            <div className="camera-icon" onClick={() => alert('Change profile photo')}>
              <i className="fas fa-camera"></i>
            </div>
          </div>
          <div className="profile-text">
            <h4>Elevate</h4>
            <p className="profile-position">EMPLOYEE</p>
          </div>
        </div>
        <div className="profile-name-section">
          <p className="profile-name-label">Name:</p>
          <p className="profile-name">Elevate</p>
        </div>
        <hr />
        <div className="profile-email-section">
          <p className="profile-email-label">Email:</p>
          <p className="profile-email">Elevate@gmail.com</p>
        </div>
        <hr></hr>
        <div className="profile-number-section">
          <p className="profile-number-label">Mobile:</p>
          <p className="profile-number">000000000</p>
        </div>
        <hr></hr>
        <div className="profile-location-section">
          <p className="profile-location-label">Location:</p>
          <p className="profile-location">Kasiglahan</p>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
