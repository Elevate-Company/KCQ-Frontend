import React from 'react';
import '../../css/dashboard/ticket_sold.css'; 
import ticketImage from '../../assets/ticket.png'; 

function TicketSold() {
  const ticketsSold = 250; 

  return (
    <div className="card shadow-sm border-0 mb-4 col-12 col-md-6 col-lg-4 position-relative ticket-card">
      <div className="d-flex align-items-center p-3">
        <img 
          src={ticketImage} 
          alt="Ticket" 
          className="ticket-icon"
        />
        <span className="ticket-amount">{ticketsSold}</span>
      </div>
      <div className="card-body fade-in-up">
        <h4 className="card-title">Total Tickets Sold This Month</h4>
        <p>Today</p>
      </div>
    </div>
  );
}

export default TicketSold;
