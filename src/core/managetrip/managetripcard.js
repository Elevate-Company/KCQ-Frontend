import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap is loaded
import '../../css/managetrip/managetripcard.css'; // Import the custom CSS
import boatLogo from '../../assets/boatlogo.png'; // Import your logo

function ManageTripCard() {
  return (
    <div className="card empty-card">
      <div className="card-body1">
        {/* Checkbox on the left */}
        <input type="checkbox" className="card-checkbox" />

        {/* Boat logo */}
        <img src={boatLogo} alt="Boat Logo" className="boat-logo" />

        {/* From component with text on the left */}
        <div className="from-component">
          <p className="from-text">From</p>
          <h4 className="from-destination">Cebu</h4>
        </div>

        {/* Horizontal dashed line separator */}
        <div className="separator" />

        {/* To component with text on the left */}
        <div className="to-component">
          <p className="to-text">To</p>
          <h4 className="to-destination">Cebu</h4>
        </div>

        {/* Departure date component with ID */}
        <div className="departure-date-component mt-3">
          <h4 className="departure-date">January 15, 2024</h4>
          <h4 className="departure-id">PBO-1234</h4>
          <h4 className="departure-text">Pumboat Express</h4>
          <h4 className="departure-capacity">150</h4>
        </div>

        {/* Vertical separator, trash icon, and View Details button */}
        <div className="vertical-separator">
          <button type="button" className="trash-button">
            <i className="fas fa-trash"></i>
          </button>
          <button type="button" className="view-details-button">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default ManageTripCard;
