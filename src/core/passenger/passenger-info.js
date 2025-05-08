import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../navbar/navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Container, Row, Col, Card, Badge, Button, Spinner } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaTicketAlt, FaShip, FaArrowLeft, FaClock } from 'react-icons/fa';
import '../../css/passenger/passenger.css';

function PassengerInfo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [passenger, setPassenger] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const apiUrl = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';

  useEffect(() => {
    const fetchPassengerData = async () => {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }
      
      try {
        // Fetch passenger details
        const passengerResponse = await axios.get(`${apiUrl}/api/passengers/${id}/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        });

        setPassenger(passengerResponse.data);

        // Fetch tickets for this passenger
        try {
          const ticketsResponse = await axios.get(`${apiUrl}/api/tickets/by-passenger/${id}/`, {
            headers: {
              Authorization: `Token ${token}`,
            },
          });
          
          setTickets(ticketsResponse.data || []);
        } catch (ticketError) {
          console.error('Error fetching passenger tickets:', ticketError);
          setTickets([]);
        }
      } catch (error) {
        console.error('Error fetching passenger:', error);
        setError('Failed to fetch passenger information');
      } finally {
        setLoading(false);
      }
    };

    fetchPassengerData();
  }, [id, apiUrl]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const calculateDuration = (departureTime, arrivalTime) => {
    if (!departureTime || !arrivalTime) return 'N/A';
    
    const departureDate = new Date(departureTime);
    const arrivalDate = new Date(arrivalTime);
    
    // Calculate the difference in minutes
    const duration = (arrivalDate - departureDate) / (1000 * 60);
    
    if (isNaN(duration) || duration < 0) return 'N/A';
    
    const hours = Math.floor(duration / 60);
    const minutes = Math.floor(duration % 60);
    
    return `${hours}h ${minutes}m`;
  };

  const getBoardingStatusColor = (status) => {
    if (!status) return '#6c757d'; // Default gray
    
    switch(status.toUpperCase()) {
      case 'BOARDED':
        return '#34a853'; // Green
      case 'NOT_BOARDED':
        return '#fbbc04'; // Yellow
      case 'CANCELLED':
        return '#ea4335'; // Red
      default:
        return '#6c757d'; // Gray
    }
  };

  if (error) {
    return (
      <div>
        <Navbar />
        <Container className="mt-5">
          <Card className="shadow-sm border-0">
            <Card.Body className="text-center p-5">
              <div className="text-danger mb-3">
                <i className="fas fa-exclamation-circle fa-3x"></i>
              </div>
              <h4>{error}</h4>
              <p className="text-muted">Unable to load passenger information</p>
              <Button 
                variant="outline-light" 
                onClick={() => navigate('/passenger')}
                className="back-btn"
                style={{ backgroundColor: '#091057', width: 'auto', minWidth: '120px' }}
              >
                <FaArrowLeft className="me-2" /> Back to List
              </Button>
            </Card.Body>
          </Card>
        </Container>
      </div>
    );
  }

  if (!passenger) {
    return (
      <div>
        <Navbar />
        <Container className="mt-5 text-center">
          <p>No passenger information found</p>
          <Button 
            variant="outline-light" 
            onClick={() => navigate('/passenger')}
            className="back-btn"
            style={{ backgroundColor: '#091057', width: 'auto', minWidth: '120px' }}
          >
            <FaArrowLeft className="me-2" /> Back to List
          </Button>
        </Container>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <Container fluid className="mt-4 px-4">
        {/* Passenger Header */}
        <Card className="shadow-sm border-0 mb-4">
          <Card.Header>
            <Row className="align-items-center">
              <Col>
                <h4 className="mb-0">Passenger Information</h4>
              </Col>
              <Col xs="auto">
                <Button 
                  variant="outline-light" 
                  onClick={() => navigate('/passenger')}
                  className="back-btn"
                  style={{ backgroundColor: '#091057', width: 'auto', minWidth: '120px' }}
                >
                  <FaArrowLeft className="me-2" /> Back to List
                </Button>
              </Col>
            </Row>
          </Card.Header>
          <Card.Body className="py-4">
            <Row>
              <Col md={4} className="mb-4 mb-md-0">
                <div className="d-flex flex-column align-items-center text-center">
                  <div className="rounded-circle bg-light d-flex justify-content-center align-items-center" 
                       style={{ width: '120px', height: '120px' }}>
                    <FaUser size={48} color="#091057" />
                  </div>
                  <h4 className="mt-3">{passenger.name}</h4>
                </div>
              </Col>
              
              <Col md={8}>
                <Row>
                  <Col md={6} className="mb-3">
                    <div className="info-section">
                      <div className="d-flex align-items-center mb-2">
                        <FaEnvelope className="me-2" style={{ color: '#091057' }} />
                        <div className="info-label">Email</div>
                      </div>
                      <div className="info-value">{passenger.email || 'Not provided'}</div>
                    </div>
                  </Col>
                  <Col md={6} className="mb-3">
                    <div className="info-section">
                      <div className="d-flex align-items-center mb-2">
                        <FaPhone className="me-2" style={{ color: '#091057' }} />
                        <div className="info-label">Phone</div>
                      </div>
                      <div className="info-value">{passenger.phone || passenger.contact || 'Not provided'}</div>
                    </div>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6} className="mb-3">
                    <div className="info-section">
                      <div className="d-flex align-items-center mb-2">
                        <FaCalendarAlt className="me-2" style={{ color: '#091057' }} />
                        <div className="info-label">Created On</div>
                      </div>
                      <div className="info-value">{formatDate(passenger.created_at)}</div>
                    </div>
                  </Col>
                  <Col md={6} className="mb-3">
                    <div className="info-section">
                      <div className="d-flex align-items-center mb-2">
                        <FaCalendarAlt className="me-2" style={{ color: '#091057' }} />
                        <div className="info-label">Last Updated</div>
                      </div>
                      <div className="info-value">{formatDate(passenger.updated_at)}</div>
                    </div>
                  </Col>
                </Row>
                
                <div className="booking-stats mt-2">
                  <div className="stat-card">
                    <div className="stat-value">{tickets.length || 0}</div>
                    <div className="stat-label">Total Tickets</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">
                      {tickets.filter(ticket => ticket.trip?.status === 'COMPLETED').length || 0}
                    </div>
                    <div className="stat-label">Completed Trips</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">
                      {tickets.filter(ticket => 
                        ticket.trip?.status === 'SCHEDULED' || ticket.trip?.status === 'ACTIVE'
                      ).length || 0}
                    </div>
                    <div className="stat-label">Upcoming Trips</div>
                  </div>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        
        {/* Tickets Section */}
        <Card className="shadow-sm border-0">
          <Card.Header>
            <div className="d-flex align-items-center">
              <FaTicketAlt className="me-2" />
              <h5 className="mb-0">Ticket History</h5>
            </div>
          </Card.Header>
          <Card.Body>
            {tickets.length === 0 ? (
              <div className="text-center py-4">
                <FaTicketAlt size={48} className="mb-3 text-muted" />
                <p>No tickets found for this passenger</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Ticket Number</th>
                      <th>Trip</th>
                      <th>Date</th>
                      <th>Duration</th>
                      <th>Status</th>
                      <th>Class</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map((ticket, index) => (
                      <tr key={index}>
                        <td>{ticket.ticket_number}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <FaShip className="me-2 text-muted" />
                            {ticket.trip?.origin} to {ticket.trip?.destination}
                          </div>
                        </td>
                        <td>{formatDate(ticket.trip?.departure_time)}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <FaClock className="me-2 text-muted" />
                            {calculateDuration(ticket.trip?.departure_time, ticket.trip?.arrival_time)}
                          </div>
                        </td>
                        <td>
                          <span className="badge" style={{
                              backgroundColor: getBoardingStatusColor(ticket.boarding_status),
                            color: ticket.boarding_status?.toUpperCase() === 'NOT_BOARDED' ? '#212529' : 'white',
                            padding: '6px 10px'
                          }}>
                            {ticket.boarding_status?.replace(/_/g, ' ') || 'NOT BOARDED'}
                          </span>
                        </td>
                        <td>{ticket.ticket_class || 'Standard'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default PassengerInfo;