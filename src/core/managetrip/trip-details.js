import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Table } from 'react-bootstrap';
import axios from 'axios';
import '../../css/components.css'; // Import the CSS file

function TripDetails() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTripDetails = async () => {
      const token = localStorage.getItem('accessToken');
      try {
        const response = await axios.get(`https://api.kcq-express.co/api/trips/${id}/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        });
        setTrip(response.data);
      } catch (error) {
        console.error('Error fetching trip details:', error);
        setError('Failed to fetch trip details');
      }
    };

    fetchTripDetails();
  }, [id]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!trip) {
    return <p>Loading...</p>;
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Header>
              <h3>Trip Details</h3>
            </Card.Header>
            <Card.Body>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Field</th>
                    <th className="details-column">Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Origin</strong></td>
                    <td className="details-column">{trip.origin}</td>
                  </tr>
                  <tr>
                    <td><strong>Destination</strong></td>
                    <td className="details-column">{trip.destination}</td>
                  </tr>
                  <tr>
                    <td><strong>Departure Time</strong></td>
                    <td className="details-column">{new Date(trip.departure_time).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td><strong>Arrival Time</strong></td>
                    <td className="details-column">{new Date(trip.arrival_time).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td><strong>Boat Type</strong></td>
                    <td className="details-column">{trip.ferry_boat.slug}</td>
                  </tr>
                  <tr>
                    <td><strong>Created By</strong></td>
                    <td className="details-column">{trip.created_by}</td>
                  </tr>
                  <tr>
                    <td><strong>Available Seats</strong></td>
                    <td className="details-column">{trip.available_seats}</td>
                  </tr>
                  <tr>
                    <td><strong>Created At</strong></td>
                    <td className="details-column">{new Date(trip.created_at).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td><strong>Updated At</strong></td>
                    <td className="details-column">{new Date(trip.updated_at).toLocaleString()}</td>
                  </tr>
                </tbody>
              </Table>
              <Button variant="primary" style={{ backgroundColor: '#091057', borderColor: '#091057' }} onClick={() => window.history.back()}>Back</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default TripDetails;