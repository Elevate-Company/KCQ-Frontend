import React from 'react';
import Navbar from '../navbar';
import ProfileCard from './profilecard';
import EditCard from './editcard'; 
import ChangePassword from './changepassword'; // Import the ChangePassword component
import '../../css/settings.css'; 

function Settings() {
  return (
    <div>
      <Navbar />
      <div className="settings-container">
        <ProfileCard />
        <EditCard />
      </div>
      <div className="settings-container">
        <ChangePassword /> {/* Display ChangePassword below */}
      </div>
    </div>
  );
}

export default Settings;
