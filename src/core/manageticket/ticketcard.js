import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/manageticket/ticketcard.css';
import boatLogo from '../../assets/boatlogo.png';
import { Modal, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function TicketCard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const navigate = useNavigate();

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

  const handleDelete = () => {
    console.log('Deleting ticket with reason:', reason);
    setShowModal(false);
  };

  const handleViewDetails = (ticketNumber) => {
    navigate(`/ticket-details/${ticketNumber}`);
  };

  if (loading) return <p>Loading tickets...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="ticket-list mt-4">
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>KCQ</th>
              <th>Destination</th>
              <th>Customer</th>
              <th>Ticket Number</th>
              <th>Boat Type</th>
              <th>Capacity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(tickets) &&
              tickets.map((ticket) => {
                const {
                  ticket_number,
                  trip: { destination, ferry_boat },
                  passenger: { name: customer },
                } = ticket;

                const capacity = ticket.trip.available_seats;
                const typeBoat = ferry_boat.slug;

                return (
                  <tr key={ticket_number}>
                    <td><img src={boatLogo} alt="Boat Logo" className="boat-logo-ticketcard" /></td>
                    <td>{destination}</td>
                    <td>{customer}</td>
                    <td>{ticket_number}</td>
                    <td>{typeBoat}</td>
                    <td>{capacity}</td>
                    <td>
                      <button
                        type="button"
                        className="trash-button-ticketcard"
                        onClick={() => {
                          setSelectedTicket(ticket_number);
                          setShowModal(true);
                        }}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                      <button
                        type="button"
                        className="view-details-button-ticketcard"
                        onClick={() => handleViewDetails(ticket_number)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Ticket</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="reason">
              <Form.Label>Reason for deletion</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default TicketCard;