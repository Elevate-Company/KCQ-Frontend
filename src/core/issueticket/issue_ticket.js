import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/issueticket/issueticket.css';
import SelectTrip from './selectrip';
import axios from 'axios';
import Navbar from '../navbar/navbar';
import { toast } from 'react-toastify';

function IssueTicket() {
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState('');
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [passengerName, setPassengerName] = useState('');
  const [passengerEmail, setPassengerEmail] = useState('');
  const [passengerPhone, setPassengerPhone] = useState('');
  const [ticketNumber, setTicketNumber] = useState('');
  const [seatNumber, setSeatNumber] = useState('');
  const [passengerType, setPassengerType] = useState('adult');
  const [tickets, setTickets] = useState(() => {
    const savedTickets = localStorage.getItem('tickets');
    return savedTickets ? JSON.parse(savedTickets) : [];
  });
  const [price, setPrice] = useState(400);
  const [passengers, setPassengers] = useState([]);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      const token = localStorage.getItem('accessToken');
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/trips/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        });

        const data = response.data;
        const filteredTrips = data.filter(trip => {
          const departureDate = new Date(trip.departure_time);
          const currentDate = new Date();
          return departureDate >= currentDate;
        });

        setTrips(filteredTrips);
      } catch (error) {
        console.error('Error fetching trips:', error);
        setError('Failed to fetch trips');
      }
    };

    const fetchPassengers = async () => {
      const token = localStorage.getItem('accessToken');
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/passengers/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        });

        const passengersData = response.data.passengers;
        
        // For each passenger, get their tickets
        const passengersWithTickets = await Promise.all(
          passengersData.map(async (passenger) => {
            try {
              // Get tickets issued to this passenger
              const ticketsResponse = await axios.get(
                `${process.env.REACT_APP_API_BASE_URL}/api/tickets/by-passenger/${passenger.id}/`,
                {
                  headers: {
                    Authorization: `Token ${token}`,
                  },
                }
              );
              
              // Count the tickets
              const ticketCount = ticketsResponse.data.length || 0;
              
              // Return passenger with ticket count
              return {
                ...passenger,
                total_checked_tickets: ticketCount
              };
            } catch (error) {
              console.error(`Error fetching tickets for passenger ${passenger.id}:`, error);
              return {
                ...passenger,
                total_checked_tickets: 0
              };
            }
          })
        );

        setPassengers(passengersWithTickets);
      } catch (error) {
        console.error('Error fetching passengers:', error);
        setError('Failed to fetch passengers');
      }
    };

    const usernameID = localStorage.getItem('username');
    setUsername(usernameID);

    fetchTrips();
    fetchPassengers();
  }, []);

  useEffect(() => {
    localStorage.setItem('tickets', JSON.stringify(tickets));
  }, [tickets]);

  const calculateAmount = (type) => {
    const basePrice = 400;
    switch (type) {
      case 'student':
      case 'senior':
        return basePrice * 0.8;
      case 'child':
        return basePrice * 0.5;
      case 'infant':
        return 0;
      default:
        return basePrice;
    }
  };

  const getAgeGroup = (type) => {
    switch (type.toLowerCase()) {
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

  const handlePassengerTypeChange = (e) => {
    const selectedType = e.target.value;
    setPassengerType(selectedType);
    setPrice(calculateAmount(selectedType));
  };

  const handlePassengerSelect = (e) => {
    const selectedPassengerId = e.target.value;
    const selectedPassenger = passengers.find(p => p.id === parseInt(selectedPassengerId));
    if (selectedPassenger) {
      setPassengerName(selectedPassenger.name);
      setPassengerEmail(selectedPassenger.email);
      setPassengerPhone(selectedPassenger.phone);

      const passengerData = {
        id: selectedPassenger.id, // Add the ID
        name: selectedPassenger.name,
        email: selectedPassenger.email,
        phone: selectedPassenger.phone,
        total_bookings: selectedPassenger.total_checked_tickets || 'N/A',
        boarding_status: selectedPassenger.boarding_status || 'NOT_CHECKED_IN',
        created_by: username || 'Unknown',
      };

      localStorage.setItem('selectedPassenger', JSON.stringify(passengerData));
    }
  };

  const handleAddTicket = () => {
    const storedPassenger = JSON.parse(localStorage.getItem('selectedPassenger'));
    if (!storedPassenger) {
      toast.error('Please select a passenger.');
      return;
    }

    if (!storedPassenger.id) {
      toast.error('Invalid passenger data. Please select a passenger again.');
      return;
    }

    if (!ticketNumber.trim()) {
      toast.error('Ticket number is required.');
      return;
    }

    if (!seatNumber.trim()) {
      toast.error('Seat number is required.');
      return;
    }

    const selectedTrip = JSON.parse(localStorage.getItem('selectedTrip'));
    if (!selectedTrip || !selectedTrip.id) {
      toast.error('Please select a trip before adding a ticket.');
      return;
    }

    // Verify that the trip has the necessary data
    if (!selectedTrip.origin || !selectedTrip.destination || !selectedTrip.departure_time) {
      toast.error('Selected trip has incomplete information. Please select another trip.');
      return;
    }
    
    const newTicket = {
      passenger: {
        ...storedPassenger,
        type: passengerType,
      },
      ticket_number: ticketNumber,
      seat_number: seatNumber,
      age_group: passengerType.toLowerCase(),  // Use lowercase directly
      price: price,
      trip: selectedTrip,
      amount: calculateAmount(passengerType),
      baggage_ticket: false,
      boarding_status: 'NOT_BOARDED',
    };

    // Verify the passenger ID is present in the ticket data
    console.log('Creating ticket with passenger ID:', storedPassenger.id);
    setTickets([newTicket]);
    toast.success('Ticket added successfully!');

    setPassengerName('');
    setPassengerEmail('');
    setPassengerPhone('');
    setTicketNumber('');
    setSeatNumber('');
    setPassengerType('adult');
    setPrice(400);
  };

  const handleBaggageTicketChange = () => {
    const updatedTickets = [...tickets];
    updatedTickets[0].baggage_ticket = !updatedTickets[0].baggage_ticket;
    setTickets(updatedTickets);
  };

  const calculateTotalAmount = () => {
    return tickets.reduce((total, ticket) => total + ticket.amount, 0);
  };

  const handleProceedToCheckout = () => {
    localStorage.setItem('tickets', JSON.stringify(tickets));
    localStorage.setItem('totalAmount', calculateTotalAmount());
    navigate('/checkout');
  };

  const handleAddPassenger = () => {
    navigate('/add-passenger');
  };

  return (
    <div>
      <Navbar />
      <div className="issue-ticket-container mt-5">
        <div className="cards-row">
          <div className="card-select-issue select-card">
            <div className="card-select">
              Select Trip
            </div>
            <SelectTrip trips={trips} onSelect={setSelectedTrip} error={error} />
          </div>

          <div className="card-contact-issue contact-card">
            <div className="card-contact">
              <div className="d-flex justify-content-between align-items-center">
                <h3>New Ticket</h3>
                <button className="btn btn-primary add-btn" onClick={handleAddPassenger}>+ Add</button>
              </div>
              <form className="contact-form">
                <label>
                  Select Passenger:
                  <select onChange={handlePassengerSelect}>
                    <option value="">Select a passenger</option>
                    {passengers.map(passenger => (
                      <option key={passenger.id} value={passenger.id}>
                        {passenger.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Passenger Name:
                  <input
                    type="text"
                    placeholder="Name"
                    value={passengerName}
                    readOnly
                  />
                </label>
                <label>
                  Passenger Email:
                  <input
                    type="text"
                    placeholder="Email"
                    value={passengerEmail}
                    readOnly
                  />
                </label>
                <label>
                  Passenger Phone:
                  <input
                    type="text"
                    placeholder="Phone"
                    value={passengerPhone}
                    readOnly
                  />
                </label>
                <label>
                  Ticket Number:
                  <input
                    type="text"
                    placeholder="Ticket Number"
                    value={ticketNumber}
                    onChange={(e) => setTicketNumber(e.target.value)}
                  />
                </label>
                <label>
                  Seat Number:
                  <input
                    type="text"
                    placeholder="Seat Number"
                    value={seatNumber}
                    onChange={(e) => setSeatNumber(e.target.value)}
                  />
                </label>
                <label>
                  Passenger Type:
                  <select
                    value={passengerType}
                    onChange={handlePassengerTypeChange}
                  >
                    <option value="adult">adult</option>
                    <option value="child">child - (4-10 yrs old)</option>
                    <option value="senior">senior - (65 yrs old)</option>
                    <option value="student">student</option>
                    <option value="infant">infant - (1-3 yrs old)</option>
                  </select>
                </label>
                <hr />
                <div className="total-section">
                  <p>Price</p>
                  <p>PHP {price}</p>
                </div>
                <hr />
                <button
                  type="button"
                  className="generate-btn mt-3"
                  onClick={handleAddTicket}
                >
                  Add Ticket
                </button>
                {error && <p className="text-danger">{error}</p>}
              </form>
            </div>
          </div>
        </div>
        {tickets.length > 0 && (
          <div className="tickets-table-container">
            <h3>Passenger Details</h3>
            <div className="table-responsive">
              <table className="tickets-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Total Bookings</th>
                    <th>Boarding Status</th>
                    <th>Created By</th>
                    <th>Ticket Number</th>
                    <th>Seat</th>
                    <th>Age Group</th>
                    <th>Price</th>
                    <th>Route</th>
                    <th>Baggage</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket, index) => (
                    <tr key={index}>
                      <td>{ticket.passenger.name}</td>
                      <td>{ticket.passenger.email || 'N/A'}</td>
                      <td>{ticket.passenger.phone || 'N/A'}</td>
                      <td className="text-center">{ticket.passenger.total_bookings}</td>
                      <td>
                        <span className={`badge-boarding-status badge-${ticket.boarding_status?.toLowerCase() || 'not-boarded'}`}>
                          {ticket.boarding_status?.replace(/_/g, ' ') || 'NOT BOARDED'}
                        </span>
                      </td>
                      <td>{ticket.passenger.created_by || 'N/A'}</td>
                      <td>{ticket.ticket_number}</td>
                      <td>{ticket.seat_number}</td>
                      <td className="text-capitalize">{ticket.age_group}</td>
                      <td>PHP {ticket.price}</td>
                      <td>
                        {ticket.trip ? `${ticket.trip.origin} to ${ticket.trip.destination}` : 'N/A'}
                      </td>
                      <td>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={ticket.baggage_ticket || false}
                            onChange={() => handleBaggageTicketChange()}
                            id={`baggageSwitch-${index}`}
                          />
                        </div>
                      </td>
                      <td className="action-column">
                        <button
                          className="btn btn-link btn-sm p-0"
                          onClick={() => {
                            setTickets([]);
                            localStorage.removeItem('tickets');
                          }}
                        >
                          <i className="fa fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="checkout-btn-container">
              <button
                type="button"
                className="checkout-btn mt-3"
                onClick={handleProceedToCheckout}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default IssueTicket;