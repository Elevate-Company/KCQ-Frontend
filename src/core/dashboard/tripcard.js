import React from 'react';
import '../../css/dashboard/tripcard.css';

function Tripcard({ from, destination, boatImage, date = "12/25/2024", boatNumber = "PBO1234" }) {
  return (
    <div className="card empty-card-tripcard">
      <div className="card-body-tripcard">
        <input type="checkbox" className="card-checkbox-tripcard" />
        <img src={boatImage} alt="Boat Logo" className="boat-logo-tripcard" />
        <div className="from-component-tripcard">
          <p className="from-text-tripcard">From</p>
          <h4 className="from-destination-tripcard">{from}</h4>
        </div>
        <div className="separator-tripcard" />
        <div className="to-component-tripcard">
          <p className="to-text-tripcard">To</p>
          <h4 className="to-destination-tripcard">{destination}</h4>
        </div>
        <div className="departure-date-component-tripcard mt-3">
          <h4 className="departure-date-tripcard">{date}</h4>
          <h4 className="departure-id-tripcard">{boatNumber}</h4>
          <h4 className="departure-text-tripcard">PumboatExpress</h4>
          <h4 className="departure-capacity-tripcard">150</h4>
        </div>
        <div>
          <button type="button" className="view-details-button-tripcard">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default Tripcard;