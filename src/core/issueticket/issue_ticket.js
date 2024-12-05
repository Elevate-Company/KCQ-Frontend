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

  const handleGenerateTicket = async () => {
    const token = localStorage.getItem('accessToken');
    const ticketData = {
      trip: selectedTrip,
      passenger: {
        name: passengerName,
        contact: contactNumber,
        type: passengerType,
      },
      ticket_number: 'TICKET1234',
      seat_number: '1A',
      age_group: passengerType,
      price: '1999',
      discount: '',
      baggage_ticket: true,
      qr_code: 'QRCODE1234',
    };

    try {
      const response = await axios.post('https://api.kcq-express.co/api/tickets/', ticketData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      });

      console.log('Ticket generated:', response.data);
      alert('Ticket Generated!');
    } catch (error) {
      console.error('Error generating ticket:', error);
      setError('Failed to generate ticket');
    }
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
                    onChange={(e) => setPassengerType(e.target.value)}
                  >
                    <option value="adult">Adult</option>
                    <option value="child">Child - (4-10 yrs old)</option>
                    <option value="senior">Senior - (65 yrs old)</option>
                    <option value="student">Student</option>
                    <option value="infant">Infant - (1-3 yrs old)</option>
                  </select>
                </label>
                <hr />
                <p></p>
                <div className="total-section">
                  <p>Total</p>
                  <p>PHP 1,999</p>
                </div>
                <hr />
                <button
                  type="button"
                  className="generate-btn"
                  onClick={handleGenerateTicket}
                >
                  Add Ticket
                </button>
                {error && <p className="text-danger">{error}</p>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IssueTicket;