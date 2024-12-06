import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap is loaded
import '../../css/managetrip/managetripcard.css'; // Import the custom CSS
import boatLogo from '../../assets/boatlogo.png'; // Import your logo

function ManageTripCard({ trip }) {
  const { origin, destination, departure_time, available_seats, ferry_boat } = trip;
  
  const departureDate = new Date(departure_time).toLocaleDateString(); // Format the date
  const boatType = ferry_boat.slug;  // Assuming 'slug' contains the type of boat

  return (
    <div className="card managetrip">
      <div className="card-body-managetrip">
        {/* Boat logo */}
        <img src={boatLogo} alt="Boat Logo" className="boat-logo-managetrip" />

        {/* From component with text on the left */}
        <div className="from-component-managetrip">
          <p className="from-text-managetrip">From</p>
          <h4 className="from-destination-managetrip">{origin}</h4>
        </div>

        {/* Horizontal dashed line separator */}
        <div className="separator-managetrip" />

        {/* To component with text on the left */}
        <div className="to-component-managetrip">
          <p className="to-text-managetrip">To</p>
          <h4 className="to-destination-managetrip">{destination}</h4>
        </div>

        {/* Departure date component with ID */}
        <div className="departure-date-component-managetrip mt-3">
          <h4 className="departure-date-managetrip">{departureDate}</h4>
          <h4 className="departure-id-managetrip">{trip.id}</h4>
          <h4 className="departure-text-managetrip">{boatType}</h4>
          <h4 className="departure-capacity-managetrip">{available_seats}</h4>
        </div>

        {/* Vertical separator, trash icon, and View Details button */}
        <div className="vertical-separator-managetrip">
          <button type="button" className="trash-button-managetrip">
            <i className="fas fa-trash"></i>
          </button>
          <button type="button" className="view-details-button-managetrip">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default ManageTripCard;