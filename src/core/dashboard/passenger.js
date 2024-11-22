import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/dashboard/passenger.css';
import personImage from '../../assets/person.png';

function Passenger() {
  return (
    <div className="card passenger-card border-0 mb-4 col-12 col-md-6 col-lg-4 position-relative">
      {}
      <img 
        src={personImage} 
        alt="Person Icon" 
        className="passenger-image" 
      />
      
      {}
      <div className="card-body passenger-card-body">
        <h4 className="passenger-title">Number of Passengers</h4>
      </div>
    </div>
  );
}

export default Passenger;
