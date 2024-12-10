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
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Logo</th>
              <th>From</th>
              <th>To</th>
              <th>Departure Date</th>
              <th>ID</th>
              <th>Boat Type</th>
              <th>Available Seats</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><img src={boatLogo} alt="Boat Logo" className="boat-logo-managetrip" /></td>
              <td>{origin}</td>
              <td>{destination}</td>
              <td>{departureDate}</td>
              <td>{trip.id}</td>
              <td>{boatType}</td>
              <td>{available_seats}</td>
              <td>
                <button type="button" className="view-details-button-managetrip">
                  View Details
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageTripCard;