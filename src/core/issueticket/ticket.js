import React, { useRef, useEffect, useState } from "react";
import { Card, Row, Col, Container, Badge, Button } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import moment from "moment";
import axios from 'axios';
import Barcode from 'react-barcode';
import '../../css/issueticket/ticket.css';

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
  const [ticketsToPrint, setTicketsToPrint] = useState([]);
  const ticketRef = useRef(null);

  useEffect(() => {
    // Update the tickets state when component mounts or tickets change
    setTicketsToPrint(tickets);
  }, [tickets]);

  if (!ticketsToPrint.length) {
    return (
      <Container className="my-4">
        <div className="alert alert-warning">No ticket data available</div>
      </Container>
    );
  }

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

  // Function to handle printing ticket
  const handlePrint = () => {
    // Using setTimeout to ensure React has updated the DOM before printing
    setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <Container className="my-4">
      {ticketsToPrint.map((ticket, index) => {
        // Format the departure and arrival times
        const departureTime = ticket.trip?.departure_time ? 
          moment(ticket.trip.departure_time).format('h:mm A') : 'N/A';
        const arrivalTime = ticket.trip?.arrival_time ? 
          moment(ticket.trip.arrival_time).format('h:mm A') : 'N/A';
        const date = ticket.trip?.departure_time ? 
          moment(ticket.trip.departure_time).format('DD.MM.YY') : 'N/A';

        return (
          <div key={index} className="printable-ticket" ref={ticketRef}>
            <div className="ticket-container">
              {/* Passenger Section */}
              <div className="passenger-section">
                <div style={{ 
                  background: THEME.primary,
                  color: "white",
                  padding: "10px",
                  borderBottom: `1px solid ${THEME.primary}`
                }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <i className="fas fa-ship fa-lg me-2"></i>
                      <div>
                        <h4 className="mb-0 fw-bold">KCQ EXPRESS</h4>
                        <small>Ferry Ticketing System</small>
                      </div>
                    </div>
                    <Badge 
                      style={{ 
                        background: "white", 
                        color: THEME.primary, 
                        padding: "6px 10px",
                        borderRadius: "4px",
                        fontWeight: "600"
                      }}
                    >
                      {ticket.ticket_number}
                    </Badge>
                  </div>
                </div>

                <div className="card-body-compact">
                  {/* Passenger Name and Basic Info */}
                  <Row className="compact-row">
                    <Col>
                      <h5 className="fw-bold mb-1">{getPassengerName(ticket)?.toUpperCase()}</h5>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div><small className="text-muted">{ticket.age_group || 'Adult'} • Seat {ticket.seat_number || 'N/A'}</small></div>
                        <div><small className="text-muted">{date}</small></div>
                      </div>
                    </Col>
                  </Row>

                  {/* From - To */}
                  <Row className="compact-row text-center">
                    <Col xs={5}>
                      <h6 className="fw-bold mb-0">{ticket.trip?.origin || 'Manila Bay'}</h6>
                      <small className="text-muted">{departureTime}</small>
                    </Col>
                    <Col xs={2} className="d-flex align-items-center justify-content-center">
                      <i className="fas fa-arrow-right text-muted"></i>
                    </Col>
                    <Col xs={5}>
                      <h6 className="fw-bold mb-0">{ticket.trip?.destination || 'Bataan'}</h6>
                      <small className="text-muted">{arrivalTime}</small>
                    </Col>
                  </Row>

                  {/* Ferry Info */}
                  <div className="text-center mt-2 mb-2">
                    <small className="text-muted">Ferry: {
                      typeof ticket.trip?.ferry_boat === 'object' ? 
                      (ticket.trip.ferry_boat.name || ticket.trip.ferry_boat.slug || 'N/A') : 
                      ticket.trip?.ferry_boat || 'N/A'
                    }</small>
                  </div>

                  {/* Barcode Section */}
                  <div className="text-center mb-2 compact-barcode">
                    <Barcode 
                      value={ticket.ticket_number || `T-${Date.now()}`} 
                      width={1}
                      height={40}
                      fontSize={10}
                      margin={5}
                      background="#fff"
                      lineColor={THEME.dark}
                      displayValue={true}
                    />
                  </div>
                  
                  <div className="text-center">
                    <small>PASSENGER COPY</small>
                  </div>
                </div>
              </div>

              {/* Staff Section */}
              <div className="staff-section">
                <div style={{ 
                  background: THEME.primary,
                  color: "white",
                  padding: "10px",
                  borderBottom: `1px solid ${THEME.primary}`
                }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <i className="fas fa-ship fa-lg me-2"></i>
                      <div>
                        <h4 className="mb-0 fw-bold">KCQ EXPRESS</h4>
                        <small>Ferry Ticketing System</small>
                      </div>
                    </div>
                    <Badge 
                      style={{ 
                        background: "white", 
                        color: THEME.primary, 
                        padding: "6px 10px",
                        borderRadius: "4px",
                        fontWeight: "600"
                      }}
                    >
                      {ticket.ticket_number}
                    </Badge>
                  </div>
                </div>

                <div className="card-body-compact">
                  {/* Compact Staff Copy */}
                  <Row className="compact-row">
                    <Col xs={12}>
                      <div className="d-flex justify-content-between mb-1">
                        <span className="detail-text text-muted">Passenger:</span>
                        <span className="detail-text fw-bold">{getPassengerName(ticket)}</span>
                      </div>
                      
                      <div className="d-flex justify-content-between mb-1">
                        <span className="detail-text text-muted">Route:</span>
                        <span className="detail-text fw-bold">{ticket.trip?.origin} → {ticket.trip?.destination}</span>
                      </div>
                      
                      <div className="d-flex justify-content-between mb-1">
                        <span className="detail-text text-muted">Time:</span>
                        <span className="detail-text fw-bold">{departureTime} - {arrivalTime}</span>
                      </div>
                      
                      <div className="d-flex justify-content-between mb-1">
                        <span className="detail-text text-muted">Date:</span>
                        <span className="detail-text fw-bold">{date}</span>
                      </div>
                      
                      <div className="d-flex justify-content-between mb-1">
                        <span className="detail-text text-muted">Seat:</span>
                        <span className="detail-text fw-bold">{ticket.seat_number}</span>
                      </div>
                      
                      <div className="d-flex justify-content-between mb-1">
                        <span className="detail-text text-muted">Type:</span>
                        <span className="detail-text fw-bold text-capitalize">{ticket.age_group}</span>
                      </div>
                    </Col>
                  </Row>

                  {/* Barcode Section */}
                  <div className="text-center mb-2 compact-barcode">
                    <Barcode 
                      value={ticket.ticket_number || `T-${Date.now()}`} 
                      width={1}
                      height={40}
                      fontSize={10}
                      margin={5}
                      background="#fff"
                      lineColor={THEME.dark}
                      displayValue={true}
                    />
                  </div>
                  
                  <div className="text-center">
                    <small>STAFF COPY</small>
                  </div>
                </div>
              </div>

              {/* Print Button - Will be hidden during printing */}
              <div className="text-center mt-3 print-button">
                <Button 
                  onClick={handlePrint}
                  variant="primary"
                  style={{ 
                    background: THEME.primary,
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    fontWeight: '600',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <i className="fas fa-print"></i> Print Ticket
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </Container>
  );
};

export default Ticket;