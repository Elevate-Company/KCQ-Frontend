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

  const departureDate = new Date(departure_time).toLocaleDateString();
  const departureTime = new Date(departure_time).toLocaleTimeString();
  
  const boatType = typeof ferry_boat === 'object' 
    ? (ferry_boat.name || ferry_boat.slug || 'N/A') 
    : (ferry_boat || 'N/A');

  // Check if trip is upcoming, ongoing, or completed
  const currentDate = new Date();
  const departureDateTime = new Date(departure_time);
  const arrivalDateTime = arrival_time ? new Date(arrival_time) : null;

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
          <div className="row">
            <div className="col-md-1 d-flex align-items-center justify-content-center">
              <img src={boatLogo} alt="Boat Logo" className="boat-logo-managetrip" />
            </div>
            <div className="col-md-2 d-flex align-items-center">
              <div>
                <h6 className="mb-0">Route</h6>
                <p className="mb-0">
                  <span>{origin}</span>
                  <i className="fas fa-arrow-right mx-1"></i>
                  <span>{destination}</span>
                </p>
              </div>
            </div>
            <div className="col-md-2 d-flex align-items-center">
              <div>
                <h6 className="mb-0">Departure</h6>
                <p className="mb-0">{departureDate}<br/>{departureTime}</p>
              </div>
            </div>
            <div className="col-md-1 d-flex align-items-center">
              <div>
                <h6 className="mb-0">Trip ID</h6>
                <p className="mb-0">{id}</p>
              </div>
            </div>
            <div className="col-md-2 d-flex align-items-center">
              <div>
                <h6 className="mb-0">Boat Type</h6>
                <p className="mb-0">{boatType}</p>
              </div>
            </div>
            <div className="col-md-1 d-flex align-items-center">
              <div>
                <h6 className="mb-0">Seats</h6>
                <p className="mb-0">{available_seats}</p>
              </div>
            </div>
            <div className="col-md-1 d-flex align-items-center">
              <div>
                <h6 className="mb-0">Status</h6>
                <Badge bg={getBadgeVariant(tripStatus)}>
                  {tripStatus.charAt(0).toUpperCase() + tripStatus.slice(1)}
                </Badge>
              </div>
            </div>
            <div className="col-md-2 d-flex align-items-center justify-content-end">
              <button
                type="button"
                className="trash-button-managetrip me-2"
                onClick={() => setShowModal(true)}
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