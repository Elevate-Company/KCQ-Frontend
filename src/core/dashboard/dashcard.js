import React, { useState, useEffect } from 'react';
import '../../css/dashboard/dashcard.css';
import TicketSales from './ticket_sales';
import TicketSold from './ticket_sold';
import AvailableBoat from './available_boat';
import Passenger from './passenger';
import UpcomingTripCard from './upcomingtripcard';

const DashCard = () => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const usernameID = localStorage.getItem('username');
    setUsername(usernameID);
  }, []);

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-12 col-lg-15">
          <div className="card no-shadow-no-border mb-4">
            <div className="card-body">
              <h2 className="card-title">Welcome, {username}!</h2>

              <div className="d-flex flex-wrap justify-content-between">
                <TicketSales />
                <TicketSold />
                <AvailableBoat />
                <Passenger />
              </div>

              <div className="mt-4">
                <UpcomingTripCard />
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
};

export default DashCard;