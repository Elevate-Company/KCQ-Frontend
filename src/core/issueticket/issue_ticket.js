import React, { useState, useEffect } from 'react';
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
  const [tickets, setTickets] = useState([]);
  const [price, setPrice] = useState(400);

  useEffect(() => {
    const fetchTrips = async () => {
      const token = localStorage.getItem('accessToken');
      console.log('Token:', token);
      try {
        const response = await axios.get('https://api.kcq-express.co/api/trips/', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
        });

        const data = response.data;
        console.log('Response data:', data);

        // Filter trips to only include future and present trips
        const filteredTrips = data.filter(trip => {
          const departureDate = new Date(trip.departure_time);
          const currentDate = new Date();

          // Compare the departure date with the current date and time
          return departureDate >= currentDate;
        });

        setTrips(filteredTrips); // Only set trips that are future or present
      } catch (error) {
        console.error('Error fetching trips:', error);
        setError('Failed to fetch trips');
      }
    };

    fetchTrips();
  }, []);

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

  const handleAddTicket = () => {
    const newTicket = {
      passenger: {
        name: passengerName,
        contact: contactNumber,
        email: email,
        type: passengerType,
      },
      amount: calculateAmount(passengerType),
    };

    // Add the new ticket to the list of tickets
    setTickets([...tickets, newTicket]);

    // Clear the form fields
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
            <div className="arrow-container">
              <button className="arrow" onClick={() => alert('Arrow button clicked!')}>
                &gt;
              </button>
            </div>
          </div>

          <div className="card-contact-issue contact-card">
            <div className="card-contact">
              <h3>Contact Info</h3>
              <form className="contact-form">
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
                <p></p>
                <div className="total-section">
                  <p>Price</p>
                  <p>PHP {price}</p>
                </div>
                <hr />
                <button
                  type="button"
                  className="generate-btn"
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
                    <td>PHP {ticket.amount}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="5" style={{ textAlign: 'right', fontWeight: 'bold' }}>Total</td>
                  <td style={{ fontWeight: 'bold' }}>PHP {calculateTotalAmount()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default IssueTicket;