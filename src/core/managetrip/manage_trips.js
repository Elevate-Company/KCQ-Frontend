import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/managetrip/managetrips.css';  // Import the CSS file for ManageTrips
import TripMenu from './trip_menu';  // Import TripMenu component
import ManageTripCard from './managetripcard';  // Correct path for ManageTripCard
import Navbar from '../navbar/navbar';  // Import Navbar component

function ManageTrips() {
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [filter, setFilter] = useState('all');  // For managing the filter state
  const cardCount = 5;  // You can change this value to display more or fewer cards
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    // Fetch trips from the API
    axios.get('https://api.kcq-express.co/api/trips/', {
      headers: {
        'Authorization': `Token ${token}`,
      }
    })
    .then(response => {
      const fetchedTrips = response.data;
      setTrips(fetchedTrips);  // Set the fetched trips data
      filterTrips(fetchedTrips, filter);  // Apply filtering based on initial state
    })
    .catch(error => {
      console.error("Error fetching trips:", error);
    });
  }, [filter]);  // Re-fetch data when filter state changes

  // Function to filter trips based on the current date and selected filter
  const filterTrips = (trips, filter) => {
    const currentDate = new Date();  // Get current date and time
    let filtered = [];

    if (filter === 'upcoming') {
      filtered = trips.filter((trip) => {
        const departureDate = new Date(trip.departure_time);
        return departureDate > currentDate;  // Only trips with a future departure time
      });
    } else if (filter === 'completed') {
      filtered = trips.filter((trip) => {
        const departureDate = new Date(trip.departure_time);
        return departureDate < currentDate;  // Only trips that have already departed
      });
    } else {
      filtered = trips;  // 'all' filter, show all trips
    }

    setFilteredTrips(filtered);  // Set filtered trips
  };

  // Slice the array based on the cardCount value
  const displayedTrips = filteredTrips.slice(0, cardCount);

  return (
    <div>
      <Navbar /> {/* Display Navbar at the very top */}
      <div className="manage-trips-container">
        {/* Header and Search */}
        <div className="header-container">
          <h1 className="header">All Trips</h1>

          {/* Search component */}
          <input
            type="text"
            className="search-inputt"
            placeholder="Search Trip..."
            // You can implement a search feature if needed
          />

          {/* Dropdown filter */}
          <select
            className="filter-dropdown"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}  // Update filter state when selection changes
          >
            <option value="all">All</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* TripMenu.js */}
        <TripMenu className="mt-5" />

        {/* ManagetripCard.js */}
        <div className="card-container mt-3">
          {/* Loop through the displayedTrips array and render ManageTripCard for each trip */}
          {displayedTrips.length > 0 ? (
            displayedTrips.map((trip) => (
              <ManageTripCard key={trip.id} trip={trip} />
            ))
          ) : (
            <p>No trips available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageTrips;