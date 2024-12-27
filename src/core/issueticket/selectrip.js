import React, { useState } from 'react';
import '../../css/issueticket/selectrip.css';
import boatLogo from '../../assets/boatlogo.png';

function SelectTrip({ trips, onSelect, error }) {
  const [selectedTripId, setSelectedTripId] = useState(null);

  if (error) {
    return <p>{error}</p>;
  }

  if (!trips || trips.length === 0) {
    return <p>Loading...</p>;
  }

  const handleSelect = (trip) => {
    setSelectedTripId(trip.id);
    onSelect(trip);
    localStorage.setItem('selectedTrip', JSON.stringify(trip));
  };

  return (
    <div className="select-trip-container">
      {trips.map((trip) => {
        const departureDate = new Date(trip.departure_time);
        const formattedDate = departureDate.toLocaleDateString('en-US', {
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
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