import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/dashboard/upcomingtripcard.css';
import Tripcard from './tripcard';
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
        setTrips(data); // Assuming the API returns an array of trips
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
              {trips.map((trip) => (
                <Tripcard
                  key={trip.id}
                  from={trip.origin}
                  destination={trip.destination}
                  boatImage={require(`../../assets/boatlogo.png`)} // Default image
                  dashImage={require(`../../assets/dash.png`)} // Default image
                  date={trip.departure_time}
                  boatNumber={trip.ferry_boat.slug}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpcomingTripCard;