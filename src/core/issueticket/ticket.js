import React, { useRef, useEffect, useState } from "react";
import { Card, Row, Col, Container, Badge, Button } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import moment from "moment";
import axios from 'axios';
import QRCode from 'qrcode.react';
import '../../css/issueticket/ticket.css';

// Define consistent colors for the application
const THEME = {
  primary: '#0a215a',  // Dark blue
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
    // Set a slight delay to ensure all styles are applied
    setTimeout(() => {
      // Save the current document title
      const originalTitle = document.title;
      
      // Change title for the print job
      document.title = `KCQ Express Ticket - ${ticketsToPrint[0]?.ticket_number || 'Ticket'}`;
      
      // Print the document
      window.print();
      
      // Restore the original title
      setTimeout(() => {
        document.title = originalTitle;
      }, 100);
    }, 300);
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
              {/* Main Ticket Container */}
              <div className="ticket-main">
                {/* Passenger Section - Blue bordered design */}
                <div className="passenger-section">
                  <div className="passenger-header">
                    Passenger
                  </div>
                  <div className="passenger-name">
                    {getPassengerName(ticket).toUpperCase()}
                  </div>
                  
                  <div className="passenger-details">
                    <div className="detail-row">
                      <div className="detail-cell">
                        <div className="detail-label">Departure Time</div>
                        <div className="detail-value">{departureTime}</div>
                      </div>
                      <div className="detail-cell">
                        <div className="detail-label">Arrival Time</div>
                        <div className="detail-value">{arrivalTime}</div>
                      </div>
                    </div>
                    
                    <div className="detail-row">
                      <div className="detail-cell">
                        <div className="detail-label">Date</div>
                        <div className="detail-value">{date}</div>
                      </div>
                      <div className="detail-cell">
                        <div className="detail-label">ID</div>
                        <div className="detail-value">{ticket.ticket_number}</div>
                      </div>
                    </div>
                    
                    <div className="detail-row">
                      <div className="detail-cell">
                        <div className="detail-label">From</div>
                        <div className="detail-value">{ticket.trip?.origin}</div>
                      </div>
                      <div className="detail-cell">
                        <div className="detail-label">To</div>
                        <div className="detail-value">{ticket.trip?.destination}</div>
                      </div>
                    </div>
                    
                    <div className="detail-row">
                      <div className="detail-cell">
                        <div className="detail-label">Type</div>
                        <div className="detail-value text-capitalize">{ticket.age_group}</div>
                      </div>
                      <div className="detail-cell">
                        <div className="detail-label">Seat</div>
                        <div className="detail-value">{ticket.seat_number}</div>
                      </div>
                    </div>
                    
                    <div className="detail-row">
                      <div className="detail-cell full-width">
                        <div className="detail-label">Vessel</div>
                        <div className="detail-value">KCQ Express</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Separation line for cutting */}
                <div className="ticket-separation"></div>
                
                {/* Staff Section - Navy header with compact layout */}
                <div className="staff-section">
                  <div className="staff-header">
                    <div className="company-logo">
                      <i className="fas fa-ship"></i> KCQ EXPRESS
                    </div>
                    <div className="ticket-id">
                      {ticket.ticket_number}
                    </div>
                  </div>
                  
                  <div className="staff-content">
                    <div className="staff-info">
                      <div className="staff-row">
                        <div className="staff-label">Passenger:</div>
                        <div className="staff-value">{getPassengerName(ticket)}</div>
                      </div>
                      <div className="staff-row">
                        <div className="staff-label">Trip:</div>
                        <div className="staff-value">{ticket.trip?.origin} to {ticket.trip?.destination}</div>
                      </div>
                      <div className="staff-row">
                        <div className="staff-label">Date:</div>
                        <div className="staff-value">{date}</div>
                      </div>
                      <div className="staff-row">
                        <div className="staff-label">Time:</div>
                        <div className="staff-value">{departureTime}</div>
                      </div>
                      <div className="staff-row">
                        <div className="staff-label">Seat:</div>
                        <div className="staff-value">{ticket.seat_number}</div>
                      </div>
                      <div className="staff-row">
                        <div className="staff-label">Type:</div>
                        <div className="staff-value text-capitalize">{ticket.age_group}</div>
                      </div>
                    </div>
                    <div className="staff-qr">
                      <QRCode 
                        value={ticket.ticket_number || `T-${Date.now()}`} 
                        size={50}
                        level="M"
                        includeMargin={false}
                        bgColor="#fff"
                        fgColor="#000000"
                        renderAs="svg"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Print Button - Will be hidden during printing */}
              <div className="text-center mt-3 print-button">
                <Button 
                  onClick={handlePrint}
                  variant="primary"
                  className="print-btn"
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