import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../navbar/navbar';
import '../../css/issueticket/checkout.css';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';
const STANDARD_PRICE = 400;

function Checkout() {
  const [tickets, setTickets] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [baggageTickets, setBaggageTickets] = useState([]);
  const [username, setUsername] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedTickets = localStorage.getItem('tickets');
    const savedTotalAmount = localStorage.getItem('totalAmount');
    const usernameID = localStorage.getItem('username');
    setUsername(usernameID);

    if (savedTickets) {
      const parsedTickets = JSON.parse(savedTickets).map((ticket) => ({
        ...ticket,
        passenger: {
          ...ticket.passenger,
          total_bookings: ticket.passenger?.total_bookings || 0,
          is_delete: ticket.passenger?.is_delete || false,
          boarding_status: ticket.passenger?.boarding_status || 'NOT_CHECKED_IN',
          created_by: usernameID || 'Unknown',
        },
      }));
      setTickets(parsedTickets);
      setBaggageTickets(parsedTickets.map((ticket) => ticket.baggage_ticket || false));
      console.log('Fetched Tickets:', parsedTickets);
    }
    if (savedTotalAmount) {
      setTotalAmount(parseFloat(savedTotalAmount));
      console.log('Total Amount:', savedTotalAmount);
    }
  }, []);

  const handleBaggageTicketChange = (index) => {
    const updatedBaggageTickets = [...baggageTickets];
    updatedBaggageTickets[index] = !updatedBaggageTickets[index];
    setBaggageTickets(updatedBaggageTickets);

    const updatedTickets = [...tickets];
    updatedTickets[index].baggage_ticket = updatedBaggageTickets[index];
    setTickets(updatedTickets);
  };

  const calculateDiscount = (price) => {
    return STANDARD_PRICE - price;
  };

  const normalizeAgeGroup = (ageGroup) => {
    // Convert display format to lowercase API format
    const group = ageGroup.toLowerCase();
    switch (group) {
      case 'adult':
        return 'adult';
      case 'child':
        return 'child';
      case 'senior':
        return 'senior';
      case 'student':
        return 'student';
      case 'infant':
        return 'infant';
      default:
        return 'adult';
    }
  };

  const handleGenerateTicket = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert('No access token found. Please log in.');
        return;
      }

      setIsGenerating(true);
      setError(null);

      const generatedTickets = [];

      for (let i = 0; i < tickets.length; i++) {
        const ticket = tickets[i];

        if (!ticket.trip || !ticket.passenger) {
          console.error(`Missing trip or passenger data for ticket ${i + 1}`);
          setError(`Missing trip or passenger data for ticket ${i + 1}`);
          continue;
        }

        // Flatten the ticket data structure to avoid nested serializers issue
        const transformedTicket = {
          trip_id: ticket.trip.id, // Send trip ID instead of nested trip object
          passenger_id: ticket.passenger.id, // Send passenger ID instead of nested passenger object
          ticket_number: ticket.ticket_number || `TICKET-${Date.now()}-${i}`,
          seat_number: ticket.seat_number || '',
          age_group: normalizeAgeGroup(ticket.age_group || ticket.passenger?.type || 'adult'),
          price: parseFloat(ticket.price || STANDARD_PRICE),
          discount: parseFloat(calculateDiscount(ticket.price || STANDARD_PRICE)),
          baggage_ticket: Boolean(ticket.baggage_ticket)
        };

        // Debug logging
        console.log('Original ticket:', ticket);
        console.log('Transformed ticket:', transformedTicket);

        try {
          const response = await axios.post(`${apiUrl}/api/tickets/`, transformedTicket, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Token ${token}`,
            },
          });
          console.log('Ticket Posted Successfully:', response.data);
          generatedTickets.push(response.data);
        } catch (err) {
          console.error(`Error posting ticket ${i + 1}:`, err.response?.data || err.message);
          throw new Error(`Failed to post ticket for ${ticket.passenger?.name || 'passenger'}. ${err.response?.data?.detail || err.message}`);
        }
      }

      localStorage.setItem('generatedTickets', JSON.stringify(generatedTickets));
      navigate('/ticket', { state: { tickets: generatedTickets } });
    } catch (error) {
      console.error('Ticket generation failed:', error);
      setError(error.message || 'Failed to generate tickets');
    } finally {
      setIsGenerating(false);
    }
  };

  const isGenerateButtonDisabled = () => {
    return isGenerating || tickets.length === 0;
  };

  return (
    <div>
      <Navbar />
      <div className="checkout-container mt-5">
        <h3>Checkout</h3>
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="table-responsive">
          <table className="checkout-table mt-2">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Total Bookings</th>
                <th>Boarding Status</th>
                <th>Created By</th>
                <th>Ticket Number</th>
                <th>Seat Number</th>
                <th>Age Group</th>
                <th>Trip</th>
                <th>Amount</th>
                <th>Discount</th>
                <th>Baggage Ticket</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket, index) => (
                <tr key={index}>
                  <td>{ticket.passenger?.name || 'N/A'}</td>
                  <td>{ticket.passenger?.email || 'N/A'}</td>
                  <td>{ticket.passenger?.phone || 'N/A'}</td>
                  <td>{ticket.passenger?.total_bookings || 0}</td>
                  <td>{ticket.passenger?.boarding_status || 'NOT_CHECKED_IN'}</td>
                  <td>{ticket.passenger?.created_by || username || 'Unknown'}</td>
                  <td>{ticket.ticket_number || `TICKET-${index}`}</td>
                  <td>{ticket.seat_number || 'N/A'}</td>
                  <td>{ticket.passenger?.type || 'adult'}</td>
                  <td>{ticket.trip?.origin || 'N/A'} to {ticket.trip?.destination || 'N/A'}</td>
                  <td>PHP {ticket.price || STANDARD_PRICE}</td>
                  <td>PHP {calculateDiscount(ticket.price || STANDARD_PRICE)}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={baggageTickets[index] || false}
                      onChange={() => handleBaggageTicketChange(index)}
                    />
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan="11" style={{ textAlign: 'right', fontWeight: 'bold' }}>Total</td>
                <td colSpan="3" style={{ fontWeight: 'bold' }}>PHP {totalAmount}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="generate-ticket-btn-container mt-4">
          <button
            type="button"
            className="btn btn-primary generate-ticket-btn"
            onClick={handleGenerateTicket}
            disabled={isGenerateButtonDisabled()}
          >
            {isGenerating ? 'Generating Tickets...' : 'Generate Ticket'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;