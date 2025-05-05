import React from "react";
import { Card, Row, Col, Container, Badge } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import moment from "moment";
import axios from 'axios';

// Define consistent colors for the application
const THEME = {
  primary: '#1a73e8',
  secondary: '#0d47a1',
  accent: '#e8f0fe',
  success: '#34a853',
  danger: '#ea4335',
  warning: '#fbbc04',
  dark: '#202124',
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
            <div style={{ 
              background: `linear-gradient(135deg, ${THEME.primary}, ${THEME.secondary})`,
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
              {/* Passenger Section */}
              <div className="ticket-top-section mb-4 pb-3" style={{ borderBottom: `1px dashed ${THEME.primary}` }}>
                <h6 className="fw-bold text-uppercase" style={{ color: THEME.primary, letterSpacing: "1px" }}>
                  <i className="fas fa-user-circle me-2"></i>Passenger Details
                </h6>
                <p className="fw-bold mb-3 fs-5">{getPassengerName(ticket)?.toUpperCase()}</p>
                
                <Row className="g-3 mb-3">
                  <Col md={6}>
                    <div className="d-flex align-items-center">
                      <div style={{ width: "30px" }}>
                        <i className="fas fa-anchor" style={{ color: THEME.primary }}></i>
                      </div>
                      <div>
                        <small className="text-muted d-block">From</small>
                        <p className="mb-0 fw-semibold">{ticket.trip?.origin || 'N/A'}</p>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="d-flex align-items-center">
                      <div style={{ width: "30px" }}>
                        <i className="fas fa-map-marker-alt" style={{ color: THEME.primary }}></i>
                      </div>
                      <div>
                        <small className="text-muted d-block">To</small>
                        <p className="mb-0 fw-semibold">{ticket.trip?.destination || 'N/A'}</p>
                      </div>
                    </div>
                  </Col>
                </Row>

                <Row className="g-3 mb-3">
                  <Col md={4}>
                    <div className="d-flex align-items-center">
                      <div style={{ width: "30px" }}>
                        <i className="fas fa-hourglass-start" style={{ color: THEME.primary }}></i>
                      </div>
                      <div>
                        <small className="text-muted d-block">Departure</small>
                        <p className="mb-0 fw-semibold">{departureTime}</p>
                      </div>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="d-flex align-items-center">
                      <div style={{ width: "30px" }}>
                        <i className="fas fa-hourglass-end" style={{ color: THEME.primary }}></i>
                      </div>
                      <div>
                        <small className="text-muted d-block">Arrival</small>
                        <p className="mb-0 fw-semibold">{arrivalTime}</p>
                      </div>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="d-flex align-items-center">
                      <div style={{ width: "30px" }}>
                        <i className="fas fa-calendar-alt" style={{ color: THEME.primary }}></i>
                      </div>
                      <div>
                        <small className="text-muted d-block">Date</small>
                        <p className="mb-0 fw-semibold">{date}</p>
                      </div>
                    </div>
                  </Col>
                </Row>

                <Row className="g-3">
                  <Col md={4}>
                    <div className="d-flex align-items-center">
                      <div style={{ width: "30px" }}>
                        <i className="fas fa-chair" style={{ color: THEME.primary }}></i>
                      </div>
                      <div>
                        <small className="text-muted d-block">Seat</small>
                        <p className="mb-0 fw-semibold">{ticket.seat_number || 'N/A'}</p>
                      </div>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="d-flex align-items-center">
                      <div style={{ width: "30px" }}>
                        <i className="fas fa-ship" style={{ color: THEME.primary }}></i>
                      </div>
                      <div>
                        <small className="text-muted d-block">Ferry</small>
                        <p className="mb-0 fw-semibold">{ticket.trip?.ferry_boat?.name || 'N/A'}</p>
                      </div>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="d-flex align-items-center">
                      <div style={{ width: "30px" }}>
                        <i className="fas fa-user" style={{ color: THEME.primary }}></i>
                      </div>
                      <div>
                        <small className="text-muted d-block">Type</small>
                        <p className="mb-0 fw-semibold text-capitalize">{ticket.age_group}</p>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>

              {/* Company Logo Section */}
              <div className="text-center mb-4 py-3" style={{ 
                background: THEME.accent, 
                borderRadius: "8px",
                border: `1px solid ${THEME.primary}30`
              }}>
                <div className="d-flex justify-content-center align-items-center">
                  <i className="fas fa-ship fa-2x me-3" style={{ color: THEME.primary }}></i>
                  <div>
                    <h3 className="fw-bold mb-0">KCQ</h3>
                    <h5 className="fw-bold text-uppercase" style={{ color: THEME.primary }}>EXPRESS</h5>
                  </div>
                </div>
              </div>

              {/* Payment Info Section */}
              <div className="payment-info mb-4 pb-3" style={{ borderBottom: `1px dashed ${THEME.primary}` }}>
                <h6 className="fw-bold text-uppercase" style={{ color: THEME.primary, letterSpacing: "1px" }}>
                  <i className="fas fa-credit-card me-2"></i>Payment Information
                </h6>
                
                <Row className="g-3">
                  <Col md={6}>
                    <div className="d-flex align-items-center">
                      <div style={{ width: "30px" }}>
                        {getPaymentMethodIcon(ticket.payment_method)}
                      </div>
                      <div>
                        <small className="text-muted d-block">Payment Method</small>
                        <p className="mb-0 fw-semibold">{ticket.payment_method || 'CASH'}</p>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="d-flex align-items-center">
                      <div style={{ width: "30px" }}>
                        <i className="fas fa-tag" style={{ color: THEME.primary }}></i>
                      </div>
                      <div>
                        <small className="text-muted d-block">Price</small>
                        <p className="mb-0 fw-semibold">PHP {ticket.price}</p>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>

              {/* Additional Info Section */}
              <div className="additional-info">
                <h6 className="fw-bold text-uppercase" style={{ color: THEME.primary, letterSpacing: "1px" }}>
                  <i className="fas fa-info-circle me-2"></i>Additional Info
                </h6>
                
                <Row className="g-3">
                  <Col md={6}>
                    <div className="d-flex align-items-center">
                      <div style={{ width: "30px" }}>
                        <i className="fas fa-percentage" style={{ color: THEME.primary }}></i>
                      </div>
                      <div>
                        <small className="text-muted d-block">Discount</small>
                        <p className="mb-0 fw-semibold">PHP {ticket.discount}</p>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="d-flex align-items-center">
                      <div style={{ width: "30px" }}>
                        <i className="fas fa-suitcase" style={{ color: THEME.primary }}></i>
                      </div>
                      <div>
                        <small className="text-muted d-block">Baggage</small>
                        <p className="mb-0 fw-semibold">{ticket.baggage_ticket ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                  </Col>
                </Row>

                <Row className="g-3 mt-1">
                  <Col md={6}>
                    <div className="d-flex align-items-center">
                      <div style={{ width: "30px" }}>
                        <i className="fas fa-user-check" style={{ color: THEME.primary }}></i>
                      </div>
                      <div>
                        <small className="text-muted d-block">Status</small>
                        <p className="mb-0 fw-semibold">{ticket.passenger?.boarding_status || 'NOT CHECKED IN'}</p>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="d-flex align-items-center">
                      <div style={{ width: "30px" }}>
                        <i className="fas fa-calendar-check" style={{ color: THEME.primary }}></i>
                      </div>
                      <div>
                        <small className="text-muted d-block">Issue Date</small>
                        <p className="mb-0 fw-semibold">{moment(ticket.issue_date).format('MM/DD/YYYY')}</p>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Card.Body>
            <Card.Footer style={{ 
              background: THEME.light, 
              textAlign: "center", 
              borderTop: `1px solid ${THEME.primary}30`,
              padding: "12px"
            }}>
              <div className="d-flex justify-content-center align-items-center">
                <i className="fas fa-ship me-2" style={{ color: THEME.primary }}></i>
                <small>Thank you for choosing KCQ Express!</small>
              </div>
            </Card.Footer>
          </Card>
        );
      })}
    </Container>
  );
};

export default Ticket;