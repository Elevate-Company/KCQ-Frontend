import React, { useState, useEffect } from 'react';
import '../../css/manageticket/manageticket.css';
import TicketCard from './ticketcard';
import Navbar from '../navbar/navbar';
import axios from 'axios';
import { Pagination } from 'react-bootstrap';

function ManageTickets() {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3); // Show 3 tickets per page as requested

  const apiUrl = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';

  // Fetch tickets data on component mount
  useEffect(() => {
    fetchTickets();
  }, []);

  // Filter tickets whenever filter or search query changes
  useEffect(() => {
    filterAndSearchTickets();
  }, [filter, searchQuery, tickets]);

  const fetchTickets = async () => {
    setLoading(true);
    const token = localStorage.getItem('accessToken');
    
    try {
      const response = await axios.get(`${apiUrl}/api/tickets/`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      });
      
      setTickets(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setError('Failed to fetch tickets');
      setLoading(false);
    }
  };

  const filterAndSearchTickets = () => {
    const currentDate = new Date();
    
    // First, filter based on status
    let filtered = [];
    if (filter === 'upcoming') {
      filtered = tickets.filter(ticket => {
        return ticket.boarding_status === 'NOT_BOARDED' && 
               new Date(ticket.trip.departure_time) > currentDate;
      });
    } else if (filter === 'checkin') {
      filtered = tickets.filter(ticket => 
        ticket.boarding_status === 'CHECKED_IN'
      );
    } else if (filter === 'completed') {
      filtered = tickets.filter(ticket => 
        ticket.boarding_status === 'BOARDED'
      );
    } else if (filter === 'cancelled') {
      filtered = tickets.filter(ticket => 
        ticket.boarding_status === 'CANCELLED'
      );
    } else {
      filtered = tickets;
    }

    // Then, filter by passenger name if search query exists
    if (searchQuery.trim()) {
      filtered = filtered.filter(ticket => 
        ticket.passenger?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTickets(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Get current tickets for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTickets = filteredTickets.slice(indexOfFirstItem, indexOfLastItem);
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Previous and next page handlers
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="manage-tickets-container container text-center mt-5">
          <div className="spinner-border text-primary" role="status" style={{ color: '#0a215a' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="manage-tickets-container container mt-5">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="manage-tickets-container container">
        <div className="header-search-dropdown-row">
          <h1 className="header-ticket mt-3">Manage Ticket</h1>
          <div className="search-dropdown-container mt-3">
            <input 
              type="text" 
              className="search-input-ticket" 
              placeholder="Search passenger name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              className="filter-dropdown-ticket"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="upcoming">Upcoming</option>
              <option value="checkin">Checked In</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="ticket-cards-container">
          {currentTickets.length > 0 ? (
            currentTickets.map((ticket) => (
              <TicketCard key={ticket.id || ticket.ticket_number} ticket={ticket} />
            ))
          ) : (
            <div className="no-tickets-message text-center mt-5">
              <p>No tickets found. Try adjusting your search or filter.</p>
            </div>
          )}
        </div>

        {filteredTickets.length > 0 && (
          <div className="pagination-container mt-4 d-flex justify-content-center">
            <Pagination>
              <Pagination.Prev
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
              />
              
              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item 
                  key={index + 1} 
                  active={index + 1 === currentPage}
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              
              <Pagination.Next
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageTickets;