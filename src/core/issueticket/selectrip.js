import React, { useState, useEffect } from 'react';
import '../../css/issueticket/selectrip.css';
import boatLogo from '../../assets/boatlogo.png';
import axios from 'axios';

function SelectTrip({ trips, onSelect, error }) {
  const [selectedTripId, setSelectedTripId] = useState(null);
  const [tripsWithPassengerCount, setTripsWithPassengerCount] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (trips && trips.length > 0) {
      countPassengersForTrips();
    }
  }, [trips]);

  const countPassengersForTrips = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const apiUrl = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';
      
      // Create a map to store passenger counts for each trip
      const passengerCountMap = {};
      
      // Fetch tickets for each trip and count passengers
      for (const trip of trips) {
        try {
          const response = await axios.get(`${apiUrl}/api/tickets/by-trip/${trip.id}/`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${token}`,
            },
          });
          
          // Count active tickets (not cancelled)
          const activeTickets = response.data.filter(ticket => 
            ticket.boarding_status !== 'CANCELLED'
          );
          
          // Store the count for this trip
          passengerCountMap[trip.id] = activeTickets.length;
        } catch (error) {
          console.error(`Error fetching tickets for trip ${trip.id}:`, error);
          passengerCountMap[trip.id] = 0;
        }
      }
      
      // Add passenger count to each trip and calculate actual available seats
      const tripsWithCounts = trips.map(trip => {
        const passengerCount = passengerCountMap[trip.id] || 0;
        const actualAvailableSeats = Math.max(0, trip.available_seats - passengerCount);
        
        return {
          ...trip,
          passengerCount,
          actualAvailableSeats
        };
      });
      
      setTripsWithPassengerCount(tripsWithCounts);
      setLoading(false);
    } catch (error) {
      console.error('Error counting passengers for trips:', error);
      // If error, just use the original trips
      setTripsWithPassengerCount(trips.map(trip => ({
        ...trip,
        passengerCount: 0,
        actualAvailableSeats: trip.available_seats
      })));
      setLoading(false);
    }
  };

  if (error) {
    return <p>{error}</p>;
  }

  if (loading || !trips || trips.length === 0) {
    return <p>Loading...</p>;
  }

  const handleSelect = (trip) => {
    setSelectedTripId(trip.id);
    onSelect(trip);
    localStorage.setItem('selectedTrip', JSON.stringify(trip));
  };

  // Filter out trips with no available seats
  const availableTrips = tripsWithPassengerCount.filter(trip => trip.actualAvailableSeats > 0);

  if (availableTrips.length === 0) {
    return <p className="text-center py-4">No trips with available seats found.</p>;
  }

  return (
    <div className="select-trip-container">
      {availableTrips.map((trip) => {
        const departureDate = new Date(trip.departure_time);
        const formattedDate = departureDate.toLocaleDateString('en-PH', {
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
          timeZone: 'Asia/Manila'
        });

        return (
          <div key={trip.id} className="card-select-empty mb-4">
            <input
              type="radio"
              className="round-checkbox"
              checked={selectedTripId === trip.id}
              onChange={() => handleSelect(trip)}
            />
            <div className="card-content-selecttrip">
              <div className="boat-from-to-container">
                <img src={boatLogo} alt="Boat Logo" className="selectriplogo" />
                <div className="from-to-component">
                  <div className="from-section">
                    <p>From</p>
                    <h4>{trip.origin}</h4>
                  </div>
                  <div className="dashed-separator mt-4"></div>
                  <div className="to-section">
                    <p>To</p>
                    <h4>{trip.destination}</h4>
                  </div>
                </div>
              </div>
              <div className="additional-info mt-4">
                <div className="date-section">
                  <h4>{formattedDate}</h4>
                </div>
                <div className="boat-number-section">
                  <h4>{trip.id}</h4>
                </div>
                <div className="boat-type-section">
                  <h4>{trip.ferry_boat.slug}</h4>
                </div>
                <div className="seats-section">
                  <h4>
                    <span className="available-seats-badge">
                      <i className="fas fa-users me-1"></i> {trip.actualAvailableSeats} seats available
                    </span>
                  </h4>
                </div>
                <div className="price-section">
                  <h4 className="price">PHP 400</h4>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}  

export default SelectTrip;