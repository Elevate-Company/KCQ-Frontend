import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Col, Row, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../navbar/navbar';
import '../../css/managetrip/addtrip.css';

// Define theme colors
const THEME = {
  primary: '#0a215a',  // Dark blue from the current design
  secondary: '#071c4d', // Darker variant
  accent: '#e8f0fe',
  success: '#34a853',
  danger: '#ea4335',
  warning: '#fbbc04',
  light: '#f8f9fa'
};

function AddTrip() {
  const [boat, setBoat] = useState('');
  const [boats, setBoats] = useState([]);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  const [availableSeats, setAvailableSeats] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBoats = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/ferry-boats/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        });
        setBoats(response.data);
      } catch (error) {
        console.error('Error fetching boats:', error);
        setError('Failed to fetch boats. Please try again.');
      }
    };

    const usernameID = localStorage.getItem('username');
    setCreatedBy(usernameID);

    fetchBoats();
  }, []);

  const validateForm = () => {
    if (!boat) return 'Please select a boat';
    if (!origin) return 'Origin is required';
    if (!destination) return 'Destination is required';
    if (!departure) return 'Departure time is required';
    if (!arrival) return 'Arrival time is required';
    if (!availableSeats) return 'Available seats is required';
    
    const departureDate = new Date(departure);
    const arrivalDate = new Date(arrival);
    
    if (arrivalDate <= departureDate) {
      return 'Arrival time must be after departure time';
    }
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/trips/`,
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
      setSuccess(true);
      setTimeout(() => {
        navigate('/manage-trips');
      }, 1500);
    } catch (error) {
      console.error('Error creating trip:', error);
      setError('Failed to create trip. Please check your inputs and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <Card className="shadow-sm border-0">
          <Card.Header className="border-0 py-3" style={{ backgroundColor: THEME.primary, color: 'white' }}>
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="mb-0 fw-bold">Create a Trip</h2>
              <Button 
                variant="outline-light"
                onClick={() => navigate('/manage-trips')}
              >
                <i className="fas fa-arrow-left me-2"></i>
                Back to Trips
              </Button>
            </div>
          </Card.Header>
          
          <Card.Body className="p-4">
            {error && (
              <Alert variant="danger" className="mb-4">
                <i className="fas fa-exclamation-circle me-2"></i>
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert variant="success" className="mb-4">
                <i className="fas fa-check-circle me-2"></i>
                Trip created successfully! Redirecting to trips list...
              </Alert>
            )}
            
            <Form onSubmit={handleSubmit}>
              <Row className="mb-4">
                <Col md={6}>
                  <Card className="h-100 border-0 shadow-sm">
                    <Card.Body className="p-4">
                      <h5 className="mb-4 fw-bold" style={{ color: THEME.primary }}>
                        <i className="fas fa-route me-2"></i>
                        Route Information
                      </h5>
                      
                      <Form.Group className="mb-3" controlId="formOrigin">
                        <Form.Label className="fw-medium">Origin*</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter origin"
                          value={origin}
                          onChange={(e) => setOrigin(e.target.value)}
                          className="form-control-lg"
                          required
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3" controlId="formDestination">
                        <Form.Label className="fw-medium">Destination*</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter destination"
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          className="form-control-lg"
                          required
                        />
                      </Form.Group>
                      
                      <div className="d-flex align-items-center mb-3">
                        <div className="route-icon">
                          <i className="fas fa-map-marker-alt text-primary"></i>
                          <div className="route-line"></div>
                          <i className="fas fa-map-marker text-success"></i>
                        </div>
                        <div className="ms-3 text-muted">
                          <div>From: {origin || 'Origin'}</div>
                          <div>To: {destination || 'Destination'}</div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                
                <Col md={6}>
                  <Card className="h-100 border-0 shadow-sm">
                    <Card.Body className="p-4">
                      <h5 className="mb-4 fw-bold" style={{ color: THEME.primary }}>
                        <i className="fas fa-calendar-alt me-2"></i>
                        Schedule Information
                      </h5>
                      
                      <Form.Group className="mb-3" controlId="formDeparture">
                        <Form.Label className="fw-medium">Departure Time*</Form.Label>
                        <Form.Control
                          type="datetime-local"
                          value={departure}
                          onChange={(e) => setDeparture(e.target.value)}
                          className="form-control-lg"
                          required
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3" controlId="formArrival">
                        <Form.Label className="fw-medium">Arrival Time*</Form.Label>
                        <Form.Control
                          type="datetime-local"
                          value={arrival}
                          onChange={(e) => setArrival(e.target.value)}
                          className="form-control-lg"
                          required
                        />
                      </Form.Group>
                      
                      {departure && arrival && (
                        <div className="time-info p-3 bg-light rounded">
                          <div className="d-flex justify-content-between">
                            <div>
                              <small className="text-muted">Duration</small>
                              <div className="fw-bold">
                                {Math.round((new Date(arrival) - new Date(departure)) / (1000 * 60 * 60))} hours
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              
              <Row className="mb-4">
                <Col md={12}>
                  <Card className="border-0 shadow-sm">
                    <Card.Body className="p-4">
                      <h5 className="mb-4 fw-bold" style={{ color: THEME.primary }}>
                        <i className="fas fa-ship me-2"></i>
                        Boat Information
                      </h5>
                      
                      <Row>
                        <Col md={4}>
                          <Form.Group className="mb-3" controlId="formBoat">
                            <Form.Label className="fw-medium">Boat*</Form.Label>
                            <Form.Select 
                              value={boat} 
                              onChange={(e) => setBoat(e.target.value)}
                              className="form-control-lg"
                              required
                            >
                              <option value="">Select Boat</option>
                              {boats.map((boat) => (
                                <option key={boat.id} value={boat.slug}>{boat.name}</option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3" controlId="formAvailableSeats">
                            <Form.Label className="fw-medium">Available Seats*</Form.Label>
                            <Form.Control
                              type="number"
                              placeholder="Enter available seats"
                              value={availableSeats}
                              onChange={(e) => setAvailableSeats(e.target.value)}
                              className="form-control-lg"
                              min="1"
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3" controlId="formCreatedBy">
                            <Form.Label className="fw-medium">Created By</Form.Label>
                            <Form.Control
                              type="text"
                              value={createdBy}
                              className="form-control-lg"
                              readOnly
                              disabled
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              
              <div className="d-flex justify-content-center mt-4">
                <Button 
                  variant="secondary" 
                  onClick={() => navigate('/manage-trips')}
                  className="me-2 px-4 py-2"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  type="submit" 
                  className="px-4 py-2"
                  style={{ backgroundColor: THEME.primary, borderColor: THEME.primary }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Creating...
                    </>
                  ) : (
                    'Create Trip'
                  )}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}

export default AddTrip;