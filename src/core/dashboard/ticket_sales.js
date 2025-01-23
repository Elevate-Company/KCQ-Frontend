import React, { useState, useEffect } from 'react';
import '../../css/dashboard/ticket_sales.css';
import axios from 'axios';

function TicketSales() {
  const [totalSales, setTotalSales] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTotalSales = async () => {
      const token = localStorage.getItem('accessToken');
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/tickets/`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
        });
        const data = response.data;
        const total = data.reduce((sum, ticket) => sum + parseFloat(ticket.price), 0);
        setTotalSales(total);
      } catch (error) {
        console.error('Error fetching ticket sales:', error);
        setError('Failed to fetch ticket sales');
      }
    };

    fetchTotalSales();
  }, []);

  return (
    <div className="card shadow-sm ticket-card border-0 mb-4 col-12 col-md-6 col-lg-4">
      <div className="card-body position-relative">
        <h3 className="card-title-ticketsales fw-bold">Recent Sales</h3>
        <p className=''>Total sales this month</p>
        <p className="card-text text-black fw-semibold fs-2">₱{totalSales.toFixed(2)}</p>
        {error && <p className="text-danger">{error}</p>}

        <div className="wave-container">
          <div className="wave wave1"></div>
          <div className="wave wave2"></div>
        </div>
      </div>
    </div>
  );
}

export default TicketSales;