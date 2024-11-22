import React from 'react';
import '../../css/managetrip/trip_menu.css';

function TripMenu() {
  return (
    <div className="navbar-card2 mt-4">
      <div className="trip-info-row">
        <p className="destination" >DESTINATION</p>
        <p className='date'>DEPARTURE DATE</p>
        <p className='ID'>ID</p>
        <p className='boat'>TYPE BOAT</p>
        <p className='capacity'>CAPACITY</p>
      </div>
    </div>
  );
}

export default TripMenu;
