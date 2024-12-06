import React, { useEffect, useState } from 'react';
import Navbar from '../navbar/navbar';
import '../../css/issueticket/checkout.css';

function Checkout() {
  const [tickets, setTickets] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const savedTickets = localStorage.getItem('tickets');
    const savedTotalAmount = localStorage.getItem('totalAmount');
    if (savedTickets) {
      setTickets(JSON.parse(savedTickets));
    }
    if (savedTotalAmount) {
      setTotalAmount(parseFloat(savedTotalAmount));
    }
  }, []);

  return (
    <div>
      <Navbar />
      <div className="checkout-container mt-5">
        <h3>Checkout</h3>
        <table className="checkout-table mt-2">
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact Number</th>
              <th>Email</th>
              <th>Passenger Type</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket, index) => (
              <tr key={index}>
                <td>{ticket.passenger.name}</td>
                <td>{ticket.passenger.contact}</td>
                <td>{ticket.passenger.email}</td>
                <td>{ticket.passenger.type}</td>
                <td>PHP {ticket.amount}</td>
              </tr>
            ))}
            <tr>
              <td colSpan="4" style={{ textAlign: 'right', fontWeight: 'bold' }}>Total</td>
              <td style={{ fontWeight: 'bold' }}>PHP {totalAmount}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Checkout;