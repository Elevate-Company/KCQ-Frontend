import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/managetrip/managetripcard.css';
import boatLogo from '../../assets/boatlogo.png';
import { Modal, Button, Form, Badge } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ManageTripCard({ trip }) {
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState('');
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';

  if (!trip) return null;

  const {
    id,
    origin,
    destination,
    departure_time,
    arrival_time,
    available_seats,
    ferry_boat,
    status
  } = trip;

  const departureDateTime = new Date(departure_time);
  const arrivalDateTime = arrival_time ? new Date(arrival_time) : null;
  
  // Format dates and times for display with Philippines timezone
  const departureDate = departureDateTime.toLocaleDateString('en-PH', { 
    year: 'numeric', month: 'short', day: 'numeric',
    timeZone: 'Asia/Manila'
  });
  const departureTime = departureDateTime.toLocaleTimeString('en-PH', { 
    hour: '2-digit', minute: '2-digit',
    timeZone: 'Asia/Manila'
  });
  
  const arrivalDate = arrival_time ? arrivalDateTime.toLocaleDateString('en-PH', { 
    year: 'numeric', month: 'short', day: 'numeric',
    timeZone: 'Asia/Manila'
  }) : null;
  const arrivalTime = arrival_time ? arrivalDateTime.toLocaleTimeString('en-PH', { 
    hour: '2-digit', minute: '2-digit',
    timeZone: 'Asia/Manila'
  }) : null;
  
  const boatType = typeof ferry_boat === 'object' 
    ? (ferry_boat.name || ferry_boat.slug || 'N/A') 
    : (ferry_boat || 'N/A');

  // Calculate duration if both departure and arrival times exist
  const getDuration = () => {
    if (!departure_time || !arrival_time) return 'N/A';
    
    const deptTime = new Date(departure_time);
    const arrTime = new Date(arrival_time);
    const diffMs = arrTime - deptTime;
    
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.round((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHrs}h ${diffMins}m`;
  };

  // Check if trip is upcoming, ongoing, or completed
  const currentDate = new Date();
  let tripStatus = status || 'scheduled';
  
  if (status === 'cancelled') {
    tripStatus = 'cancelled';
  } else if (arrivalDateTime && currentDate > arrivalDateTime) {
    tripStatus = 'completed';
  } else if (currentDate > departureDateTime) {
    tripStatus = 'ongoing';
  } else {
    tripStatus = 'upcoming';
  }

  const getBadgeVariant = (status) => {
    switch(status) {
      case 'upcoming':
        return 'warning';
      case 'ongoing':
        return 'primary';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`${apiUrl}/api/trips/${id}/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        data: {
          reason,
        },
      });
      console.log('Trip deleted with reason:', reason);
      setShowModal(false);
      
      // Optional: Refresh the page or remove the trip from the list
      window.location.reload();
    } catch (error) {
      console.error('Error deleting trip:', error);
    }
  };

  const handleViewDetails = () => {
    navigate(`/trip-details/${id}`);
  };

  return (
    <div className="trip-card mb-3">
      <div className="card">
        <div className="card-body">
          <div className="row align-items-center">
            {/* Logo column */}
            <div className="col-md-1 d-flex align-items-center justify-content-center">
              <img src={boatLogo} alt="Boat Logo" className="boat-logo-managetrip" />
            </div>
            
            {/* Trip info column */}
            <div className="col-md-3 d-flex flex-column">
              <div className="route-container">
                <h6 className="mb-1 text-muted">Route</h6>
                <p className="mb-1 fw-bold">
                  <span>{origin}</span>
                  <i className="fas fa-arrow-right mx-1"></i>
                  <span>{destination}</span>
                </p>
              </div>
              <div className="d-flex align-items-center">
                <span className="trip-id">ID: {id}</span>
                <Badge bg={getBadgeVariant(tripStatus)} className="ms-2">
                  {tripStatus.charAt(0).toUpperCase() + tripStatus.slice(1)}
                </Badge>
              </div>
            </div>
            
            {/* Schedule column */}
            <div className="col-md-4">
              <div className="schedule-container d-flex">
                <div className="departure-container me-3">
                  <h6 className="mb-1 text-muted">Departure</h6>
                  <p className="mb-0 fw-bold">{departureTime}</p>
                  <p className="mb-0 text-muted small">{departureDate}</p>
                </div>
                
                <div className="duration-container text-center me-3">
                  <h6 className="mb-1 text-muted">Duration</h6>
                  <p className="mb-0 duration-value">{getDuration()}</p>
                  <i className="fas fa-clock small text-muted"></i>
                </div>
                
                <div className="arrival-container">
                  <h6 className="mb-1 text-muted">Arrival</h6>
                  <p className="mb-0 fw-bold">{arrivalTime || 'Not set'}</p>
                  <p className="mb-0 text-muted small">{arrivalDate || '—'}</p>
                </div>
              </div>
            </div>
            
            {/* Boat info column */}
            <div className="col-md-2 d-flex flex-column">
              <h6 className="mb-1 text-muted">Boat</h6>
              <p className="mb-1 fw-bold">{boatType}</p>
              <div className="capacity-container">
                <span className="capacity-badge">
                  <i className="fas fa-users me-1"></i> {available_seats} seats
                </span>
              </div>
            </div>
            
            {/* Actions column */}
            <div className="col-md-2 d-flex align-items-center justify-content-end">
              <button
                type="button"
                className="trash-button-managetrip me-2"
                onClick={() => setShowModal(true)}
                title="Delete Trip"
              >
                <i className="fas fa-trash"></i>
              </button>
              <button
                type="button"
                className="view-details-button-managetrip"
                onClick={handleViewDetails}
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Trip</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="reason">
              <Form.Label>Reason for deletion</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ManageTripCard;