import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Table, Alert } from 'react-bootstrap';
import axios from 'axios';
import QRCode from 'qrcode.react';
import Navbar from '../navbar/navbar';
import '../../css/manageticket/ticket-details.css';

// Define consistent colors for the application
const THEME = {
  primary: '#0a215a',  // Changed to match the sidebar dark blue
  secondary: '#071c4d', // Darker variant
  accent: '#e8f0fe',
  success: '#34a853',
  danger: '#ea4335',
  warning: '#fbbc04',
  dark: '#071440', 
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
      case 'CHECKED_IN':
        return THEME.success;
      case 'BOARDED':
        return THEME.primary;
      case 'NOT_CHECKED_IN':
        return THEME.warning;
      case 'CANCELLED':
        return THEME.danger;
      default:
        return '#6c757d'; // Gray
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Container className="mt-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
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
          <Card.Header className="bg-white border-0 pt-4 pb-0">
            <div className="d-flex justify-content-between align-items-center">
              <h1 className="mb-0 fw-bold">Ticket Details</h1>
              <Button 
                variant="light"
                className="view-details-button-managetrip"
                onClick={() => navigate('/manage-tickets')}
              >
                <i className="fas fa-arrow-left me-2"></i>
                Back to Tickets
              </Button>
            </div>
          </Card.Header>
          
          <Card.Body className="p-4">
            <div className="d-flex flex-column flex-md-row align-items-center mb-4">
              <div className="me-md-4 mb-3 mb-md-0 text-center">
                <div className="d-inline-block p-3 border rounded compact-qrcode">
                  <QRCode 
                    value={ticket.ticket_number}
                    size={120}
                    level="M"
                    includeMargin={true}
                    bgColor="#fff"
                    fgColor="#000000"
                    renderAs="svg"
                    style={{imageRendering: 'crisp-edges'}}
                  />
                  <div className="mt-2 text-center">
                    <small>{ticket.ticket_number}</small>
                  </div>
                </div>
              </div>
              <div className="flex-grow-1 text-center text-md-start">
                <h5 className="fw-bold mb-0">{ticket.passenger?.name || 'N/A'}</h5>
                <p className="text-muted mb-2">
                  <span className="mr-1">{ticket.trip?.origin || 'N/A'}</span>
                  <span style={{ fontSize: '10px', margin: '0 5px' }}>•••••••••••••</span>
                  <i className="fas fa-arrow-right mx-1"></i> 
                  <span>{ticket.trip?.destination || 'N/A'}</span>
                </p>
                <div className="d-flex flex-wrap align-items-center">
                  <span 
                    className="px-3 py-1 rounded-pill" 
                    style={{ 
                      backgroundColor: getBoardingStatusColor(ticket.passenger?.boarding_status), 
                      color: 'white',
                      fontSize: '0.85rem'
                    }}
                  >
                    {ticket.passenger?.boarding_status?.replace(/_/g, ' ') || 'NOT CHECKED IN'}
                  </span>
                </div>
              </div>
            </div>
            
            <Row className="g-4 mb-4">
              <Col md={6}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body>
                    <h6 className="mb-3 fw-bold">Ticket Information</h6>
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
                          <td className="text-muted">Ticket Type</td>
                          <td className="fw-medium">{ticket.ticket_type || 'Standard'}</td>
                        </tr>
                        <tr>
                          <td className="text-muted">Price</td>
                          <td className="fw-medium">₱{ticket.price || 'N/A'}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={6}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body>
                    <h6 className="mb-3 fw-bold">Passenger Information</h6>
                    <Table borderless size="sm" className="details-table">
                      <tbody>
                        <tr>
                          <td className="text-muted" style={{width: '40%'}}>Name</td>
                          <td className="fw-medium">{ticket.passenger?.name || 'N/A'}</td>
                        </tr>
                        <tr>
                          <td className="text-muted">Contact Number</td>
                          <td className="fw-medium">{ticket.passenger?.contact_number || 'N/A'}</td>
                        </tr>
                        <tr>
                          <td className="text-muted">Email</td>
                          <td className="fw-medium">{ticket.passenger?.email || 'N/A'}</td>
                        </tr>
                        <tr>
                          <td className="text-muted">ID Number</td>
                          <td className="fw-medium">{ticket.passenger?.id_number || 'N/A'}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body>
                <h6 className="mb-3 fw-bold">Trip Information</h6>
                <Row>
                  <Col md={6}>
                    <Table borderless size="sm" className="details-table">
                      <tbody>
                        <tr>
                          <td className="text-muted" style={{width: '40%'}}>Origin</td>
                          <td className="fw-medium">{ticket.trip?.origin || 'N/A'}</td>
                        </tr>
                        <tr>
                          <td className="text-muted">Destination</td>
                          <td className="fw-medium">{ticket.trip?.destination || 'N/A'}</td>
                        </tr>
                        <tr>
                          <td className="text-muted">Ferry</td>
                          <td className="fw-medium">
                            {typeof ticket.trip?.ferry_boat === 'object' 
                              ? (ticket.trip.ferry_boat.name || 'N/A') 
                              : (ticket.trip?.ferry_boat || 'N/A')}
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                  <Col md={6}>
                    <Table borderless size="sm" className="details-table">
                      <tbody>
                        <tr>
                          <td className="text-muted" style={{width: '40%'}}>Departure Date</td>
                          <td className="fw-medium">
                            {ticket.trip?.departure_time 
                              ? new Date(ticket.trip.departure_time).toLocaleDateString() 
                              : 'N/A'}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-muted">Departure Time</td>
                          <td className="fw-medium">
                            {ticket.trip?.departure_time 
                              ? new Date(ticket.trip.departure_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
                              : 'N/A'}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-muted">Duration</td>
                          <td className="fw-medium">{ticket.trip?.duration || 'N/A'}</td>
                        </tr>
                      </tbody>
                    </Table>
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