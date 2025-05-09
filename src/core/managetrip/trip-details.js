import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Table, Badge, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import Navbar from '../navbar/navbar';
import '../../css/components.css';
import boatLogo from '../../assets/boatlogo.png';

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

function TripDetails() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTripDetails = async () => {
      const token = localStorage.getItem('accessToken');
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/trips/${id}/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        });
        setTrip(response.data);
        
        // Fetch tickets for this trip to get passenger information
        try {
          // Try the by-trip endpoint first
          try {
            const ticketsResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/tickets/by-trip/${id}/`, {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${token}`,
              },
            });
            
            // Process ticket data to get passenger information
            const ticketsWithPassengers = await Promise.all(
              ticketsResponse.data.map(async (ticket) => {
                // If passenger is already included, use it
                if (ticket.passenger && typeof ticket.passenger === 'object') {
                  return { ...ticket };
                }
                
                // If only passenger ID is available, fetch passenger details
                if (ticket.passenger && typeof ticket.passenger === 'number') {
                  try {
                    const passengerResponse = await axios.get(
                      `${process.env.REACT_APP_API_BASE_URL}/api/passengers/${ticket.passenger}/`,
                      {
                        headers: {
                          'Content-Type': 'application/json',
                          Authorization: `Token ${token}`,
                        },
                      }
                    );
                    return { ...ticket, passenger: passengerResponse.data };
                  } catch (err) {
                    console.error(`Error fetching passenger ${ticket.passenger}:`, err);
                    return { ...ticket, passenger: { id: ticket.passenger, name: 'Unknown' } };
                  }
                }
                
                return ticket;
              })
            );
            
            setPassengers(ticketsWithPassengers);
          } catch (byTripError) {
            // If the by-trip endpoint fails, fall back to fetching all tickets and filtering
            console.warn('By-trip endpoint failed, fetching all tickets as fallback:', byTripError);
            
            // Fetch all tickets and filter by trip ID
            const allTicketsResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/tickets/`, {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${token}`,
              },
            });
            
            // Filter tickets for this trip
            const tripTickets = allTicketsResponse.data.filter(ticket => {
              return (ticket.trip === parseInt(id) || 
                      (ticket.trip && ticket.trip.id === parseInt(id)));
            });
            
            // Process ticket data to get passenger information
            const ticketsWithPassengers = await Promise.all(
              tripTickets.map(async (ticket) => {
                // If passenger is already included, use it
                if (ticket.passenger && typeof ticket.passenger === 'object') {
                  return { ...ticket };
                }
                
                // If only passenger ID is available, fetch passenger details
                if (ticket.passenger && typeof ticket.passenger === 'number') {
                  try {
                    const passengerResponse = await axios.get(
                      `${process.env.REACT_APP_API_BASE_URL}/api/passengers/${ticket.passenger}/`,
                      {
                        headers: {
                          'Content-Type': 'application/json',
                          Authorization: `Token ${token}`,
                        },
                      }
                    );
                    return { ...ticket, passenger: passengerResponse.data };
                  } catch (err) {
                    console.error(`Error fetching passenger ${ticket.passenger}:`, err);
                    return { ...ticket, passenger: { id: ticket.passenger, name: 'Unknown' } };
                  }
                }
                
                return ticket;
              })
            );
            
            setPassengers(ticketsWithPassengers);
          }
        } catch (err) {
          console.error('Error fetching tickets for trip:', err);
          setPassengers([]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching trip details:', error);
        setError('Failed to fetch trip details');
        setLoading(false);
      }
    };

    fetchTripDetails();
  }, [id]);

  const getTripStatusBadge = (tripData) => {
    if (!tripData) return null;
    
    const currentDate = new Date();
    const departureDateTime = new Date(tripData.departure_time);
    const arrivalDateTime = tripData.arrival_time ? new Date(tripData.arrival_time) : null;

    let status = 'scheduled';
    let variant = 'secondary';
    
    if (tripData.status === 'cancelled') {
      status = 'cancelled';
      variant = 'danger';
    } else if (arrivalDateTime && currentDate > arrivalDateTime) {
      status = 'completed';
      variant = 'success';
    } else if (currentDate > departureDateTime) {
      status = 'ongoing';
      variant = 'primary';
    } else {
      status = 'upcoming';
      variant = 'warning';
    }

    return (
      <Badge bg={variant} className="px-3 py-2 fs-6">
        {status.toUpperCase()}
      </Badge>
    );
  };
  
  const getBoardingStatusBadge = (status) => {
    let variant = 'secondary';
    let text = 'Not Boarded';
    
    if (status === 'BOARDED') {
      variant = 'success';
      text = 'Boarded';
    } else if (status === 'CANCELLED') {
      variant = 'danger';
      text = 'Cancelled';
    }
    
    return (
      <Badge bg={variant} className="py-1 px-2">
        {text}
      </Badge>
    );
  };

  if (error) {
    return (
      <>
        <Navbar />
        <Container className="mt-5">
          <Alert variant="danger">{error}</Alert>
        </Container>
      </>
    );
  }

  if (!trip) {
    return (
      <>
        <Navbar />
        <Container className="mt-5">
          <Alert variant="warning">Trip not found</Alert>
        </Container>
      </>
    );
  }

  const departureTime = new Date(trip.departure_time);
  const arrivalTime = trip.arrival_time ? new Date(trip.arrival_time) : null;

  return (
    <>
      <Navbar />
      <Container className="py-4">
        <Card className="shadow-sm border-0 mb-4">
          <Card.Header 
            className="border-0 py-3" 
            style={{ backgroundColor: THEME.primary, color: 'white' }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="mb-0 fw-bold">Trip Details</h2>
              <Button 
                variant="outline-light"
                style={{ width: "150px" }}
                onClick={() => navigate('/manage-trips')}
              >
                <i className="fas fa-arrow-left me-2"></i>
                Back to Trips
              </Button>
            </div>
          </Card.Header>
          
          <Card.Body className="p-4">
            <div className="d-flex flex-column flex-md-row align-items-center mb-4">
              <div className="me-md-4 mb-3 mb-md-0 text-center">
                <i className="fas fa-ship" style={{ fontSize: "50px", color: THEME.primary }}></i>
              </div>
              <div className="flex-grow-1 text-center text-md-start">
                <h4 className="fw-bold mb-2">
                  {trip.origin} <i className="fas fa-arrow-right mx-2"></i> {trip.destination}
                </h4>
                <p className="text-muted mb-2">
                  Trip ID: <span className="fw-medium">{trip.id}</span>
                </p>
                <div className="mt-2">
                  {getTripStatusBadge(trip)}
                </div>
              </div>
            </div>
            
            <Row className="g-4 mb-4">
              <Col md={6}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body>
                    <h5 className="mb-3 fw-bold text-primary" style={{ color: THEME.primary }}>
                      <i className="fas fa-calendar-alt me-2"></i> Schedule Information
                    </h5>
                    <Row>
                      <Col md={6} className="mb-3">
                        <Card className="border-0 bg-light">
                          <Card.Body className="p-3">
                            <h6 className="text-muted mb-1">Departure</h6>
                            <div className="d-flex align-items-center">
                              <i className="fas fa-ship me-2" style={{ color: THEME.primary }}></i>
                              <div>
                                <p className="mb-0 fw-bold">{departureTime.toLocaleDateString()}</p>
                                <p className="mb-0">{departureTime.toLocaleTimeString()}</p>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Card className="border-0 bg-light">
                          <Card.Body className="p-3">
                            <h6 className="text-muted mb-1">Arrival</h6>
                            <div className="d-flex align-items-center">
                              <i className="fas fa-ship me-2" style={{ color: THEME.primary }}></i>
                              <div>
                                <p className="mb-0 fw-bold">
                                  {arrivalTime ? arrivalTime.toLocaleDateString() : 'Not specified'}
                                </p>
                                <p className="mb-0">
                                  {arrivalTime ? arrivalTime.toLocaleTimeString() : ''}
                                </p>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                    <hr />
                    <div className="mb-3">
                      <h6 className="text-muted mb-1">Journey Duration</h6>
                      <p className="mb-0 fw-bold">
                        {arrivalTime ? 
                          `${Math.round((arrivalTime - departureTime) / (1000 * 60 * 60))} hours` : 
                          'Not specified'
                        }
                      </p>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={6}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body>
                    <h5 className="mb-3 fw-bold" style={{ color: THEME.primary }}>
                      <i className="fas fa-ship me-2"></i> Boat Information
                    </h5>
                    <Row>
                      <Col md={6} className="mb-3">
                        <h6 className="text-muted mb-1">Boat Type</h6>
                        <p className="fw-bold mb-3">
                          {typeof trip.ferry_boat === 'object' 
                            ? trip.ferry_boat.name || trip.ferry_boat.slug 
                            : trip.ferry_boat || 'N/A'}
                        </p>
                        
                        <h6 className="text-muted mb-1">Available Seats</h6>
                        <p className="fw-bold">
                          {trip.available_seats || 'N/A'}
                        </p>
                      </Col>
                      <Col md={6}>
                        <h6 className="text-muted mb-1">Created By</h6>
                        <p className="fw-bold mb-3">
                          {trip.created_by || 'N/A'}
                        </p>
                        
                        <h6 className="text-muted mb-1">Creation Date</h6>
                        <p className="fw-bold">
                          {new Date(trip.created_at).toLocaleDateString()}
                        </p>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            
            {trip.notes && (
              <Card className="border-0 shadow-sm mb-4">
                <Card.Body>
                  <h5 className="mb-3 fw-bold" style={{ color: THEME.primary }}>
                    <i className="fas fa-sticky-note me-2"></i> Notes
                  </h5>
                  <p className="mb-0">{trip.notes}</p>
                </Card.Body>
              </Card>
            )}
            
            {/* Passenger List Section */}
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body>
                <h5 className="mb-3 fw-bold" style={{ color: THEME.primary }}>
                  <i className="fas fa-users me-2"></i> Passengers
                  <Badge bg="secondary" className="ms-2 px-3 py-1">
                    {passengers.length}
                  </Badge>
                </h5>
                
                {passengers.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted mb-0">No passengers booked for this trip yet</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <Table hover className="passenger-table">
                      <thead>
                        <tr>
                          <th>Ticket #</th>
                          <th>Passenger</th>
                          <th>Seat</th>
                          <th>Type</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {passengers.map((ticket) => (
                          <tr key={ticket.id}>
                            <td>{ticket.ticket_number}</td>
                            <td>
                              {ticket.passenger?.name || 'Unknown'}
                            </td>
                            <td>{ticket.seat_number || 'N/A'}</td>
                            <td>{ticket.age_group || 'Regular'}</td>
                            <td>{getBoardingStatusBadge(ticket.boarding_status)}</td>
                            <td>
                              <Button 
                                variant="outline-primary"
                                size="sm"
                                className="me-2"
                                onClick={() => navigate(`/passenger-info/${ticket.passenger?.id}`)}
                              >
                                <i className="fas fa-user me-1"></i> View Passenger
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default TripDetails;