import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/managetrip/managetripcard.css';
import boatLogo from '../../assets/boatlogo.png';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ManageTripCard({ trip }) {
  const { origin, destination, departure_time, available_seats, ferry_boat } = trip;
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState('');
  const navigate = useNavigate();

  const departureDate = new Date(departure_time).toLocaleDateString();
  const boatType = ferry_boat.slug;

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`https://api.kcq-express.co/api/trips/${trip.id}/`, {
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
    } catch (error) {
      console.error('Error deleting trip:', error);
    }
  };

  const handleViewDetails = () => {
    navigate(`/trip-details/${trip.id}`);
  };

  return (
    <>
      <tr>
        <td><img src={boatLogo} alt="Boat Logo" className="boat-logo-managetrip" /></td>
        <td>{origin}</td>
        <td>{destination}</td>
        <td>{departureDate}</td>
        <td>{trip.id}</td>
        <td>{boatType}</td>
        <td>{available_seats}</td>
        <td>
          <button type="button" className="trash-button-managetrip" onClick={() => setShowModal(true)}>
            <i className="fas fa-trash"></i>
          </button>
          <button type="button" className="view-details-button-managetrip" onClick={handleViewDetails}>
            View Details
          </button>
        </td>
      </tr>

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
    </>
  );
}

export default ManageTripCard;