import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/issueticket/issueticket.css';
import SelectTrip from './selectrip';
import axios from 'axios';
import Navbar from '../navbar/navbar';

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

        const data = response.data.passengers;
        setPassengers(data);
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
    switch (type) {
      case 'adult':
        return 'Adult';
      case 'child':
        return 'Child';
      case 'senior':
        return 'Senior';
      case 'student':
        return 'Student';
      case 'infant':
        return 'Infant';
      default:
        return 'Unknown';
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
        name: selectedPassenger.name,
        email: selectedPassenger.email,
        phone: selectedPassenger.phone,
        total_bookings: selectedPassenger.total_bookings || 'N/A',
        boarding_status: selectedPassenger.boarding_status || 'NOT_CHECKED_IN',
        created_by: username || 'Unknown',
      };

      localStorage.setItem('selectedPassenger', JSON.stringify(passengerData));
    }
  };

  const handleAddTicket = () => {
    const storedPassenger = JSON.parse(localStorage.getItem('selectedPassenger'));
    if (!storedPassenger) {
      alert('Please select a passenger.');
      return;
    }

    if (!ticketNumber.trim()) {
      alert('Ticket number is required.');
      return;
    }

    if (!seatNumber.trim()) {
      alert('Seat number is required.');
      return;
    }

    const selectedTrip = JSON.parse(localStorage.getItem('selectedTrip'));
    if (!selectedTrip) {
      alert('Please select a trip.');
      return;
    }

    const newTicket = {
      passenger: {
        ...storedPassenger,
        type: passengerType,
      },
      ticket_number: ticketNumber,
      seat_number: seatNumber,
      age_group: getAgeGroup(passengerType),
      price: price,
      trip: selectedTrip,
      amount: calculateAmount(passengerType),
      baggage_ticket: false,
    };

    setTickets([newTicket]);

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
          <div className="tickets-table-container mt-5">
            <h3>Passenger Details</h3>
            <div className="table-responsive">
              <table className="tickets-table mt-2">
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
                    <th>Baggage Ticket</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket, index) => (
                    <tr key={index}>
                      <td>{ticket.passenger.name}</td>
                      <td>{ticket.passenger.email}</td>
                      <td>{ticket.passenger.phone}</td>
                      <td>{ticket.passenger.total_bookings || 'N/A'}</td>
                      <td>{ticket.passenger.boarding_status || 'N/A'}</td>
                      <td>{ticket.passenger.created_by || username || 'Unknown'}</td>
                      <td>{ticket.ticket_number}</td>
                      <td>{ticket.seat_number}</td>
                      <td>{ticket.age_group}</td>
                      <td>{ticket.trip?.origin || 'N/A'} to {ticket.trip?.destination || 'N/A'}</td>
                      <td>PHP {ticket.amount}</td>
                      <td>
                        <input
                          type="checkbox"
                          checked={ticket.baggage_ticket}
                          onChange={handleBaggageTicketChange}
                        />
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="11" style={{ textAlign: 'right', fontWeight: 'bold' }}>Total</td>
                    <td style={{ fontWeight: 'bold' }}>PHP {calculateTotalAmount()}</td>
                  </tr>
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