import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap is loaded
import '../../css/manageticket/ticketcard.css'; // Import the custom CSS
import boatLogo from '../../assets/boatlogo.png'; // Import your logo

function TicketCard() {
  return (
    <div className="card empty-card-ticketcard">
      <div className="card-body1">
        {/* Checkbox on the left */}
        <input type="checkbox" className="card-checkbox-ticketcard" />

        {/* Boat logo */}
        <img src={boatLogo} alt="Boat Logo" className="boat-logo-ticketcard" />

        {/* From component with text on the left */}
        <div className="from-component-ticketcard">
          <p className="from-text-ticketcard">From</p>
          <h4 className="from-destination-ticketcard">Cebu</h4>
        </div>

        {/* Horizontal dashed line separator */}
        <div className="separator-ticketcard" />

        {/* To component with text on the left */}
        <div className="to-component-ticketcard">
          <p className="to-text">To</p>
          <h4 className="to-destination">Cebu</h4>
        </div>

        {/* Departure date component with ID */}
        <div className="departure-date-component-ticketcard mt-3">
          <h4 className="departure-date-ticketcard">January 15, 2024</h4>
          <h4 className="departure-id-ticketcard">PBO-1234</h4>
          <h4 className="departure-text-ticketcard">Pumboat Express</h4>
          <h4 className="departure-capacity-ticketcard">150</h4>
        </div>

        {/* Vertical separator, trash icon, and View Details button */}
        <div className="vertical-separator-ticketcard">
          <button type="button" className="trash-button-ticketcard">
            <i className="fas fa-trash"></i>
          </button>
          <button type="button" className="view-details-button-ticketcard">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default TicketCard;
