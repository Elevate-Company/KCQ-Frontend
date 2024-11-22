import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/dashboard/available_boat.css';
import boatImage from '../../assets/boat.png';

function AvailableBoat() {
  return (
    <div className="card available-boat-card shadow-sm border-0 mb-4 col-12 col-md-6 col-lg-4">
      {}
      <img 
        src={boatImage} 
        alt="Boat" 
        className="boat-image" 
      />

      {}
      <div className="card-body card-body-content">
        <h4 className="available-boat-title">Number of Available Boats</h4>
        <p>Today</p>
        <p className="card-text boat-count">
        </p>
      </div>
    </div>
  );
}

export default AvailableBoat;
