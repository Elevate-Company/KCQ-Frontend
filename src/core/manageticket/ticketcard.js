import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/manageticket/ticketcard.css';
import boatLogo from '../../assets/boatlogo.png';
import { Modal, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

function TicketCard({ ticket }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(ticket?.boarding_status || 'NOT_BOARDED');
  const [selectedStatus, setSelectedStatus] = useState('');
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';

  const handleDelete = () => {
    console.log('Deleting ticket with reason:', reason);
    setShowDeleteModal(false);
  };

  const handleViewDetails = (ticketNumber) => {
    navigate(`/ticket-details/${ticketNumber}`);
  };

  // Quick status check for badge color
  const getBadgeClass = (status) => {
    switch(status) {
      case 'BOARDED':
        return 'badge bg-success';
      case 'CANCELLED':
        return 'badge bg-danger';
      case 'NOT_BOARDED':
      default:
        return 'badge bg-warning';
    }
  };

  // Format status for display (replace underscores with spaces and capitalize)
  const formatStatus = (status) => {
    if (!status) return 'N/A';
    return status.replace(/_/g, ' ');
  };

  // Open the status modal and set the initially selected status
  const openStatusModal = () => {
    setSelectedStatus(currentStatus);
    setShowStatusModal(true);
  };

  // Update the boarding status with the ticket number to ensure only this ticket's status is updated
  const updateBoardingStatus = async () => {
    if (!ticket?.passenger?.id || selectedStatus === currentStatus) {
      setShowStatusModal(false);
      return;
    }
    
    // Don't allow changing from BOARDED to any other status
    if (currentStatus === 'BOARDED' && selectedStatus !== 'BOARDED') {
      toast.error('Cannot change status once BOARDED');
      setShowStatusModal(false);
      return;
    }
    
    // Only allow changing from NOT_BOARDED to CANCELLED, not to BOARDED manually
    if (currentStatus === 'NOT_BOARDED' && selectedStatus === 'BOARDED') {
      toast.error('Boarding must be done via ticket scan only');
      setShowStatusModal(false);
      return;
    }
    
    setLoading(true);
    const token = localStorage.getItem('accessToken');
    
    try {
      await axios.patch(`${apiUrl}/api/passengers/${ticket.passenger.id}/update-ticket-boarding-status/`, 
        { 
          boarding_status: selectedStatus,
          ticket_number: ticket.ticket_number
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
        }
      );
      
      setCurrentStatus(selectedStatus);
      setShowStatusModal(false);
      toast.success('Boarding status updated successfully');
    } catch (error) {
      console.error('Error updating boarding status:', error);
      toast.error(error.response?.data?.detail || 'Failed to update boarding status');
    } finally {
      setLoading(false);
    }
  };

  if (!ticket) return null;

  const {
    ticket_number,
    trip,
    passenger,
  } = ticket;
  
  const destination = trip?.destination || 'N/A';
  const customer = passenger?.name || 'N/A';
  const capacity = trip?.available_seats || 'N/A';
  const ferryBoat = trip?.ferry_boat || 'N/A';
  const typeBoat = typeof ferryBoat === 'object' ? (ferryBoat.name || ferryBoat.slug || 'N/A') : ferryBoat;

  return (
    <div className="ticket-card mb-3">
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-md-1 d-flex align-items-center justify-content-center">
              <img src={boatLogo} alt="Boat Logo" className="boat-logo-ticketcard" />
            </div>
            <div className="col-md-2 d-flex align-items-center">
              <div>
                <h6 className="mb-0">Destination</h6>
                <p className="mb-0">{destination}</p>
              </div>
            </div>
            <div className="col-md-2 d-flex align-items-center">
              <div>
                <h6 className="mb-0">Customer</h6>
                <p className="mb-0">{customer}</p>
              </div>
            </div>
            <div className="col-md-2 d-flex align-items-center">
              <div>
                <h6 className="mb-0">Ticket Number</h6>
                <p className="mb-0">{ticket_number}</p>
              </div>
            </div>
            <div className="col-md-1 d-flex align-items-center">
              <div>
                <h6 className="mb-0">Boat</h6>
                <p className="mb-0">{typeBoat}</p>
              </div>
            </div>
            <div className="col-md-1 d-flex align-items-center">
              <div>
                <h6 className="mb-0">Capacity</h6>
                <p className="mb-0">{capacity}</p>
              </div>
            </div>
            <div className="col-md-1 d-flex align-items-center">
              <div>
                <h6 className="mb-0">Status</h6>
                <button 
                  className="status-button" 
                  onClick={openStatusModal}
                  disabled={loading}
                >
                  <span className={getBadgeClass(currentStatus)}>
                    {formatStatus(currentStatus)}
                  </span>
                </button>
              </div>
            </div>
            <div className="col-md-2 d-flex align-items-center justify-content-end">
              <button
                type="button"
                className="trash-button-ticketcard me-2"
                onClick={() => {
                  setShowDeleteModal(true);
                }}
              >
                <i className="fas fa-trash"></i>
              </button>
              <button
                type="button"
                className="view-details-button-ticketcard"
                onClick={() => handleViewDetails(ticket_number)}
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Ticket</Modal.Title>
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
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Status Update Modal */}
      <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Boarding Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Ticket: <strong>{ticket_number}</strong></p>
          <p>Passenger: <strong>{customer}</strong></p>
          <Form>
            <Form.Group controlId="boardingStatus">
              <Form.Label>Select new status:</Form.Label>
              <div className="status-options">
                <div className={`status-option ${selectedStatus === 'NOT_BOARDED' ? 'selected' : ''}`}>
                  <Form.Check
                    type="radio"
                    id="status-not-boarded"
                    name="boardingStatus"
                    checked={selectedStatus === 'NOT_BOARDED'}
                    onChange={() => setSelectedStatus('NOT_BOARDED')}
                    disabled={currentStatus === 'BOARDED'}
                  />
                  <label htmlFor="status-not-boarded" className="ms-2">
                    <span className="badge bg-warning">NOT BOARDED</span>
                  </label>
                </div>
                <div className={`status-option ${selectedStatus === 'BOARDED' ? 'selected' : ''}`}>
                  <Form.Check
                    type="radio"
                    id="status-boarded"
                    name="boardingStatus"
                    checked={selectedStatus === 'BOARDED'}
                    onChange={() => setSelectedStatus('BOARDED')}
                    disabled={true}
                  />
                  <label htmlFor="status-boarded" className="ms-2">
                    <span className="badge bg-success">BOARDED</span>
                    <small className="text-muted ms-2">(Only via scan)</small>
                  </label>
                </div>
                <div className={`status-option ${selectedStatus === 'CANCELLED' ? 'selected' : ''}`}>
                  <Form.Check
                    type="radio"
                    id="status-cancelled"
                    name="boardingStatus"
                    checked={selectedStatus === 'CANCELLED'}
                    onChange={() => setSelectedStatus('CANCELLED')}
                    disabled={currentStatus === 'BOARDED'}
                  />
                  <label htmlFor="status-cancelled" className="ms-2">
                    <span className="badge bg-danger">CANCELLED</span>
                  </label>
                </div>
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStatusModal(false)}>
            Cancel
          </Button>
          <Button 
            style={{ backgroundColor: '#0a215a', borderColor: '#0a215a' }}
            onClick={updateBoardingStatus}
            disabled={loading || selectedStatus === currentStatus}
          >
            {loading ? 'Updating...' : 'Update Status'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default TicketCard;