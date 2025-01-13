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
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [passengerType, setPassengerType] = useState('adult');
  const [tickets, setTickets] = useState(() => {
    const savedTickets = localStorage.getItem('tickets');
    return savedTickets ? JSON.parse(savedTickets) : [];
  });
  const [price, setPrice] = useState(400);
  const [passengers, setPassengers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      const token = localStorage.getItem('accessToken');
      try {
        const response = await axios.get('https://api.kcq-express.co/api/trips/', {
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
        const response = await axios.get('https://api.kcq-express.co/api/passengers/', {
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
      setContactNumber(selectedPassenger.contact);
      setEmail(selectedPassenger.email || '');
    }
  };

  const handleAddTicket = () => {
    if (!passengerName.trim()) {
      alert('Passenger name is required.');
      return;
    }

    const selectedTrip = JSON.parse(localStorage.getItem('selectedTrip'));
    if (!selectedTrip) {
      alert('Please select a trip.');
      return;
    }

    const newTicket = {
      passenger: {
        name: passengerName,
        contact: contactNumber,
        email: email,
        type: passengerType,
      },
      trip: selectedTrip,
      amount: calculateAmount(passengerType),
    };

    setTickets([...tickets, newTicket]);

    setPassengerName('');
    setContactNumber('');
    setEmail('');
    setPassengerType('adult');
    setPrice(400);
  };

  const handleDeleteTicket = (index) => {
    const updatedTickets = tickets.filter((_, i) => i !== index);
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
                    onChange={(e) => setPassengerName(e.target.value)}
                  />
                </label>
                <label>
                  Phone Number:
                  <input
                    type="tel"
                    placeholder="Contact number"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                  />
                </label>
                <label>
                  Passenger Email:
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </label>
                <label>
                  Passenger:
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
                  className="generate-btn mt-5"
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
            <h3>Passengers</h3>
            <table className="tickets-table mt-2">
              <thead>
                <tr>
                  <th className="action-column">Action</th>
                  <th>Name</th>
                  <th>Contact Number</th>
                  <th>Email</th>
                  <th>Passenger Type</th>
                  <th>Trip</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket, index) => (
                  <tr key={index}>
                    <td className="action-column">
                      <i
                        className="fa fa-trash"
                        onClick={() => handleDeleteTicket(index)}
                      ></i>
                    </td>
                    <td>{ticket.passenger.name}</td>
                    <td>{ticket.passenger.contact}</td>
                    <td>{ticket.passenger.email}</td>
                    <td>{ticket.passenger.type}</td>
                    <td>{ticket.trip?.origin || 'N/A'} to {ticket.trip?.destination || 'N/A'}</td>
                    <td>PHP {ticket.amount}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="6" style={{ textAlign: 'right', fontWeight: 'bold' }}>Total</td>
                  <td style={{ fontWeight: 'bold' }}>PHP {calculateTotalAmount()}</td>
                </tr>
              </tbody>
            </table>
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