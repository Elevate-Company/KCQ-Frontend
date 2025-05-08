import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Table, Alert, Spinner, Badge } from 'react-bootstrap';
import axios from 'axios';
import QRCode from 'qrcode.react';
import Navbar from '../navbar/navbar';
import '../../css/manageticket/ticket-details.css';

// Define consistent colors for the application
const THEME = {
  primary: '#0a215a',  // Dark blue from the current design
  secondary: '#071c4d', // Darker variant
  accent: '#e8f0fe',
  success: '#34a853',
  danger: '#ea4335',
  warning: '#fbbc04',
  light: '#f8f9fa'
};

function TicketDetails() {
  const { ticketNumber } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';

  useEffect(() => {
    fetchTicketDetails();
  }, [ticketNumber]);

  const fetchTicketDetails = async () => {
    setLoading(true);
    const token = localStorage.getItem('accessToken');
    
    try {
      const response = await axios.get(`${apiUrl}/api/tickets/${ticketNumber}/`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      });
      
      setTicket(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching ticket details:', error);
      setError('Failed to fetch ticket details');
      setLoading(false);
    }
  };

  const getBoardingStatusColor = (status) => {
    switch(status) {
      case 'BOARDED':
        return THEME.success;
      case 'CHECKED_IN':
        return THEME.primary;
      case 'CANCELLED':
        return THEME.danger;
      case 'NOT_BOARDED':
      default:
        return THEME.warning;
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "70vh" }}>
          <Spinner animation="border" role="status" style={{ color: THEME.primary }}>
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Container>
      </>
    );
  }

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

  if (!ticket) {
    return (
      <>
        <Navbar />
        <Container className="mt-5">
          <Alert variant="warning">Ticket not found</Alert>
        </Container>
      </>
    );
  }

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
              <h2 className="mb-0 fw-bold">Ticket Details</h2>
              <Button 
                variant="outline-light"
                style={{ width: "150px" }}
                onClick={() => navigate('/manage-tickets')}
              >
                <i className="fas fa-arrow-left me-2"></i>
                Back to Tickets
              </Button>
            </div>
          </Card.Header>
          
          <Card.Body className="p-4">
            <div className="ticket-header d-flex flex-column flex-md-row align-items-center mb-4">
              <div className="qr-code-container me-md-4 mb-3 mb-md-0 text-center">
                <div className="d-inline-block p-3 border rounded">
                  <QRCode 
                    value={ticket.ticket_number}
                    size={120}
                    level="M"
                    includeMargin={true}
                    bgColor="#fff"
                    fgColor="#000000"
                    renderAs="svg"
                  />
                  <div className="mt-2 text-center">
                    <small>{ticket.ticket_number}</small>
                  </div>
                </div>
              </div>
              <div className="flex-grow-1 ticket-info text-center text-md-start">
                <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-2">
                  <h4 className="fw-bold mb-md-0">{ticket.passenger?.name || 'N/A'}</h4>
                  <Badge 
                    pill
                    bg="transparent"
                    style={{ 
                      backgroundColor: getBoardingStatusColor(ticket.boarding_status), 
                      color: 'white',
                      fontSize: '0.85rem',
                      padding: '8px 15px'
                    }}
                  >
                    {ticket.boarding_status?.replace(/_/g, ' ') || 'NOT BOARDED'}
                  </Badge>
                </div>
                <div className="route-display mb-2">
                  <div className="d-flex align-items-center">
                    <i className="fas fa-map-marker-alt text-primary me-2"></i>
                    <span className="fs-5">{ticket.trip?.origin || 'N/A'}</span>
                    <div className="route-line mx-3"></div>
                    <i className="fas fa-map-marker text-success me-2"></i>
                    <span className="fs-5">{ticket.trip?.destination || 'N/A'}</span>
                  </div>
                </div>
                <div className="d-flex flex-wrap mt-2">
                  <div className="me-3 mb-2">
                    <i className="fas fa-calendar-alt me-2 text-muted"></i>
                    <span className="text-muted">
                      {ticket.trip?.departure_time ? new Date(ticket.trip.departure_time).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <div className="me-3 mb-2">
                    <i className="fas fa-clock me-2 text-muted"></i>
                    <span className="text-muted">
                      {ticket.trip?.departure_time ? new Date(ticket.trip.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                    </span>
                  </div>
                  <div className="mb-2">
                    <i className="fas fa-chair me-2 text-muted"></i>
                    <span className="text-muted">Seat {ticket.seat_number || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <Row className="g-4 mb-4">
              <Col md={6}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body>
                    <h5 className="mb-3 fw-bold" style={{ color: THEME.primary }}>
                      <i className="fas fa-ticket-alt me-2"></i>
                      Ticket Information
                    </h5>
                    <Table borderless size="sm" className="details-table">
                      <tbody>
                        <tr>
                          <td className="text-muted" style={{width: '40%'}}>Ticket Number</td>
                          <td className="fw-medium">{ticket.ticket_number}</td>
                        </tr>
                        <tr>
                          <td className="text-muted">Seat Number</td>
                          <td className="fw-medium">{ticket.seat_number || 'N/A'}</td>
                        </tr>
                        <tr>
                          <td className="text-muted">Price</td>
                          <td className="fw-medium">₱{ticket.price || 'N/A'}</td>
                        </tr>
                        <tr>
                          <td className="text-muted">Ticket Type</td>
                          <td className="fw-medium">{ticket.age_group?.toUpperCase() || 'Standard'}</td>
                        </tr>
                        <tr>
                          <td className="text-muted">Baggage Included</td>
                          <td className="fw-medium">{ticket.baggage_ticket ? 'Yes' : 'No'}</td>
                        </tr>
                        <tr>
                          <td className="text-muted">Boarding Status</td>
                          <td className="fw-medium">
                            <span 
                              className="status-badge" 
                              style={{ 
                                backgroundColor: getBoardingStatusColor(ticket.boarding_status),
                                color: 'white',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '0.8rem'
                              }}
                            >
                              {ticket.boarding_status?.replace(/_/g, ' ') || 'NOT BOARDED'}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={6}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body>
                    <h5 className="mb-3 fw-bold" style={{ color: THEME.primary }}>
                      <i className="fas fa-user me-2"></i>
                      Passenger Information
                    </h5>
                    <Table borderless size="sm" className="details-table">
                      <tbody>
                        <tr>
                          <td className="text-muted" style={{width: '40%'}}>Name</td>
                          <td className="fw-medium">{ticket.passenger?.name || 'N/A'}</td>
                        </tr>
                        <tr>
                          <td className="text-muted">Passenger Phone</td>
                          <td className="fw-medium">{ticket.passenger?.phone || 'N/A'}</td>
                        </tr>
                        <tr>
                          <td className="text-muted">Email</td>
                          <td className="fw-medium">{ticket.passenger?.email || 'N/A'}</td>
                        </tr>
                        <tr>
                          <td className="text-muted">Passenger ID</td>
                          <td className="fw-medium">{ticket.passenger?.id || 'N/A'}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body>
                <h5 className="mb-3 fw-bold" style={{ color: THEME.primary }}>
                  <i className="fas fa-ship me-2"></i>
                  Trip Information
                </h5>
                <Row>
                  <Col md={6}>
                    <div className="d-flex">
                      <div className="route-detail-container">
                        <div className="route-detail-item">
                          <div className="route-detail-icon">
                            <div className="icon-circle origin">
                              <i className="fas fa-map-marker-alt"></i>
                            </div>
                            <div className="route-line"></div>
                          </div>
                          <div className="route-detail-text">
                            <small className="text-muted">Origin</small>
                            <p className="fw-medium">{ticket.trip?.origin || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="route-detail-item">
                          <div className="route-detail-icon">
                            <div className="icon-circle destination">
                              <i className="fas fa-map-marker"></i>
                            </div>
                          </div>
                          <div className="route-detail-text">
                            <small className="text-muted">Destination</small>
                            <p className="fw-medium">{ticket.trip?.destination || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ms-5">
                        <h6 className="text-muted">Boat Type</h6>
                        <p className="fw-medium mb-4">
                          {typeof ticket.trip?.ferry_boat === 'object' 
                            ? (ticket.trip.ferry_boat.slug || 'N/A') 
                            : (ticket.trip?.ferry_boat || 'N/A')}
                        </p>
                        
                        <h6 className="text-muted">Available Seats</h6>
                        <p className="fw-medium">
                          {ticket.trip?.available_seats || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="schedule-container p-3 bg-light rounded">
                      <div className="d-flex justify-content-between mb-4">
                        <div className="text-center">
                          <h6 className="text-muted mb-1">Departure</h6>
                          <div className="time-display">
                            <i className="fas fa-ship me-2 text-primary"></i>
                            {ticket.trip?.departure_time ? (
                              <div>
                                <p className="fw-bold mb-0">{new Date(ticket.trip.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                <small>{new Date(ticket.trip.departure_time).toLocaleDateString()}</small>
                              </div>
                            ) : (
                              <p className="fw-medium">N/A</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <h6 className="text-muted mb-1">Arrival</h6>
                          <div className="time-display">
                            <i className="fas fa-ship me-2 text-success"></i>
                            {ticket.trip?.arrival_time ? (
                              <div>
                                <p className="fw-bold mb-0">{new Date(ticket.trip.arrival_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                <small>{new Date(ticket.trip.arrival_time).toLocaleDateString()}</small>
                              </div>
                            ) : (
                              <p className="fw-medium">N/A</p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {ticket.trip?.departure_time && ticket.trip?.arrival_time && (
                        <div className="d-flex justify-content-center">
                          <div className="duration-display text-center">
                            <h6 className="text-muted mb-1">Duration</h6>
                            <p className="fw-bold">
                              {Math.round((new Date(ticket.trip.arrival_time) - new Date(ticket.trip.departure_time)) / (1000 * 60 * 60))} hours
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default TicketDetails;