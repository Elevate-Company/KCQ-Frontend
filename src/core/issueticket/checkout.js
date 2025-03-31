import React, { useEffect, useState } from 'react';
import Navbar from '../navbar/navbar';
import '../../css/issueticket/checkout.css';
import axios from 'axios';

function Checkout() {
  const [tickets, setTickets] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [cashAmount, setCashAmount] = useState('');
  const [transactionNo, setTransactionNo] = useState('');

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

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleCashAmountChange = (e) => {
    setCashAmount(e.target.value);
  };

  const handleTransactionNoChange = (e) => {
    setTransactionNo(e.target.value);
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    alert(`Proceeding to payment with ${paymentMethod} method`);
  };

  const handleGenerateTicket = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert('No access token found. Please log in.');
        return;
      }

      const response = await axios.post('https://api.kcq-express.co/api/tickets/', tickets, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      });

      alert('Tickets generated successfully');
      console.log(response.data);
    } catch (error) {
      console.error('Error generating tickets:', error.response ? error.response.data : error.message);
      alert('Failed to generate tickets');
    }
  };

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
        <div className="payment-section mt-4">
          <div className="payment-methods">
            <label htmlFor="payment-method">Payment Method:</label>
            <select
              id="payment-method"
              value={paymentMethod}
              onChange={handlePaymentMethodChange}
              className="form-select"
            >
              <option value="cash">Cash Payment</option>
              <option value="online">Online Payment</option>
            </select>
          </div>
          <div className="vertical-line"></div>
          <div className="payment-details">
            {paymentMethod === 'cash' && (
              <div className="cash-payment">
                <label>
                  Enter Amount:
                  <input
                    type="number"
                    value={cashAmount}
                    onChange={handleCashAmountChange}
                    className="cash-input mt-3"
                  />
                </label>
              </div>
            )}
            {paymentMethod === 'online' && (
              <div className="online-payment">
                <label>
                  Enter Transaction No.:
                  <input
                    type="text"
                    value={transactionNo}
                    onChange={handleTransactionNoChange}
                    className="transaction-input mt-3"
                  />
                </label>
              </div>
            )}
            <div className="payment-btn-container">
              <button
                type="button"
                className="payment-btn mt-3"
                onClick={handleProceedToPayment}
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
        <div className="generate-ticket-btn-container mt-4">
          <button
            type="button"
            className="generate-ticket-btn"
            onClick={handleGenerateTicket}
          >
            Generate Ticket
          </button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;