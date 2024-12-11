import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap is loaded
import '../../css/managetrip/managetripcard.css'; // Import the custom CSS
import boatLogo from '../../assets/boatlogo.png'; // Import your logo
import { Modal, Button, Form } from 'react-bootstrap'; // Import Bootstrap components

function ManageTripCard({ trip }) {
  const { origin, destination, departure_time, available_seats, ferry_boat } = trip;
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState('');

  const departureDate = new Date(departure_time).toLocaleDateString(); // Format the date
  const boatType = ferry_boat.slug;  // Assuming 'slug' contains the type of boat

  const handleDelete = () => {
    // Handle the delete action here, e.g., make an API call to delete the trip
    console.log('Deleting trip with reason:', reason);
    setShowModal(false);
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
          <button type="button" className="view-details-button-managetrip">
            View Details
          </button>
        </td>
      </tr>

      {/* Modal for delete confirmation */}
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