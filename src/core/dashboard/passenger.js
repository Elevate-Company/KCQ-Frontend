import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/dashboard/passenger.css';
import personImage from '../../assets/person.png';
import axios from 'axios';

function Passenger() {
  const [totalPassengers, setTotalPassengers] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTotalPassengers = async () => {
      const token = localStorage.getItem('accessToken');
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/passengers/`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
        });
        const data = response.data;
        console.log('API response data:', data); // Log the response data to inspect its structure
        if (data && typeof data.total_passengers === 'number') {
          setTotalPassengers(data.total_passengers); // Set the total number of passengers
        } else {
          throw new Error('Unexpected response format');
        }
      } catch (error) {
        console.error('Error fetching total passengers:', error);
        setError('Failed to fetch total passengers');
      }
    };

    fetchTotalPassengers();
  }, []);

  return (
    <div className="card passenger-card border-0 mb-4 col-12 col-md-6 col-lg-4 position-relative">
      <div className="d-flex align-items-center">
        <img 
          src={personImage} 
          alt="Person Icon" 
          className="passenger-image" 
        />
        <div className="sample-data-amount">
          {totalPassengers}
        </div>
      </div>
      <div className="card-body passenger-card-body">
        <h4 className="passenger-title">Number of Passengers</h4>
        <p className="today-text">Today</p>
        {error && <p className="text-danger">{error}</p>}
      </div>
    </div>
  );
}

export default Passenger;