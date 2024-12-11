import React, { useState, useEffect } from 'react';
import '../../css/dashboard/available_boat.css';
import boatImage from '../../assets/boat.png';
import axios from 'axios';

function AvailableBoat() {
  const [boatCount, setBoatCount] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBoatCount = async () => {
      const token = localStorage.getItem('accessToken');
      console.log('Token:', token);
      try {
        const response = await axios.get('https://api.kcq-express.co/api/ferry-boats/', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
        });

        const data = response.data;
        console.log('Response data:', data);
        setBoatCount(data.length); 
      } catch (error) {
        console.error('Error fetching boat count:', error);
        setError('Failed to fetch boat count');
      }
    };

    fetchBoatCount();
  }, []);

  return (
    <div className="card available-boat-card shadow-sm border-0 mb-4 col-12 col-md-6 col-lg-4">
      <div className="d-flex align-items-center p-3">
        <img 
          src={boatImage} 
          alt="Boat" 
          className="boat-image" 
        />
        <span className="boat-count ms-3">{error ? <span className="text-danger">{error}</span> : `${boatCount} Boats`}</span>
      </div>
      <div className="card-body card-body-content">
        <h4 className="available-boat-title">Number of Available Boats</h4>
        <p>Today</p>
      </div>
    </div>
  );
}

export default AvailableBoat;
