import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/dashboard/passenger.css';
import personImage from '../../assets/person.png';

function Passenger() {
  const sampleDataAmount = 150;

  return (
    <div className="card passenger-card border-0 mb-4 col-12 col-md-6 col-lg-4 position-relative">
      <div className="d-flex align-items-center">
        <img 
          src={personImage} 
          alt="Person Icon" 
          className="passenger-image" 
        />
        <div className="sample-data-amount">
          {sampleDataAmount}
        </div>
      </div>
      <div className="card-body passenger-card-body">
        <h4 className="passenger-title">Number of Passengers</h4>
      </div>
    </div>
  );
}

export default Passenger;