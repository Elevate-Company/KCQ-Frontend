import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Table, Badge, Spinner, Alert, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import Navbar from '../navbar/navbar';
import '../../css/components.css';
import '../../css/managetrip/tripdetails.css';
import boatLogo from '../../assets/boatlogo.png';

// Define theme colors
const THEME = {
  primary: '#0a215a',  // Dark blue from the current design
  secondary: '#071c4d', // Darker variant
  accent: '#e8f0fe',
  success: '#34a853',
  danger: '#ea4335',
  warning: '#fbbc04',
  light: '#f8f9fa'
};

function TripDetails() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [departureTime, setDepartureTime] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTripDetails = async () => {
      const token = localStorage.getItem('accessToken');
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/trips/${id}/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        });
        setTrip(response.data);
        
        // Fetch tickets for this trip to get passenger information
        try {
          // Try the by-trip endpoint first
          try {
            const ticketsResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/tickets/by-trip/${id}/`, {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${token}`,
              },
            });
            
            // Process ticket data to get passenger information
            const ticketsWithPassengers = await Promise.all(
              ticketsResponse.data.map(async (ticket) => {
                // If passenger is already included, use it
                if (ticket.passenger && typeof ticket.passenger === 'object') {
                  return { ...ticket };
                }
                
                // If only passenger ID is available, fetch passenger details
                if (ticket.passenger && typeof ticket.passenger === 'number') {
                  try {
                    const passengerResponse = await axios.get(
                      `${process.env.REACT_APP_API_BASE_URL}/api/passengers/${ticket.passenger}/`,
                      {
                        headers: {
                          'Content-Type': 'application/json',
                          Authorization: `Token ${token}`,
                        },
                      }
                    );
                    return { ...ticket, passenger: passengerResponse.data };
                  } catch (err) {
                    console.error(`Error fetching passenger ${ticket.passenger}:`, err);
                    return { ...ticket, passenger: { id: ticket.passenger, name: 'Unknown' } };
                  }
                }
                
                return ticket;
              })
            );
            
            setPassengers(ticketsWithPassengers);
          } catch (byTripError) {
            // If the by-trip endpoint fails, fall back to fetching all tickets and filtering
            console.warn('By-trip endpoint failed, fetching all tickets as fallback:', byTripError);
            
            // Fetch all tickets and filter by trip ID
            const allTicketsResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/tickets/`, {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${token}`,
              },
            });
            
            // Filter tickets for this trip
            const tripTickets = allTicketsResponse.data.filter(ticket => {
              return (ticket.trip === parseInt(id) || 
                      (ticket.trip && ticket.trip.id === parseInt(id)));
            });
            
            // Process ticket data to get passenger information
            const ticketsWithPassengers = await Promise.all(
              tripTickets.map(async (ticket) => {
                // If passenger is already included, use it
                if (ticket.passenger && typeof ticket.passenger === 'object') {
                  return { ...ticket };
                }
                
                // If only passenger ID is available, fetch passenger details
                if (ticket.passenger && typeof ticket.passenger === 'number') {
                  try {
                    const passengerResponse = await axios.get(
                      `${process.env.REACT_APP_API_BASE_URL}/api/passengers/${ticket.passenger}/`,
                      {
                        headers: {
                          'Content-Type': 'application/json',
                          Authorization: `Token ${token}`,
                        },
                      }
                    );
                    return { ...ticket, passenger: passengerResponse.data };
                  } catch (err) {
                    console.error(`Error fetching passenger ${ticket.passenger}:`, err);
                    return { ...ticket, passenger: { id: ticket.passenger, name: 'Unknown' } };
                  }
                }
                
                return ticket;
              })
            );
            
            setPassengers(ticketsWithPassengers);
          }
        } catch (err) {
          console.error('Error fetching tickets for trip:', err);
          setPassengers([]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching trip details:', error);
        setError('Failed to fetch trip details');
        setLoading(false);
      }
    };

    fetchTripDetails();
  }, [id]);

  const formatDateTimeForInput = (dateString) => {
    if (!dateString) return '';
    
    // Create a date object with the given string
    const date = new Date(dateString);
    
    // Convert to Manila time (UTC+8)
    const manilaDate = new Date(date.getTime() + (date.getTimezoneOffset() * 60000) + (8 * 60 * 60 * 1000));
    
    // Format to YYYY-MM-DDThh:mm (required format for datetime-local inputs)
    const year = manilaDate.getFullYear();
    const month = String(manilaDate.getMonth() + 1).padStart(2, '0');
    const day = String(manilaDate.getDate()).padStart(2, '0');
    const hours = String(manilaDate.getHours()).padStart(2, '0');
    const minutes = String(manilaDate.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleOpenScheduleModal = () => {
    if (trip) {
      // Check if trip is completed or ongoing
      const currentDate = new Date();
      const departureDateTime = new Date(trip.departure_time);
      const arrivalDateTime = trip.arrival_time ? new Date(trip.arrival_time) : null;
      
      // Don't allow editing if trip is completed or ongoing
      if ((arrivalDateTime && currentDate > arrivalDateTime) || // completed
          (currentDate > departureDateTime)) { // ongoing
        return;
      }
      
      setDepartureTime(formatDateTimeForInput(trip.departure_time));
      setArrivalTime(formatDateTimeForInput(trip.arrival_time));
      setShowScheduleModal(true);
      setUpdateError('');
      setUpdateSuccess(false);
    }
  };

  const handleCloseScheduleModal = () => {
    setShowScheduleModal(false);
    setUpdateError('');
  };

  const validateScheduleForm = () => {
    if (!departureTime) return 'Departure time is required';
    if (!arrivalTime) return 'Arrival time is required';
    
    const departureDate = new Date(departureTime);
    const arrivalDate = new Date(arrivalTime);
    
    if (arrivalDate <= departureDate) {
      return 'Arrival time must be after departure time';
    }
    
    return null;
  };

  const handleUpdateSchedule = async () => {
    const validationError = validateScheduleForm();
    if (validationError) {
      setUpdateError(validationError);
      return;
    }
    
    setUpdateLoading(true);
    setUpdateError('');
    
    try {
      const token = localStorage.getItem('accessToken');
      
      // Convert local datetimes to Manila timezone (UTC+8) for the API
      const formatDateForAPI = (localDateString) => {
        // Create a date object with the given string (already in local time)
        const localDate = new Date(localDateString);
        
        // Create a formatter that will output in Asia/Manila timezone
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Manila',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        });
        
        // Get parts and construct ISO string with Manila timezone offset (+08:00)
        const parts = formatter.formatToParts(localDate);
        const partValues = parts.reduce((acc, part) => {
          acc[part.type] = part.value;
          return acc;
        }, {});
        
        const year = partValues.year;
        const month = partValues.month;
        const day = partValues.day;
        const hour = partValues.hour;
        const minute = partValues.minute;
        const second = partValues.second;
        
        return `${year}-${month}-${day}T${hour}:${minute}:${second}+08:00`;
      };
      
      // We need to keep the rest of the trip data unchanged
      const updatedTripData = {
        ...trip,
        departure_time: formatDateForAPI(departureTime),
        arrival_time: formatDateForAPI(arrivalTime)
      };
      
      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/api/trips/${id}/`,
        updatedTripData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        }
      );
      
      console.log('Trip schedule updated:', response.data);
      setTrip(response.data);
      setUpdateSuccess(true);
      
      // Dispatch a custom event for the notification system
      const tripUpdateEvent = new CustomEvent('tripScheduleUpdated', {
        detail: {
          trip: {
            ...response.data,
            // Ensure these properties are always included
            id: response.data.id,
            origin: response.data.origin || trip.origin || 'Origin',
            destination: response.data.destination || trip.destination || 'Destination'
          },
          previousDeparture: trip.departure_time,
          previousArrival: trip.arrival_time,
          newDeparture: formatDateForAPI(departureTime),
          newArrival: formatDateForAPI(arrivalTime)
        }
      });
      window.dispatchEvent(tripUpdateEvent);
      
      // Close the modal after a short delay
      setTimeout(() => {
        setShowScheduleModal(false);
        // Wait a bit more before resetting success state to avoid flashing
        setTimeout(() => {
          setUpdateSuccess(false);
        }, 200);
      }, 1500);
    } catch (error) {
      console.error('Error updating trip schedule:', error);
      setUpdateError('Failed to update schedule. Please check your inputs and try again.');
    } finally {
      setUpdateLoading(false);
    }
  };

  const getTripStatusBadge = (tripData) => {
    if (!tripData) return null;
    
    const currentDate = new Date();
    const departureDateTime = new Date(tripData.departure_time);
    const arrivalDateTime = tripData.arrival_time ? new Date(tripData.arrival_time) : null;

    let status = 'scheduled';
    let variant = 'secondary';
    
    if (tripData.status === 'cancelled') {
      status = 'cancelled';
      variant = 'danger';
    } else if (arrivalDateTime && currentDate > arrivalDateTime) {
      status = 'completed';
      variant = 'success';
    } else if (currentDate > departureDateTime) {
      status = 'ongoing';
      variant = 'primary';
    } else {
      status = 'upcoming';
      variant = 'warning';
    }

    return (
      <Badge bg={variant} className="px-3 py-2 fs-6">
        {status.toUpperCase()}
      </Badge>
    );
  };
  
  const getBoardingStatusBadge = (status) => {
    let variant = 'secondary';
    let text = 'Not Boarded';
    
    if (status === 'BOARDED') {
      variant = 'success';
      text = 'Boarded';
    } else if (status === 'CANCELLED') {
      variant = 'danger';
      text = 'Cancelled';
    }
    
    return (
      <Badge bg={variant} className="py-1 px-2">
        {text}
      </Badge>
    );
  };

  const getTripStatusText = (tripData) => {
    if (!tripData) return '';
    
    const currentDate = new Date();
    const departureDateTime = new Date(tripData.departure_time);
    const arrivalDateTime = tripData.arrival_time ? new Date(tripData.arrival_time) : null;

    if (tripData.status === 'cancelled') {
      return 'Trip is cancelled';
    } else if (arrivalDateTime && currentDate > arrivalDateTime) {
      return 'Cannot edit completed trip';
    } else if (currentDate > departureDateTime) {
      return 'Cannot edit ongoing trip';
    }
    
    return '';
  };

  const isTripEditable = (tripData) => {
    if (!tripData) return false;
    
    const currentDate = new Date();
    const departureDateTime = new Date(tripData.departure_time);
    const arrivalDateTime = tripData.arrival_time ? new Date(tripData.arrival_time) : null;

    // Allow editing only if the trip is upcoming (not ongoing or completed)
    if (tripData.status === 'cancelled' || 
        (arrivalDateTime && currentDate > arrivalDateTime) || // completed
        (currentDate > departureDateTime)) { // ongoing
      return false;
    }
    
    return true; // upcoming
  };

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

  if (!trip) {
    return (
      <>
        <Navbar />
        <Container className="mt-5">
          <Alert variant="warning">Trip not found</Alert>
        </Container>
      </>
    );
  }

  const displayDepartureTime = new Date(trip.departure_time);
  const displayArrivalTime = trip.arrival_time ? new Date(trip.arrival_time) : null;

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
              <h2 className="mb-0 fw-bold">Trip Details</h2>
              <Button 
                variant="outline-light"
                style={{ width: "150px" }}
                onClick={() => navigate('/manage-trips')}
              >
                <i className="fas fa-arrow-left me-2"></i>
                Back to Trips
              </Button>
            </div>
          </Card.Header>
          
          <Card.Body className="p-4">
            <div className="d-flex flex-column flex-md-row align-items-center mb-4">
              <div className="me-md-4 mb-3 mb-md-0 text-center">
                <i className="fas fa-ship" style={{ fontSize: "50px", color: THEME.primary }}></i>
              </div>
              <div className="flex-grow-1 text-center text-md-start">
                <h4 className="fw-bold mb-2">
                  {trip.origin} <i className="fas fa-arrow-right mx-2"></i> {trip.destination}
                </h4>
                <p className="text-muted mb-2">
                  Trip ID: <span className="fw-medium">{trip.id}</span>
                </p>
                <div className="mt-2">
                  {getTripStatusBadge(trip)}
                </div>
              </div>
            </div>
            
            <Row className="g-4 mb-4">
              <Col md={6}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="mb-0 fw-bold text-primary" style={{ color: THEME.primary }}>
                        <i className="fas fa-calendar-alt me-2"></i> Schedule Information
                      </h5>
                      {isTripEditable(trip) ? (
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={handleOpenScheduleModal}
                          className="edit-schedule-btn py-1"
                        >
                          <i className="far fa-edit me-1"></i> Edit Schedule
                        </Button>
                      ) : (
                        <div className="status-indicator">
                          <i className="fas fa-info-circle me-1"></i> 
                          CANNOT EDIT COMPLETED TRIP
                        </div>
                      )}
                    </div>
                    <Row>
                      <Col md={6} className="mb-3">
                        <Card className="border-0 bg-light">
                          <Card.Body className="p-3">
                            <h6 className="text-muted mb-1">Departure</h6>
                            <div className="d-flex align-items-center">
                              <i className="fas fa-ship me-2" style={{ color: THEME.primary }}></i>
                              <div>
                                <p className="mb-0 fw-bold">{displayDepartureTime.toLocaleDateString('en-PH', { timeZone: 'Asia/Manila' })}</p>
                                <p className="mb-0">{displayDepartureTime.toLocaleTimeString('en-PH', { timeZone: 'Asia/Manila', hour: '2-digit', minute: '2-digit' })}</p>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Card className="border-0 bg-light">
                          <Card.Body className="p-3">
                            <h6 className="text-muted mb-1">Arrival</h6>
                            <div className="d-flex align-items-center">
                              <i className="fas fa-ship me-2" style={{ color: THEME.primary }}></i>
                              <div>
                                <p className="mb-0 fw-bold">
                                  {displayArrivalTime ? displayArrivalTime.toLocaleDateString('en-PH', { timeZone: 'Asia/Manila' }) : 'Not specified'}
                                </p>
                                <p className="mb-0">
                                  {displayArrivalTime ? displayArrivalTime.toLocaleTimeString('en-PH', { timeZone: 'Asia/Manila', hour: '2-digit', minute: '2-digit' }) : ''}
                                </p>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                    <hr />
                    <div className="mb-3">
                      <h6 className="text-muted mb-1">Journey Duration</h6>
                      <p className="mb-0 fw-bold">
                        {displayArrivalTime ? 
                          `${Math.round((displayArrivalTime - displayDepartureTime) / (1000 * 60 * 60))} hours` : 
                          'Not specified'
                        }
                      </p>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={6}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body>
                    <h5 className="mb-3 fw-bold" style={{ color: THEME.primary }}>
                      <i className="fas fa-ship me-2"></i> Boat Information
                    </h5>
                    <Row>
                      <Col md={6} className="mb-3">
                        <h6 className="text-muted mb-1">Boat Type</h6>
                        <p className="fw-bold mb-3">
                          {typeof trip.ferry_boat === 'object' 
                            ? trip.ferry_boat.name || trip.ferry_boat.slug 
                            : trip.ferry_boat || 'N/A'}
                        </p>
                        
                        <h6 className="text-muted mb-1">Available Seats</h6>
                        <p className="fw-bold">
                          {trip.available_seats || 'N/A'}
                        </p>
                      </Col>
                      <Col md={6}>
                        <h6 className="text-muted mb-1">Created By</h6>
                        <p className="fw-bold mb-3">
                          {trip.created_by || 'N/A'}
                        </p>
                        
                        <h6 className="text-muted mb-1">Creation Date</h6>
                        <p className="fw-bold">
                          {new Date(trip.created_at).toLocaleDateString('en-PH', { timeZone: 'Asia/Manila' })}
                        </p>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            
            {trip.notes && (
              <Card className="border-0 shadow-sm mb-4">
                <Card.Body>
                  <h5 className="mb-3 fw-bold" style={{ color: THEME.primary }}>
                    <i className="fas fa-sticky-note me-2"></i> Notes
                  </h5>
                  <p className="mb-0">{trip.notes}</p>
                </Card.Body>
              </Card>
            )}
            
            {/* Passenger List Section */}
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body>
                <h5 className="mb-3 fw-bold" style={{ color: THEME.primary }}>
                  <i className="fas fa-users me-2"></i> Passengers
                  <Badge bg="secondary" className="ms-2 px-3 py-1">
                    {passengers.length}
                  </Badge>
                </h5>
                
                {passengers.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted mb-0">No passengers booked for this trip yet</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <Table hover className="passenger-table">
                      <thead>
                        <tr>
                          <th>Ticket #</th>
                          <th>Passenger</th>
                          <th>Seat</th>
                          <th>Type</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {passengers.map((ticket) => (
                          <tr key={ticket.id}>
                            <td>{ticket.ticket_number}</td>
                            <td>
                              {ticket.passenger?.name || 'Unknown'}
                            </td>
                            <td>{ticket.seat_number || 'N/A'}</td>
                            <td>{ticket.age_group || 'Regular'}</td>
                            <td>{getBoardingStatusBadge(ticket.boarding_status)}</td>
                            <td>
                              <Button 
                                variant="outline-primary"
                                size="sm"
                                className="me-2"
                                onClick={() => navigate(`/passenger-info/${ticket.passenger?.id}`)}
                              >
                                <i className="fas fa-user me-1"></i> View Passenger
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Card.Body>
        </Card>
      </Container>
      
      {/* Edit Schedule Modal */}
      <Modal show={showScheduleModal} onHide={handleCloseScheduleModal} centered className="schedule-modal">
        <Modal.Header className="border-0" style={{ backgroundColor: THEME.primary, color: 'white' }}>
          <div className="d-flex align-items-center w-100">
            <i className="fas fa-calendar-alt me-2"></i>
            <span className="fw-bold">Edit Trip Schedule</span>
          </div>
        </Modal.Header>
        <Modal.Body className="p-4">
          {updateError && (
            <Alert variant="danger" className="mb-4">
              <i className="fas fa-exclamation-circle me-2"></i>
              {updateError}
            </Alert>
          )}
          
          {updateSuccess && (
            <Alert variant="success" className="mb-4">
              <i className="fas fa-check-circle me-2"></i>
              Schedule updated successfully!
            </Alert>
          )}
          
          <Form>
            <Form.Group className="mb-4" controlId="formDeparture">
              <Form.Label className="fw-medium">
                Departure Time <span className="text-danger">*</span>
              </Form.Label>
              <div className="input-with-icon">
                <Form.Control
                  type="datetime-local"
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  required
                  className="date-input"
                />
                <i className="fas fa-calendar-alt"></i>
              </div>
              <Form.Text className="text-muted">
                When the trip will depart from the origin.
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-4" controlId="formArrival">
              <Form.Label className="fw-medium">
                Arrival Time <span className="text-danger">*</span>
              </Form.Label>
              <div className="input-with-icon">
                <Form.Control
                  type="datetime-local"
                  value={arrivalTime}
                  onChange={(e) => setArrivalTime(e.target.value)}
                  required
                  className="date-input"
                />
                <i className="fas fa-calendar-alt"></i>
              </div>
              <Form.Text className="text-muted">
                Estimated time of arrival at the destination.
              </Form.Text>
            </Form.Group>
            
            {/* Duration preview */}
            {departureTime && arrivalTime && (
              <div className="duration-preview">
                <h6 className="fw-bold mb-2">Duration Preview</h6>
                <div className="d-flex align-items-center">
                  <i className="fas fa-clock me-2"></i>
                  <span>
                    {Math.round((new Date(arrivalTime) - new Date(departureTime)) / (1000 * 60 * 60))} hours
                  </span>
                </div>
              </div>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0 pb-4 px-4">
          <Button 
            variant="secondary" 
            onClick={handleCloseScheduleModal}
            className="px-4 cancel-btn"
            disabled={updateLoading}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleUpdateSchedule}
            className="px-4 save-btn"
            disabled={updateLoading}
          >
            {updateLoading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Updating...
              </>
            ) : (
              <>
                <i className="fas fa-save me-2"></i>
                Save Changes
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default TripDetails;