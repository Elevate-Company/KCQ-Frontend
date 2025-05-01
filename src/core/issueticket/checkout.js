import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../navbar/navbar';
import '../../css/issueticket/checkout.css';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';
const STANDARD_PRICE = 400;

// Validation helper function
const validateTicketData = (ticket) => {
  if (!ticket.trip) throw new Error('Trip ID is required');
  if (!ticket.passenger) throw new Error('Passenger ID is required');
  if (!ticket.age_group) throw new Error('Age group is required');
  if (!ticket.price) throw new Error('Price is required');
  
  return true;
};

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
      const parsedTickets = JSON.parse(savedTickets);
      console.log('Raw tickets from localStorage:', parsedTickets);
      
      const validatedTickets = parsedTickets.map((ticket) => {
        console.log('Processing ticket:', ticket);
        if (!ticket.trip?.id || !ticket.passenger?.id) {
          console.error('Missing required IDs:', ticket);
        }
        return {
          ...ticket,
          passenger: {
            ...ticket.passenger,
            total_bookings: ticket.passenger?.total_bookings || 0,
            is_delete: ticket.passenger?.is_delete || false,
            boarding_status: ticket.passenger?.boarding_status || 'NOT_CHECKED_IN',
            created_by: usernameID || 'Unknown',
          },
        };
      });
      
      setTickets(validatedTickets);
      setBaggageTickets(validatedTickets.map((ticket) => ticket.baggage_ticket || false));
      console.log('Processed tickets:', validatedTickets);
    }
    if (savedTotalAmount) {
      setTotalAmount(parseFloat(savedTotalAmount));
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
    const validGroups = ['adult', 'child', 'student', 'senior', 'infant'];
    const group = ageGroup.toLowerCase();
    return validGroups.includes(group) ? group : 'adult';
  };

  const handleGenerateTicket = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert('No access token found. Please log in.');
        return;
      }

      // Prevent duplicate submissions
      if (isGenerating) {
        return;
      }

      setIsGenerating(true);
      setError(null);

      const generatedTickets = [];
      const processedTicketNumbers = new Set(); // Track processed ticket numbers

      for (let i = 0; i < tickets.length; i++) {
        const ticket = tickets[i];

        // Skip if we've already processed this ticket number
        if (processedTicketNumbers.has(ticket.ticket_number)) {
          console.log('Skipping duplicate ticket:', ticket.ticket_number);
          continue;
        }

        // Early validation of required fields
        if (!ticket.trip?.id) {
          throw new Error(`Missing trip ID for ticket ${i + 1}`);
        }
        if (!ticket.passenger?.id) {
          throw new Error(`Missing passenger ID for ${ticket.passenger?.name || 'unknown passenger'}`);
        }

        const transformedTicket = {
          trip_id: parseInt(ticket.trip.id),
          passenger_id: parseInt(ticket.passenger.id),
          ticket_number: ticket.ticket_number || `TICKET-${Date.now()}-${i}`,
          seat_number: ticket.seat_number || '',
          age_group: normalizeAgeGroup(ticket.age_group || 'adult'),
          price: parseFloat(ticket.price || STANDARD_PRICE),
          discount: parseFloat(calculateDiscount(ticket.price || STANDARD_PRICE)),
          baggage_ticket: Boolean(baggageTickets[i])
        };

        try {
          console.log('Sending ticket data:', transformedTicket);  // Add this debug line
          const response = await axios.post(`${apiUrl}/api/tickets/`, transformedTicket, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Token ${token}`,
            },
          });
          console.log('Ticket Posted Successfully:', response.data);
          generatedTickets.push(response.data);
          processedTicketNumbers.add(ticket.ticket_number); // Mark as processed
        } catch (err) {
          // If it's a duplicate error, skip this ticket
          if (err.response?.data?.error?.includes('UNIQUE constraint failed')) {
            console.log('Ticket already exists:', ticket.ticket_number);
            continue;
          }
          console.error('Full error response:', err.response);
          const errorDetails = err.response?.data || {};
          const errorMessage = Object.entries(errorDetails)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ') || err.message;
          throw new Error(`Failed to post ticket for ${ticket.passenger?.name || 'passenger'}: ${errorMessage}`);
        }
      }

      if (generatedTickets.length > 0) {
        // Clear tickets from localStorage only after successful generation
        localStorage.removeItem('tickets');
        localStorage.removeItem('totalAmount');
        localStorage.setItem('generatedTickets', JSON.stringify(generatedTickets));
        navigate('/ticket', { state: { tickets: generatedTickets } });
      } else {
        setError('No new tickets were generated. They may already exist.');
      }
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

  // Rest of the component remains the same
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