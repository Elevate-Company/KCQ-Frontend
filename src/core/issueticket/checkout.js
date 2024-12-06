import React, { useEffect, useState } from 'react';
import Navbar from '../navbar/navbar';
import '../../css/issueticket/checkout.css';

function Checkout() {
  const [tickets, setTickets] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [cashAmount, setCashAmount] = useState('');

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

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    // Implement the logic for proceeding to payment
    alert(`Proceeding to payment with ${paymentMethod} method`);
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
            <label>
              <input
                type="radio"
                value="cash"
                checked={paymentMethod === 'cash'}
                onChange={handlePaymentMethodChange}
              />
              Cash Payment
            </label>
            <label>
              <input
                type="radio"
                value="online"
                checked={paymentMethod === 'online'}
                onChange={handlePaymentMethodChange}
              />
              Online Payment
            </label>
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
                    className="cash-input"
                  />
                </label>
              </div>
            )}
            {paymentMethod === 'online' && (
              <div className="online-payment">
                <p>Proceed with Online payment.</p>
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
      </div>
    </div>
  );
}

export default Checkout;