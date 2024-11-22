import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import ticketImage from '../../assets/ticket.png'; 

function TicketSold() {
  const ticketsSold = 1200; 

  return (
    <div className="card shadow-sm border-0 mb-4 col-12 col-md-6 col-lg-4 position-relative">

      <img 
        src={ticketImage} 
        alt="Ticket" 
        style={{
          position: 'absolute', 
          top: '10px', 
          left: '10px', 
          width: '50px',
          height: 'auto',
          zIndex: 1
        }} 
      />
      <div className="card-body mt-5 fade-in-up">
        <h5 className="card-title">Total Tickets Sold This Month</h5>
        <p className="card-text">{ticketsSold} Tickets</p>
        <p>Today</p>
      </div>
    </div>
  );
}

export default TicketSold;
