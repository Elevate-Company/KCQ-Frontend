import React from "react";
import { Card, Row, Col, Container, Badge } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import moment from "moment";
import axios from 'axios';
import Barcode from 'react-barcode';

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

const Ticket = () => {
  const location = useLocation();
  const tickets = location.state?.tickets || [];

  if (!tickets.length) {
    return (
      <Container className="my-4">
        <div className="alert alert-warning">No ticket data available</div>
      </Container>
    );
  }

  console.log('Ticket data:', tickets);  // Add this to debug

  const getPassengerName = (ticket) => {
    // First try to get from nested passenger object
    if (ticket.passenger && typeof ticket.passenger === 'object') {
      return ticket.passenger.name;
    }
    // If passenger is just an ID, return placeholder
    return 'N/A';
  };

  const getPaymentMethodIcon = (method) => {
    switch(method) {
      case 'GCASH':
        return <i className="fas fa-mobile-alt" style={{ color: THEME.primary }}></i>;
      case 'MAYA':
        return <i className="fas fa-credit-card" style={{ color: THEME.danger }}></i>;
      default:
        return <i className="fas fa-money-bill-wave" style={{ color: THEME.success }}></i>;
    }
  };

  const getTripDetails = async (ticket) => {
    if (!ticket.trip || typeof ticket.trip === 'number') {
      const token = localStorage.getItem('accessToken');
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/trips/${ticket.trip}/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        console.error('Error fetching trip details:', error);
        return null;
      }
    }
    return ticket.trip;
  };

  return (
    <Container className="my-4">
      {tickets.map((ticket, index) => {
        // Format the departure and arrival times
        const departureTime = ticket.trip?.departure_time ? 
          moment(ticket.trip.departure_time).format('h:mm A') : 'N/A';
        const arrivalTime = ticket.trip?.arrival_time ? 
          moment(ticket.trip.arrival_time).format('h:mm A') : 'N/A';
        const date = ticket.trip?.departure_time ? 
          moment(ticket.trip.departure_time).format('DD.MM.YY') : 'N/A';

        return (
          <Card key={index} className="mb-4 mx-auto" style={{ 
            maxWidth: "450px", 
            boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
            borderRadius: "12px",
            overflow: "hidden",
            border: `2px solid ${THEME.primary}`
          }}>
            {/* Header Section with ferry logo and ticket number */}
            <div style={{ 
              background: THEME.primary,
              color: "white",
              padding: "16px",
              borderBottom: `1px solid ${THEME.primary}`
            }}>
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <i className="fas fa-ship fa-2x me-2"></i>
                  <div>
                    <h4 className="mb-0 fw-bold">KCQ EXPRESS</h4>
                    <small>Ferry Ticketing System</small>
                  </div>
                </div>
                <Badge 
                  style={{ 
                    background: "white", 
                    color: THEME.primary, 
                    padding: "8px 12px",
                    borderRadius: "6px",
                    fontWeight: "600"
                  }}
                >
                  {ticket.ticket_number}
                </Badge>
              </div>
            </div>

            <Card.Body style={{ padding: "20px" }}>
              {/* Passenger Details Section */}
              <div className="mb-4">
                <div className="d-flex align-items-center mb-2">
                  <i className="fas fa-user-circle me-2" style={{ color: THEME.primary }}></i>
                  <h6 className="fw-bold text-uppercase mb-0" style={{ color: THEME.primary, letterSpacing: "1px" }}>
                    PASSENGER DETAILS
                  </h6>
                </div>
                <h5 className="fw-bold mb-3">{getPassengerName(ticket)?.toUpperCase()}</h5>
              </div>

              {/* Trip Details Section */}
              <Row className="g-3 mb-4">
                <Col xs={6}>
                  <div className="d-flex align-items-center mb-2">
                    <i className="fas fa-anchor me-2" style={{ color: THEME.primary }}></i>
                    <span className="text-muted">From</span>
                  </div>
                  <h6 className="fw-bold">{ticket.trip?.origin || 'Manila Bay'}</h6>
                </Col>
                <Col xs={6}>
                  <div className="d-flex align-items-center mb-2">
                    <i className="fas fa-map-marker-alt me-2" style={{ color: THEME.primary }}></i>
                    <span className="text-muted">To</span>
                  </div>
                  <h6 className="fw-bold">{ticket.trip?.destination || 'Bataan'}</h6>
                </Col>
              </Row>

              {/* Time and Date Section */}
              <Row className="g-3 mb-4">
                <Col xs={4}>
                  <div className="d-flex align-items-center mb-2">
                    <i className="fas fa-hourglass-start me-2" style={{ color: THEME.primary }}></i>
                    <span className="text-muted">Departure</span>
                  </div>
                  <h6 className="fw-bold">{departureTime}</h6>
                </Col>
                <Col xs={4}>
                  <div className="d-flex align-items-center mb-2">
                    <i className="fas fa-hourglass-end me-2" style={{ color: THEME.primary }}></i>
                    <span className="text-muted">Arrival</span>
                  </div>
                  <h6 className="fw-bold">{arrivalTime}</h6>
                </Col>
                <Col xs={4}>
                  <div className="d-flex align-items-center mb-2">
                    <i className="fas fa-calendar-alt me-2" style={{ color: THEME.primary }}></i>
                    <span className="text-muted">Date</span>
                  </div>
                  <h6 className="fw-bold">{date}</h6>
                </Col>
              </Row>

              {/* Seat and Type Section */}
              <Row className="g-3 mb-4">
                <Col xs={4}>
                  <div className="d-flex align-items-center mb-2">
                    <i className="fas fa-chair me-2" style={{ color: THEME.primary }}></i>
                    <span className="text-muted">Seat</span>
                  </div>
                  <h6 className="fw-bold">{ticket.seat_number || '3'}</h6>
                </Col>
                <Col xs={4}>
                  <div className="d-flex align-items-center mb-2">
                    <i className="fas fa-ship me-2" style={{ color: THEME.primary }}></i>
                    <span className="text-muted">Ferry</span>
                  </div>
                  <h6 className="fw-bold">{ticket.trip?.ferry_boat?.name || 'N/A'}</h6>
                </Col>
                <Col xs={4}>
                  <div className="d-flex align-items-center mb-2">
                    <i className="fas fa-user me-2" style={{ color: THEME.primary }}></i>
                    <span className="text-muted">Type</span>
                  </div>
                  <h6 className="fw-bold text-capitalize">{ticket.age_group || 'Adult'}</h6>
                </Col>
              </Row>

              {/* Divider */}
              <div className="text-center mb-4">
                <div style={{ 
                  height: "1px", 
                  background: `linear-gradient(to right, transparent, ${THEME.primary}80, transparent)`,
                  margin: "20px 0"
                }}></div>
              </div>

              {/* Company Logo Section */}
              <div className="text-center mb-4">
                <div className="d-flex justify-content-center align-items-center" style={{
                  background: THEME.primary,
                  padding: "15px",
                  borderRadius: "8px"
                }}>
                  <i className="fas fa-ship fa-2x me-2" style={{ color: "white" }}></i>
                  <div>
                    <h3 className="fw-bold mb-0 text-white">KCQ</h3>
                    <h5 className="fw-bold text-uppercase" style={{ color: "white" }}>EXPRESS</h5>
                  </div>
                </div>
              </div>

              {/* Barcode Section */}
              <div className="text-center mb-4">
                <div style={{ 
                  background: "#fff", 
                  padding: "15px", 
                  borderRadius: "8px",
                  border: `1px solid ${THEME.primary}30`
                }}>
                  <Barcode 
                    value={ticket.ticket_number || `T-${Date.now()}`} 
                    width={1.5}
                    height={50}
                    fontSize={16}
                    margin={10}
                    background="#fff"
                    lineColor={THEME.dark}
                  />
                </div>
              </div>

              {/* Payment Information Section */}
              <div className="mb-4">
                <div className="d-flex align-items-center mb-3">
                  <i className="fas fa-credit-card me-2" style={{ color: THEME.primary }}></i>
                  <h6 className="fw-bold text-uppercase mb-0" style={{ color: THEME.primary, letterSpacing: "1px" }}>
                    PAYMENT INFORMATION
                  </h6>
                </div>
                
                <Row className="g-3 mb-3">
                  <Col xs={6}>
                    <div className="d-flex align-items-center">
                      {getPaymentMethodIcon(ticket.payment_method)}
                      <div className="ms-2">
                        <small className="text-muted d-block">Method</small>
                        <h6 className="mb-0 fw-bold">{ticket.payment_method || 'CASH'}</h6>
                      </div>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="d-flex align-items-center">
                      <i className="fas fa-tag me-2" style={{ color: THEME.primary }}></i>
                      <div>
                        <small className="text-muted d-block">Price</small>
                        <h6 className="mb-0 fw-bold">PHP {ticket.price || '400.00'}</h6>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>

              {/* Additional Info Section */}
              <div>
                <div className="d-flex align-items-center mb-3">
                  <i className="fas fa-info-circle me-2" style={{ color: THEME.primary }}></i>
                  <h6 className="fw-bold text-uppercase mb-0" style={{ color: THEME.primary, letterSpacing: "1px" }}>
                    ADDITIONAL INFO
                  </h6>
                </div>
                
                <Row className="g-3 mb-3">
                  <Col xs={6}>
                    <div className="d-flex align-items-center">
                      <i className="fas fa-percentage me-2" style={{ color: THEME.primary }}></i>
                      <div>
                        <small className="text-muted d-block">Discount</small>
                        <h6 className="mb-0 fw-bold">PHP {ticket.discount || '0.00'}</h6>
                      </div>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="d-flex align-items-center">
                      <i className="fas fa-suitcase me-2" style={{ color: THEME.primary }}></i>
                      <div>
                        <small className="text-muted d-block">Baggage</small>
                        <h6 className="mb-0 fw-bold">{ticket.baggage_ticket ? 'Yes' : 'No'}</h6>
                      </div>
                    </div>
                  </Col>
                </Row>

                <Row className="g-3">
                  <Col xs={6}>
                    <div className="d-flex align-items-center">
                      <i className="fas fa-user-check me-2" style={{ color: THEME.primary }}></i>
                      <div>
                        <small className="text-muted d-block">Status</small>
                        <h6 className="mb-0 fw-bold">{ticket.passenger?.boarding_status || 'NOT_CHECKED_IN'}</h6>
                      </div>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="d-flex align-items-center">
                      <i className="fas fa-calendar-check me-2" style={{ color: THEME.primary }}></i>
                      <div>
                        <small className="text-muted d-block">Issue Date</small>
                        <h6 className="mb-0 fw-bold">{moment(ticket.issue_date).format('MM/DD/YYYY')}</h6>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Card.Body>

            <Card.Footer style={{ 
              background: THEME.primary, 
              color: "white",
              textAlign: "center", 
              padding: "12px"
            }}>
              <div className="d-flex justify-content-center align-items-center">
                <i className="fas fa-ship me-2"></i>
                <span>Thank you for choosing KCQ Express!</span>
              </div>
            </Card.Footer>
          </Card>
        );
      })}
    </Container>
  );
};

export default Ticket;