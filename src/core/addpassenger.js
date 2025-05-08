import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Card, Form, Button, Row, Col, Alert, Spinner } from "react-bootstrap";
import { FaUser, FaEnvelope, FaPhone, FaCalendarCheck, FaArrowLeft } from "react-icons/fa";
import Navbar from "./navbar/navbar";
import "../css/passenger/passenger.css";

function AddPassenger() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [totalBookings, setTotalBookings] = useState(0);
  const [boardingStatus, setBoardingStatus] = useState("NOT_BOARDED");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    const passengerData = {
      name,
      email,
      phone,
      total_bookings: totalBookings,
      boarding_status: boardingStatus,
    };

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("No access token found. Please log in.");
        setIsSubmitting(false);
        return;
      }

      const response = await axios.post(
        `${apiUrl}/api/passengers/`,
        passengerData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );

      setSuccess("Passenger added successfully");
      setError("");
      console.log(response.data);

      // Clear the input fields
      setName("");
      setEmail("");
      setPhone("");
      setTotalBookings(0);
      setBoardingStatus("NOT_BOARDED");
      
      // After 2 seconds, redirect to passenger list
      setTimeout(() => {
        navigate('/passenger');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to add passenger");
      setSuccess("");
      console.error(
        "Error adding passenger:",
        error.response ? error.response.data : error.message
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar />
      <Container fluid className="mt-4 px-4">
        <Row className="justify-content-center">
          <Col lg={8} xl={6}>
            <Card className="shadow-sm border-0">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">Add New Passenger</h4>
                <Button 
                  variant="outline-light" 
                  onClick={() => navigate('/passenger')}
                  className="back-btn"
                  style={{ minWidth: '110px', padding: '0.4rem 0.75rem' }}
                >
                  <FaArrowLeft className="me-2" /> Back to List
                </Button>
              </Card.Header>
              <Card.Body className="p-4">
                {success && (
                  <Alert variant="success" className="mb-4">
                    <div className="d-flex align-items-center">
                      <i className="fas fa-check-circle me-2"></i>
                      {success}
                    </div>
                  </Alert>
                )}
                
                {error && (
                  <Alert variant="danger" className="mb-4">
                    <div className="d-flex align-items-center">
                      <i className="fas fa-exclamation-circle me-2"></i>
                      {error}
                    </div>
                  </Alert>
                )}
                
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="d-flex align-items-center">
                      <FaUser className="me-2" style={{ color: '#091057' }} />
                      Full Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter passenger's full name"
                      required
                    />
                  </Form.Group>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="d-flex align-items-center">
                          <FaEnvelope className="me-2" style={{ color: '#091057' }} />
                          Email Address
                        </Form.Label>
                        <Form.Control
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter email address"
                        />
                        <Form.Text className="text-muted">
                          Optional but recommended for communication
                        </Form.Text>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="d-flex align-items-center">
                          <FaPhone className="me-2" style={{ color: '#091057' }} />
                          Phone Number
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Enter contact number"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="d-flex align-items-center">
                          <FaCalendarCheck className="me-2" style={{ color: '#091057' }} />
                          Initial Booking Count
                        </Form.Label>
                        <Form.Control
                          type="number"
                          value={totalBookings}
                          onChange={(e) => setTotalBookings(parseInt(e.target.value) || 0)}
                          min="0"
                          placeholder="Enter initial booking count"
                        />
                        <Form.Text className="text-muted">
                          Usually 0 for new passengers
                        </Form.Text>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="d-flex align-items-center">
                          <i className="fas fa-tag me-2" style={{ color: '#091057' }}></i>
                          Boarding Status
                        </Form.Label>
                        <Form.Select
                          value={boardingStatus}
                          onChange={(e) => setBoardingStatus(e.target.value)}
                          disabled
                        >
                          <option value="NOT_BOARDED">Not Boarded</option>
                        </Form.Select>
                        <Form.Text className="text-muted">
                          New passengers always start with 'Not Boarded' status
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <div className="d-grid gap-2 mt-4">
                    <Button 
                      type="submit" 
                      className="add-passenger-btn py-2"
                      disabled={isSubmitting}
                      style={{ minHeight: '44px' }}
                    >
                      {isSubmitting ? (
                        <>
                          <Spinner as="span" animation="border" size="sm" className="me-2" />
                          Adding Passenger...
                        </>
                      ) : "Add Passenger"}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline-secondary" 
                      onClick={() => navigate('/passenger')}
                      className="py-2"
                      style={{ 
                        fontWeight: '500', 
                        minHeight: '44px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default AddPassenger;