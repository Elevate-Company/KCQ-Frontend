import React from "react";
import { Card, Row, Col, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Ticket = () => {
  return (
    <Container className="my-4">
      <Card className="border-primary" style={{ maxWidth: "400px" }}>
        <Card.Header className="d-flex justify-content-between align-items-center bg-white border-bottom">
          <h5 className="mb-0 fw-bold">KCQ TICKET</h5>
          <span className="text-muted">12345678910 11:12</span>
        </Card.Header>

        <Card.Body>
          {/* First Passenger Section */}
          <section className="mb-4">
            <h6 className="fw-bold text-uppercase">Passenger</h6>
            <p className="fw-bold mb-2">PASSENGER NAME</p>
            <hr className="my-2" />

            <Row className="mb-2">
              <Col>
                <small className="text-muted">Departure Time</small>
                <p className="mb-0">9:00 AM</p>
              </Col>
              <Col>
                <small className="text-muted">Arrival Time</small>
                <p className="mb-0">12:39 PM</p>
              </Col>
            </Row>

            <Row className="mb-2">
              <Col>
                <small className="text-muted">Date</small>
                <p className="mb-0">15.12.24</p>
              </Col>
              <Col>
                <small className="text-muted">ID</small>
                <p className="mb-0">PBO-1234</p>
              </Col>
            </Row>

            <Row className="mb-2">
              <Col>
                <small className="text-muted">From</small>
                <p className="mb-0">Cebu</p>
              </Col>
              <Col>
                <small className="text-muted">To</small>
                <p className="mb-0">Bantayan</p>
              </Col>
            </Row>

            <div className="mb-2">
              <small className="text-muted">Type Boat</small>
              <p className="mb-0">Pumboat Express</p>
            </div>
          </section>

          {/* Company Logo Section */}
          <div className="text-center mb-4">
            <h4 className="fw-bold mb-0">KCQ</h4>
            <h5 className="fw-bold text-uppercase">EXPRESS</h5>
          </div>

          {/* Second Passenger Section */}
          <section>
            <h6 className="fw-bold text-uppercase">Passenger</h6>
            <p className="fw-bold mb-2">PASSENGER NAME</p>
            <hr className="my-2" />

            <Row className="mb-2">
              <Col>
                <small className="text-muted">Date</small>
                <p className="mb-0">15.12.24</p>
              </Col>
              <Col>
                <small className="text-muted">ID</small>
                <p className="mb-0">PBO-1234</p>
              </Col>
            </Row>

            <Row className="mb-2">
              <Col>
                <small className="text-muted">From</small>
                <p className="mb-0">Cebu</p>
              </Col>
              <Col>
                <small className="text-muted">To</small>
                <p className="mb-0">Bantayan</p>
              </Col>
            </Row>
          </section>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Ticket;