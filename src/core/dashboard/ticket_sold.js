import React, { useState, useEffect } from 'react';
import '../../css/dashboard/ticket_sold.css'; 
import ticketImage from '../../assets/ticket.png'; 
import axios from 'axios';

function TicketSold() {
  const [ticketsSold, setTicketsSold] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTicketsSold = async () => {
      const token = localStorage.getItem('accessToken');
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/tickets/`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
        });
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        setTicketsSold(response.data.length); 
      } catch (error) {
        console.error('Error fetching tickets:', error);
        setError('Failed to fetch tickets');
      }
    };

    fetchTicketsSold();
  }, []);

  return (
    <div className="card shadow-sm border-0 mb-4 col-12 col-md-6 col-lg-4 position-relative ticket-card">
      <div className="d-flex align-items-center ticket-header">
        <img 
          src={ticketImage} 
          alt="Ticket" 
          className="ticket-icon"
        />
        <span className="ticket-amount">{ticketsSold}</span>
      </div>
      <div className="card-body fade-in-up">
        <h4 className="card-title mt-4">Total Tickets Sold</h4>
        {error && <p className="text-danger">{error}</p>}
        <p className="today-text">Today</p>
      </div>
    </div>
  );
}

export default TicketSold;