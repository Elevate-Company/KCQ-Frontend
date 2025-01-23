import React, { useState, useEffect } from 'react';
import '../../css/manageticket/manageticket.css';
import TicketCard from './ticketcard';
import Navbar from '../navbar/navbar';

function ManageTickets() {
  const [tickets, setTickets] = useState([
    {
      id: 1,
      trip: {
        departure_time: '2024-12-13T00:05:00Z',
      },
      status: 'upcoming',
    },
  ]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    filterTickets(tickets, filter);
  }, [filter, tickets]);

  const filterTickets = (tickets, filter) => {
    const currentDate = new Date();
    let filtered = [];

    if (filter === 'upcoming') {
      filtered = tickets.filter((ticket) => {
        const departureDate = new Date(ticket.trip.departure_time);
        return departureDate > currentDate;
      });
    } else if (filter === 'completed') {
      filtered = tickets.filter((ticket) => {
        const departureDate = new Date(ticket.trip.departure_time);
        return departureDate < currentDate;
      });
    } else {
      filtered = tickets;
    }

    setFilteredTickets(filtered);
  };

  return (
    <div>
      <Navbar />
      <div className="manage-tickets-container container">
        <div className="header-search-dropdown-row">
          <h1 className="header-ticket mt-3">Manage Ticket</h1>
          <div className="search-dropdown-container mt-3">
            <input type="text" className="search-input-ticket" placeholder="Search Ticket..." />
            <select
              className="filter-dropdown-ticket"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="ticket-cards-container">
          {filteredTickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ManageTickets;