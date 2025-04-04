import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../navbar/navbar';
import '../../css/issueticket/checkout.css';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000'; // Use API base URL from .env or fallback
const STANDARD_PRICE = 400; // Define the standard ticket price

function Checkout() {
  const [tickets, setTickets] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [cashAmount, setCashAmount] = useState('');
  const [transactionNo, setTransactionNo] = useState('');
  const [baggageTickets, setBaggageTickets] = useState([]); // State for baggage tickets
  const [passengers, setPassengers] = useState([]); // State for passengers
  const navigate = useNavigate();

  useEffect(() => {
    const savedTickets = localStorage.getItem('tickets');
    const savedTotalAmount = localStorage.getItem('totalAmount');
    if (savedTickets) {
      const parsedTickets = JSON.parse(savedTickets);
      setTickets(parsedTickets);
      setBaggageTickets(parsedTickets.map(() => false)); // Initialize baggage tickets as false
    }
    if (savedTotalAmount) {
      setTotalAmount(parseFloat(savedTotalAmount));
    }

    // Fetch passengers from the API
    const fetchPassengers = async () => {
      const token = localStorage.getItem('accessToken');
      try {
        const response = await axios.get(`${apiUrl}/api/passengers/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        });
        setPassengers(response.data.passengers);
      } catch (error) {
        console.error('Error fetching passengers:', error);
        alert('Failed to fetch passengers');
      }
    };

    fetchPassengers();
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

  const handleBaggageTicketChange = (index) => {
    const updatedBaggageTickets = [...baggageTickets];
    updatedBaggageTickets[index] = !updatedBaggageTickets[index]; // Toggle the checkbox value
    setBaggageTickets(updatedBaggageTickets);
  };

  const calculateDiscount = (price) => {
    return STANDARD_PRICE - price; // Compute the discount based on the standard price
  };

  const handlePassengerSelect = (index, passengerId) => {
    const selectedPassenger = passengers.find((p) => p.id === passengerId);
    if (selectedPassenger) {
      const updatedTickets = [...tickets];
      updatedTickets[index] = {
        ...updatedTickets[index],
        passenger: {
          ...updatedTickets[index].passenger,
          name: selectedPassenger.name,
          email: selectedPassenger.email,
          phone: selectedPassenger.phone || '',
          total_bookings: selectedPassenger.total_bookings || '', // Fetch total bookings
          is_delete: selectedPassenger.is_delete || '', // Fetch is_delete
          boarding_status: selectedPassenger.boarding_status || '', // Fetch boarding status
        },
      };
      setTickets(updatedTickets);
    }
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

      // Transform tickets to match the required format
      const transformedTickets = tickets.map((ticket, index) => ({
        trip: {
          ferry_boat: {
            slug: ticket.trip?.ferry_boat?.slug || '',
          },
          origin: ticket.trip?.origin || '',
          destination: ticket.trip?.destination || '',
          departure_time: ticket.trip?.departure_time || '',
          arrival_time: ticket.trip?.arrival_time || '',
          available_seats: ticket.trip?.available_seats || '',
        },
        passenger: {
          name: ticket.passenger?.name || '',
          email: ticket.passenger?.email || '',
          phone: ticket.passenger?.phone || '',
          total_bookings: ticket.passenger?.total_bookings || 0,
          is_delete: ticket.passenger?.is_delete || false,
          boarding_status: ticket.passenger?.boarding_status || 'NOT_CHECKED_IN',
        },
        ticket_number: ticket.ticket_number || `TICKET-${Date.now()}-${index}`, // Generate unique ticket number
        seat_number: ticket.seat_number || '',
        age_group: ticket.age_group || 'adult',
        price: ticket.price || '',
        discount: calculateDiscount(ticket.price || 0), // Automatically compute the discount
        baggage_ticket: baggageTickets[index] || false, // Include baggage ticket value
        qr_code: '', // QR code will be generated by the backend
      }));

      // Debug: Log the transformed tickets
      console.log('Transformed Tickets:', JSON.stringify(transformedTickets, null, 2));

      // Check if transformedTickets is an array
      if (!Array.isArray(transformedTickets)) {
        console.error('Error: Transformed tickets is not an array.');
        return;
      }

      // Debug: Check for missing fields in each ticket
      transformedTickets.forEach((ticket, index) => {
        if (!ticket.trip || !ticket.passenger) {
          console.error(`Error: Missing trip or passenger data in ticket at index ${index}`, ticket);
        }
      });

      // Send the transformed tickets to the API
      const response = await axios.post(`${apiUrl}/api/tickets/`, transformedTickets, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      });

      alert('Tickets generated successfully');
      console.log(response.data);

      // Save the generated ticket data to localStorage
      localStorage.setItem('generatedTicket', JSON.stringify(response.data));

      // Navigate to the Ticket page
      navigate('/ticket'); // Redirect to the Ticket component
    } catch (error) {
      // Debug: Log the error response
      console.error('Error generating tickets:', error.response ? error.response.data : error.message);

      // Debug: Log the specific fields causing the issue
      if (error.response && error.response.data) {
        console.error('Error details:', error.response.data);
      }

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
              <th>Email</th>
              <th>Phone</th>
              <th>Total Bookings</th>
              <th>Boarding Status</th>
              <th>Baggage Ticket</th>
              <th>Amount</th>
              <th>Discount</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket, index) => (
              <tr key={index}>
                <td>
                  <select
                    value={ticket.passenger?.id || ''}
                    onChange={(e) => handlePassengerSelect(index, parseInt(e.target.value))}
                  >
                    <option value="">Select Passenger</option>
                    {passengers.map((passenger) => (
                      <option key={passenger.id} value={passenger.id}>
                        {passenger.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td>{ticket.passenger.email}</td>
                <td>{ticket.passenger.phone}</td>
                <td>{ticket.passenger.total_bookings}</td>
                <td>{ticket.passenger.boarding_status}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={baggageTickets[index]}
                    onChange={() => handleBaggageTicketChange(index)}
                  />
                </td>
                <td>PHP {ticket.amount}</td>
                <td>PHP {calculateDiscount(ticket.amount)}</td>
              </tr>
            ))}
            <tr>
              <td colSpan="7" style={{ textAlign: 'right', fontWeight: 'bold' }}>Total</td>
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