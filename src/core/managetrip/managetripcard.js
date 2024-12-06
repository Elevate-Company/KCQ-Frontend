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
        <div className="row">
          <div className="col">
            <img src={boatLogo} alt="Boat Logo" className="boat-logo-managetrip" />
          </div>
          <div className="col">From: {origin}</div>
          <div className="col">To: {destination}</div>
          <div className="col">Departure Date: {departureDate}</div>
          <div className="col">ID: {trip.id}</div>
          <div className="col">Boat Type: {boatType}</div>
          <div className="col">Available Seats: {available_seats}</div>
          <div className="col actions">
            <button type="button" className="trash-button-managetrip">
              <i className="fas fa-trash"></i>
            </button>
            <button type="button" className="view-details-button-managetrip">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageTripCard;