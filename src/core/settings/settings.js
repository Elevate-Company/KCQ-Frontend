import React from 'react';
import Navbar from '../navbar/navbar';
import EditCard from './editcard'; 
import ChangePassword from './changepassword'; // Import the ChangePassword component
import '../../css/settings/settings.css'; 

function Settings() {
  return (
    <div>
      <Navbar />
      <div className="settings-container">
        <EditCard />
        <ChangePassword /> {/* Display ChangePassword next to EditCard */}
      </div>
    </div>
  );
}

export default Settings;