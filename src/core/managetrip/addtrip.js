import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../css/managetrip/addtrip.css';

function AddTrip() {
  const [boat, setBoat] = useState('');
  const [boats, setBoats] = useState([]);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  const [availableSeats, setAvailableSeats] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBoats = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('https://api.kcq-express.co/api/ferry-boats/', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        });
        setBoats(response.data);
      } catch (error) {
        console.error('Error fetching boats:', error);
      }
    };

    const usernameID = localStorage.getItem('username');
    setCreatedBy(usernameID);

    fetchBoats();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(
        'https://api.kcq-express.co/api/trips/',
        {
          ferry_boat: { slug: boat },
          origin,
          destination,
          departure_time: departure,
          arrival_time: arrival,
          available_seats: parseInt(availableSeats, 10),
          created_by: createdBy,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        }
      );
      console.log('Trip created:', response.data);
      navigate('/manage-trips');
    } catch (error) {
      console.error('Error creating trip:', error);
      console.error('Response data:', error.response.data);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Create a Trip</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group as={Row} className="mb-3" controlId="formBoat">
          <Form.Label column sm={2}>Boat</Form.Label>
          <Col sm={10}>
            <Form.Control as="select" value={boat} onChange={(e) => setBoat(e.target.value)} className="input-width">
              <option value="">Select Boat</option>
              {boats.map((boat) => (
                <option key={boat.id} value={boat.slug}>{boat.name}</option>
              ))}
            </Form.Control>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formOrigin">
          <Form.Label column sm={2}>Origin</Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              placeholder="Enter origin"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="input-width"
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formDestination">
          <Form.Label column sm={2}>Destination</Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              placeholder="Enter destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="input-width"
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formDeparture">
          <Form.Label column sm={2}>Departure</Form.Label>
          <Col sm={10}>
            <Form.Control
              type="datetime-local"
              value={departure}
              onChange={(e) => setDeparture(e.target.value)}
              className="input-width"
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formArrival">
          <Form.Label column sm={2}>Arrival</Form.Label>
          <Col sm={10}>
            <Form.Control
              type="datetime-local"
              value={arrival}
              onChange={(e) => setArrival(e.target.value)}
              className="input-width"
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formAvailableSeats">
          <Form.Label column sm={2}>Available Seats</Form.Label>
          <Col sm={10}>
            <Form.Control
              type="number"
              placeholder="Enter available seats"
              value={availableSeats}
              onChange={(e) => setAvailableSeats(e.target.value)}
              className="input-width"
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formCreatedBy">
          <Form.Label column sm={2}>Created By</Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              value={createdBy}
              readOnly
              className="input-width"
            />
          </Col>
        </Form.Group>

        <Button variant="primary" type="submit" className="create-trip-button">
          Create Trip
        </Button>
      </Form>
    </div>
  );
}

export default AddTrip;