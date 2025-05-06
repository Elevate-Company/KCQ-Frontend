import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Table, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import Barcode from 'react-barcode';
import { toast } from 'react-toastify';
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
  const [boardingStatus, setBoardingStatus] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  
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
      setBoardingStatus(response.data.passenger?.boarding_status || 'NOT_CHECKED_IN');
      setLoading(false);
    } catch (error) {
      console.error('Error fetching ticket details:', error);
      setError('Failed to fetch ticket details');
      setLoading(false);
    }
  };

  const updateBoardingStatus = async () => {
    if (!ticket || !ticket.passenger) return;
    
    setUpdating(true);
    const token = localStorage.getItem('accessToken');
    
    try {
      await axios.patch(`${apiUrl}/api/passengers/${ticket.passenger.id}/update-boarding-status/`, 
        { boarding_status: boardingStatus },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
        }
      );
      
      // Update the local ticket state
      setTicket({
        ...ticket,
        passenger: {
          ...ticket.passenger,
          boarding_status: boardingStatus
        }
      });
      
      setUpdateSuccess(true);
      toast.success('Boarding status updated successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating boarding status:', error);
      toast.error('Failed to update boarding status');
    } finally {
      setUpdating(false);
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
            {updateSuccess && (
              <Alert variant="success" className="mb-4">
                Boarding status updated successfully!
              </Alert>
            )}
            
            <div className="d-flex flex-column flex-md-row align-items-center mb-4">
              <div className="me-md-4 mb-3 mb-md-0 text-center">
                <div className="d-inline-block p-3 border rounded">
                  <Barcode 
                    value={ticket.ticket_number}
                    width={1.5}
                    height={50}
                    fontSize={14}
                    margin={5}
                    background="#fff"
                    lineColor={THEME.dark}
                  />
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
                    className="me-3 px-3 py-1 rounded-pill" 
                    style={{ 
                      backgroundColor: getBoardingStatusColor(ticket.passenger?.boarding_status), 
                      color: 'white',
                      fontSize: '0.85rem'
                    }}
                  >
                    {ticket.passenger?.boarding_status?.replace(/_/g, ' ') || 'NOT CHECKED IN'}
                  </span>
                  <div className="ms-auto mt-2 mt-md-0">
                    <span className="fw-medium me-2">Update status:</span>
                    <Form.Select 
                      size="sm" 
                      style={{ width: 'auto', display: 'inline-block' }}
                      value={boardingStatus}
                      onChange={(e) => setBoardingStatus(e.target.value)}
                      className="me-2"
                    >
                      <option value="NOT_CHECKED_IN">NOT CHECKED IN</option>
                      <option value="CHECKED_IN">CHECKED IN</option>
                      <option value="BOARDED">BOARDED</option>
                    </Form.Select>
                    <Button 
                      style={{ backgroundColor: THEME.primary, borderColor: THEME.primary }}
                      size="sm"
                      onClick={updateBoardingStatus}
                      disabled={updating || boardingStatus === ticket.passenger?.boarding_status}
                    >
                      {updating ? 'Updating...' : 'Update'}
                    </Button>
                  </div>
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
                          <td className="text-muted">Age Group</td>
                          <td className="fw-medium text-capitalize">{ticket.age_group}</td>
                        </tr>
                        <tr>
                          <td className="text-muted">Price</td>
                          <td className="fw-medium">PHP {ticket.price}</td>
                        </tr>
                        <tr>
                          <td className="text-muted">Discount</td>
                          <td className="fw-medium">PHP {ticket.discount}</td>
                        </tr>
                        <tr>
                          <td className="text-muted">Baggage Ticket</td>
                          <td className="fw-medium">{ticket.baggage_ticket ? 'Yes' : 'No'}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={6}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body>
                    <h6 className="mb-3 fw-bold">Trip Information</h6>
                    <Table borderless size="sm" className="details-table">
                      <tbody>
                        <tr>
                          <td className="text-muted" style={{width: '40%'}}>Origin</td>
                          <td className="fw-medium">{ticket.trip?.origin}</td>
                        </tr>
                        <tr>
                          <td className="text-muted">Destination</td>
                          <td className="fw-medium">{ticket.trip?.destination}</td>
                        </tr>
                        <tr>
                          <td className="text-muted">Departure</td>
                          <td className="fw-medium">{new Date(ticket.trip?.departure_time).toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td className="text-muted">Arrival</td>
                          <td className="fw-medium">{new Date(ticket.trip?.arrival_time).toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td className="text-muted">Boat Type</td>
                          <td className="fw-medium">
                            {typeof ticket.trip?.ferry_boat === 'object' ? 
                              (ticket.trip.ferry_boat.name || ticket.trip.ferry_boat.slug || 'N/A') : 
                              ticket.trip?.ferry_boat || 'N/A'
                            }
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <h6 className="mb-3 fw-bold">Passenger Information</h6>
                <Table borderless size="sm" className="details-table">
                  <tbody>
                    <tr>
                      <td className="text-muted" style={{width: '25%'}}>Name</td>
                      <td className="fw-medium">{ticket.passenger?.name || 'N/A'}</td>
                      <td className="text-muted" style={{width: '25%'}}>Contact</td>
                      <td className="fw-medium">{ticket.passenger?.phone || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="text-muted">Email</td>
                      <td className="fw-medium">{ticket.passenger?.email || 'N/A'}</td>
                      <td className="text-muted">Created By</td>
                      <td className="fw-medium">{ticket.created_by || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="text-muted">Issue Date</td>
                      <td className="fw-medium">{new Date(ticket.issue_date).toLocaleString()}</td>
                      <td className="text-muted">Last Updated</td>
                      <td className="fw-medium">{new Date(ticket.updated_at).toLocaleString()}</td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default TicketDetails;