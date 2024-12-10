import React from 'react';
import '../../css/manageticket/manageticket.css';
import TicketCard from './ticketcard';
import Navbar from '../navbar/navbar'; // Import Navbar component

function ManageTickets() {
  return (
    <div>
      <Navbar /> {/* Display Navbar at the very top */}
      <div className="manage-tickets-container">
        <div className="header-search-dropdown-row">
          <h1 className="header-ticket mt-3">Manage Ticket</h1>
          <div className="search-dropdown-container mt-3">
            <input type="text" className="search-input-ticket" placeholder="Search Ticket..." />
            <select className="filter-dropdown-ticket">
              <option value="all">All</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        

        <div className="ticket-cards-container">
          <TicketCard />
        </div>
      </div>
    </div>
  );
}

export default ManageTickets;