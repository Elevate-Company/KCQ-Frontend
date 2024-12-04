import React from 'react';
import '../../css/dashboard/ticket_sales.css';

function TicketSales() {
  const totalSales = 28000;

  return (
    <div className="card shadow-sm ticket-card border-0 mb-4 col-12 col-md-6 col-lg-4">
      <div className="card-body position-relative">
        <h3 className="card-title-ticketsales">Recent Sales</h3>
        <p>Total sales this month</p>
        <p className="card-text">${totalSales}</p>

        <div className="wave-container">
          <div className="wave wave1"></div>
          <div className="wave wave2"></div>
        </div>
      </div>
    </div>
  );
}

export default TicketSales;