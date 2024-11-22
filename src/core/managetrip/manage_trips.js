import React from 'react';
import '../../css/managetrip/managetrips.css';  // Import the CSS file for ManageTrips
import TripMenu from './trip_menu';  // Import TripMenu component
import ManageTripCard from './managetripcard';  // Correct path for ManageTripCard

function ManageTrips() {
  // Define the number of cards to display
  const cardCount = 5;  // You can change this value to display more or fewer cards

  // Array of trip data
  const trips = [
    { id: 1, from: 'Cebu', to: 'Bohol', date: 'January 15, 2024', type: 'Pumboat Express', capacity: 150 },
    { id: 2, from: 'Manila', to: 'Palawan', date: 'February 20, 2024', type: 'Ferry', capacity: 200 },
    { id: 3, from: 'Davao', to: 'Cebu', date: 'March 10, 2024', type: 'Speedboat', capacity: 100 },
    { id: 4, from: 'Cebu', to: 'Davao', date: 'April 10, 2024', type: 'Jetboat', capacity: 120 },
    { id: 5, from: 'Bohol', to: 'Cebu', date: 'May 5, 2024', type: 'Pumboat Express', capacity: 150 },
    // Add more trip objects as needed
  ];

  // Slice the array based on the cardCount value
  const displayedTrips = trips.slice(0, cardCount);

  return (
    <div className="manage-trips-container">
      {/* Header and Search */}
      <div className="header-container">
        <h1 className="header">All Trips</h1>

        {/* Search component */}
        <input type="text" className="search-inputt" placeholder="Search Trip..." />

        {/* Dropdown filter */}
        <select className="filter-dropdown">
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
        {displayedTrips.map((trip) => (
          <ManageTripCard key={trip.id} trip={trip} />
        ))}
      </div>
    </div>
  );
}

export default ManageTrips;
