import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/dashboard/upcomingtripcard.css';
import axios from 'axios';

function UpcomingTripCard() {
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTrips = async () => {
      const token = localStorage.getItem('accessToken');
      console.log('Token:', token);
      try {
        const response = await axios.get('https://api.kcq-express.co/api/trips/', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
        });

        const data = response.data;
        console.log('Response data:', data);

        // Filter trips to only show those with a future departure_time
        const filteredTrips = data.filter((trip) => {
          const departureDate = new Date(trip.departure_time);
          return departureDate > new Date(); // Only include trips with future departure times
        });

        setTrips(filteredTrips); // Set filtered trips
      } catch (error) {
        console.error('Error fetching trips:', error);
        setError('Failed to fetch trips');
      }
    };

    fetchTrips();
  }, []);

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-12">
          <div className="card shadow-lg border-0 mb-4 responsive-card">
            <div className="card-body">
              <h5 className="mb-4 text-center">Upcoming Trips</h5>
              {error && <p className="text-danger">{error}</p>}
              {trips.length === 0 ? (
                <p className="text-center">No upcoming trips available</p>
              ) : (
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>From</th>
                      <th>Destination</th>
                      <th>Departure Date</th>
                      <th>Boat Type</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trips.map((trip) => (
                      <tr key={trip.id}>
                        <td>{trip.origin}</td>
                        <td>{trip.destination}</td>
                        <td>{new Date(trip.departure_time).toLocaleDateString()}</td>
                        <td>{trip.ferry_boat.slug}</td>
                        <td>
                          <button type="button" className="view-details-button-upcomingtripcard">
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpcomingTripCard;