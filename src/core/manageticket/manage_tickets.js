import React from 'react';
import '../../css/manageticket/manageticket.css';
import TicketCard from './ticketcard';

function ManageTrips() {
  return (
    <div className="manage-trips-container">
      <div className="header-search-dropdown-row">
        <h1 className="header-ticket">Manage Ticket</h1>
        <div className="search-dropdown-container">
          <input type="text" className="search-input-ticket" placeholder="Search Trip..." />
          <select className="filter-dropdown-ticket">
            <option value="all">All</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="empty-card-ticket">
        <div className="card-content-ticket">
          <div className="destination-ticket">DESTINATION</div>
          <div className="destination-ticket">
            CUSTOMER
            <i className="fas fa-sort unsorted-icon-ticket"></i>
          </div>
          <div className="destination-ticket">ID</div>
          <div className="boat-type-ticket">TYPE BOAT</div>
          <div className="capacity-ticket">CAPACITY</div>
        </div>
      </div>

      <div className="ticket-cards-container">
        <TicketCard />
        <TicketCard />
        <TicketCard />
      </div>
    </div>
  );
}

export default ManageTrips;
