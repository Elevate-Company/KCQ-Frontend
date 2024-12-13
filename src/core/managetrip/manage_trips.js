import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../css/managetrip/managetrips.css';
import ManageTripCard from './managetripcard';
import Navbar from '../navbar/navbar';

function ManageTrips() {
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [filter, setFilter] = useState('all');
  const cardCount = 100;
  const token = localStorage.getItem('accessToken');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://api.kcq-express.co/api/trips/', {
      headers: {
        'Authorization': `Token ${token}`,
      }
    })
    .then(response => {
      const fetchedTrips = response.data;
      setTrips(fetchedTrips);
      filterTrips(fetchedTrips, filter);
    })
    .catch(error => {
      console.error("Error fetching trips:", error);
    });
  }, [filter]);

  const filterTrips = (trips, filter) => {
    const currentDate = new Date();
    let filtered = [];

    if (filter === 'upcoming') {
      filtered = trips.filter((trip) => {
        const departureDate = new Date(trip.departure_time);
        return departureDate > currentDate;
      });
    } else if (filter === 'completed') {
      filtered = trips.filter((trip) => {
        const departureDate = new Date(trip.departure_time);
        return departureDate < currentDate;
      });
    } else {
      filtered = trips;
    }

    setFilteredTrips(filtered);
  };

  const displayedTrips = filteredTrips.slice(0, cardCount);

  return (
    <div>
      <Navbar />
      <div className="manage-trips-container">
        <div className="header-container">
          <h1 className="header">All Trips</h1>

          <input
            type="text"
            className="search-inputt"
            placeholder="Search Trip..."
          />

          <div className="d-flex align-items-center flex-wrap">
            <select
              className="filter-dropdown form-select me-2"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <button 
              type="button" 
              className="btn btn-primary btn-add-trip"
              style={{ backgroundColor: '#091057', borderColor: '#091057' }}
              onClick={() => navigate('/addtrip')}
            >
              +Add Trip
            </button>
          </div>
        </div>

        <div className="card-container mt-3">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>KCQ</th>
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
              {displayedTrips.length > 0 ? (
                displayedTrips.map((trip) => (
                  <ManageTripCard key={trip.id} trip={trip} />
                ))
              ) : (
                <tr>
                  <td colSpan="8">No trips available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ManageTrips;