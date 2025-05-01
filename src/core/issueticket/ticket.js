import React from "react";
import { Card, Row, Col, Container } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import moment from "moment";

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
          <Card key={index} className="border-primary mb-4" style={{ maxWidth: "400px" }}>
            <Card.Header className="d-flex justify-content-between align-items-center bg-white border-bottom">
              <h5 className="mb-0 fw-bold">KCQ TICKET</h5>
              <span className="text-muted">{ticket.ticket_number}</span>
            </Card.Header>

            <Card.Body>
              {/* Passenger Section */}
              <section className="mb-4">
                <h6 className="fw-bold text-uppercase">Passenger</h6>
                <p className="fw-bold mb-2">{getPassengerName(ticket)?.toUpperCase()}</p>
                <hr className="my-2" />

                <Row className="mb-2">
                  <Col>
                    <small className="text-muted">Departure Time</small>
                    <p className="mb-0">{departureTime}</p>
                  </Col>
                  <Col>
                    <small className="text-muted">Arrival Time</small>
                    <p className="mb-0">{arrivalTime}</p>
                  </Col>
                </Row>

                <Row className="mb-2">
                  <Col>
                    <small className="text-muted">Date</small>
                    <p className="mb-0">{date}</p>
                  </Col>
                  <Col>
                    <small className="text-muted">Seat</small>
                    <p className="mb-0">{ticket.seat_number || 'N/A'}</p>
                  </Col>
                </Row>

                <Row className="mb-2">
                  <Col>
                    <small className="text-muted">From</small>
                    <p className="mb-0">{ticket.trip?.origin || 'N/A'}</p>
                  </Col>
                  <Col>
                    <small className="text-muted">To</small>
                    <p className="mb-0">{ticket.trip?.destination || 'N/A'}</p>
                  </Col>
                </Row>

                <div className="mb-2">
                  <small className="text-muted">Ferry</small>
                  <p className="mb-0">{ticket.trip?.ferry_boat?.name || 'N/A'}</p>
                </div>

                <div className="mb-2">
                  <small className="text-muted">Type</small>
                  <p className="mb-0">{ticket.age_group}</p>
                </div>
              </section>

              {/* Company Logo Section */}
              <div className="text-center mb-4">
                <h4 className="fw-bold mb-0">KCQ</h4>
                <h5 className="fw-bold text-uppercase">EXPRESS</h5>
              </div>

              {/* Additional Info Section */}
              <section>
                <h6 className="fw-bold text-uppercase">Additional Info</h6>
                <hr className="my-2" />

                <Row className="mb-2">
                  <Col>
                    <small className="text-muted">Price</small>
                    <p className="mb-0">PHP {ticket.price}</p>
                  </Col>
                  <Col>
                    <small className="text-muted">Discount</small>
                    <p className="mb-0">PHP {ticket.discount}</p>
                  </Col>
                </Row>

                <Row className="mb-2">
                  <Col>
                    <small className="text-muted">Baggage</small>
                    <p className="mb-0">{ticket.baggage_ticket ? 'Yes' : 'No'}</p>
                  </Col>
                  <Col>
                    <small className="text-muted">Status</small>
                    <p className="mb-0">{ticket.passenger?.boarding_status || 'NOT CHECKED IN'}</p>
                  </Col>
                </Row>
              </section>
            </Card.Body>
          </Card>
        );
      })}
    </Container>
  );
};

export default Ticket;