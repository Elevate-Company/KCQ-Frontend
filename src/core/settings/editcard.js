import React from 'react';
import '../../css/editcard.css';

function EditCard() {
  return (
    <div className="editcard-container ms-3 mt-4">
      <div className="editcard-content">
        <p className="editcard-title">Edit Profile</p>
        
        <label htmlFor="fullname" className="editcard-label">FULLNAME:</label>
        <input
          type="text"
          id="fullname"
          className="editcard-input"
          defaultValue="Elevate"
        />

        <label htmlFor="phone" className="editcard-label">PHONE NUMBER:</label>
        <input
          type="text"
          id="phone"
          className="editcard-input"
          defaultValue="123-456-7890"
        />

        <label htmlFor="email" className="editcard-label">EMAIL:</label>
        <input
          type="email"
          id="email"
          className="editcard-input"
          defaultValue="elevatesolutionsagency@gmail.com"
        />

        <div className="editcard-button-container">
          <button className="update-profile-button">Update Profile</button>
        </div>
      </div>
    </div>
  );
}

export default EditCard;
