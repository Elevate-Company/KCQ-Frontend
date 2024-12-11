import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap is loaded
import '../../css/manageticket/ticketcard.css'; // Import the custom CSS
import boatLogo from '../../assets/boatlogo.png'; // Import your logo
import { Modal, Button, Form } from 'react-bootstrap'; // Import Bootstrap components

function TicketCard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);

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

  if (loading) return <p>Loading tickets...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="ticket-list mt-4">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>KCQ</th>
            <th>Destination</th>
            <th>Customer</th>
            <th>ID</th>
            <th>Boat Type</th>
            <th>Capacity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(tickets) &&
            tickets.map((ticket) => {
              const {
                id,
                trip: { destination, ferry_boat },
                passenger: { name: customer },
              } = ticket;

              const capacity = ticket.trip.available_seats; 
              const typeBoat = ferry_boat.slug; 

              return (
                <tr key={id}>
                  <td><img src={boatLogo} alt="Boat Logo" className="boat-logo-ticketcard" /></td>
                  <td>{destination}</td>
                  <td>{customer}</td>
                  <td>{id}</td>
                  <td>{typeBoat}</td>
                  <td>{capacity}</td>
                  <td>
                    <button
                      type="button"
                      className="trash-button-ticketcard"
                      onClick={() => {
                        setSelectedTicket(id);
                        setShowModal(true);
                      }}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                    <button type="button" className="view-details-button-ticketcard">
                      View Details
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>

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