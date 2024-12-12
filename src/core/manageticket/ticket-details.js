import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Table } from 'react-bootstrap';
import axios from 'axios';

function TicketDetails() {
  const { ticketNumber } = useParams();
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTicketDetails = async () => {
      const token = localStorage.getItem('accessToken');
      try {
        const response = await axios.get(`https://api.kcq-express.co/api/tickets/${ticketNumber}/`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization' : `Token ${token}`,
          },
        });
        setTicket(response.data);
      } catch (error) {
        console.error('Error fetching ticket details:', error);
        setError('Failed to fetch ticket details');
      }
    };

    fetchTicketDetails();
  }, [ticketNumber]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!ticket) {
    return <p>Loading...</p>;
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={10}>
          <Card>
            <Card.Header>
              <h3 className="text-center">Ticket Details</h3>
            </Card.Header>
            <Card.Body>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Field</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Ticket Number</td>
                    <td>{ticket.ticket_number}</td>
                  </tr>
                  <tr>
                    <td>Seat Number</td>
                    <td>{ticket.seat_number}</td>
                  </tr>
                  <tr>
                    <td>Passenger Name</td>
                    <td>{ticket.passenger.name}</td>
                  </tr>
                  <tr>
                    <td>Contact</td>
                    <td>{ticket.passenger.contact}</td>
                  </tr>
                  <tr>
                    <td>Age Group</td>
                    <td>{ticket.age_group}</td>
                  </tr>
                  <tr>
                    <td>Price</td>
                    <td>{ticket.price}</td>
                  </tr>
                  <tr>
                    <td>Discount</td>
                    <td>{ticket.discount}</td>
                  </tr>
                  <tr>
                    <td>Issue Date</td>
                    <td>{new Date(ticket.issue_date).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td>Baggage Ticket</td>
                    <td>{ticket.baggage_ticket ? 'Yes' : 'No'}</td>
                  </tr>
                  <tr>
                    <td>QR Code</td>
                    <td><img src={ticket.qr_code} alt="QR Code" /></td>
                  </tr>
                  <tr>
                    <td>Trip Origin</td>
                    <td>{ticket.trip.origin}</td>
                  </tr>
                  <tr>
                    <td>Trip Destination</td>
                    <td>{ticket.trip.destination}</td>
                  </tr>
                  <tr>
                    <td>Departure Time</td>
                    <td>{new Date(ticket.trip.departure_time).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td>Arrival Time</td>
                    <td>{new Date(ticket.trip.arrival_time).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td>Boat Type</td>
                    <td>{ticket.trip.ferry_boat.slug}</td>
                  </tr>
                  <tr>
                    <td>Created By</td>
                    <td>{ticket.created_by}</td>
                  </tr>
                  <tr>
                    <td>Created At</td>
                    <td>{new Date(ticket.created_at).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td>Updated At</td>
                    <td>{new Date(ticket.updated_at).toLocaleString()}</td>
                  </tr>
                </tbody>
              </Table>
              <Button variant="primary" style={{ backgroundColor: '#091057' }} onClick={() => window.history.back()}>Back</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default TicketDetails;