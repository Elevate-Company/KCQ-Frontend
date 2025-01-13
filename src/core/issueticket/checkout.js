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
    const ticketData = {
      trip: {
        ferry_boat: {
          slug: "titanic"
        },
        origin: "montalban",
        destination: "kasiglahan",
        departure_time: "2025-01-13T07:55:47.042Z",
        arrival_time: "2025-01-13T07:55:47.042Z",
        available_seats: 2147483647
      },
      passenger: {
        name: "John Doe",
        email: "john.doe@example.com",
        contact: "1234567890",
        phone: "1234567890",
        total_bookings: 1,
        is_delete: false,
        boarding_status: "NOT_CHECKED_IN"
      },
      ticket_number: "12345",
      seat_number: "22A",
      age_group: "adult",
      price: "1000.00",
      discount: "100.00",
      baggage_ticket: true,
      qr_code: "https://api.kcq-express.co/media/tickets/qr_codes/21_qr.png"
    };

    try {
      const response = await axios.post('https://api.kcq-express.co/api/tickets/', ticketData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${localStorage.getItem('accessToken')}`,
        },
      });
      alert('Ticket generated successfully');
      console.log(response.data);
    } catch (error) {
      console.error('Error generating ticket:', error.response ? error.response.data : error.message);
      alert('Failed to generate ticket');
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