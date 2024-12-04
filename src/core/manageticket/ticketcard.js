import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap is loaded
import '../../css/manageticket/ticketcard.css'; // Import the custom CSS
import boatLogo from '../../assets/boatlogo.png'; // Import your logo

function TicketCard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch('https://api.kcq-express.co/api/tickets/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${localStorage.getItem('accessToken')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch tickets');
        }

        const data = await response.json();
        setTickets(data || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) return <p>Loading tickets...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="ticket-list">
      {Array.isArray(tickets) &&
        tickets.map((ticket) => {
          const {
            id,
            trip: { destination, ferry_boat },
            passenger: { name: customer },
          } = ticket;

          const capacity = ticket.trip.available_seats; // Assuming capacity means available seats
          const typeBoat = ferry_boat.slug; // Assuming type_boat is the slug

          return (
            <div key={id} className="card empty-card-ticketcard">
              <div className="card-body-ticketcard">
                {/* Checkbox */}
                <input type="checkbox" className="card-checkbox-ticketcard" />

                {/* Boat Logo */}
                <img src={boatLogo} alt="Boat Logo" className="boat-logo-ticketcard" />

                {/* Destination Section */}
                <div className="to-component-ticketcard">
                  <p className="to-text-ticketcard">Destination</p>
                  <h4 className="to-destination-ticketcard">{destination}</h4>
                </div>

                {/* Customer Section */}
                <div className="from-component-ticketcard">
                  <p className="from-text-ticketcard">Customer</p>
                  <h4 className="from-destination-ticketcard">{customer}</h4>
                </div>
                
                {/* ID */}
                <div className="id-component-ticketcard mt-3">
                  <h4 className="id-text-ticketcard">{id}</h4>
                </div>

                {/* Boat Type and Capacity */}
                <div className="departure-date-component-ticketcard mt-3">
                  <h4 className="departure-text-ticketcard">Boat Type: {typeBoat}</h4>
                  <h4 className="departure-capacity-ticketcard">Capacity: {capacity}</h4>
                </div>

                {/* Action Buttons */}
                <div className="vertical-separator-ticketcard">
                  <button type="button" className="trash-button-ticketcard">
                    <i className="fas fa-trash"></i>
                  </button>
                  <button type="button" className="view-details-button-ticketcard">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default TicketCard;
