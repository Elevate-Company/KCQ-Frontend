import React, { useState, useEffect } from 'react';
import '../../css/manageticket/manageticket.css';
import TicketCard from './ticketcard';
import Navbar from '../navbar/navbar';
import axios from 'axios';
import { Pagination, Container, Spinner, Alert } from 'react-bootstrap';

// Define theme colors for consistent design
const THEME = {
  primary: '#0a215a',  // Dark blue
  secondary: '#071c4d', // Darker variant
  accent: '#e8f0fe',
  success: '#34a853',
  danger: '#ea4335',
  warning: '#fbbc04',
  light: '#f8f9fa'
};

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

  if (error) {
    return (
      <>
        <Navbar />
        <Container className="mt-5">
          <Alert variant="danger">{error}</Alert>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container className="py-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
          <h2 className="mb-3 mb-md-0" style={{ color: THEME.primary }}>Manage Tickets</h2>
          <div className="d-flex flex-column flex-md-row">
            <input 
              type="text" 
              className="form-control me-md-2 mb-2 mb-md-0" 
              placeholder="Search passenger name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ maxWidth: "250px" }}
            />
            <select
              className="form-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ maxWidth: "150px" }}
            >
              <option value="all">All</option>
              <option value="upcoming">Upcoming</option>
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
            <div className="text-center p-5 bg-light rounded">
              <p className="mb-0">No tickets found. Try adjusting your search or filter.</p>
            </div>
          )}
        </div>

        {filteredTickets.length > 0 && totalPages > 1 && (
          <div className="d-flex justify-content-center mt-4">
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
      </Container>
    </>
  );
}

export default ManageTickets;