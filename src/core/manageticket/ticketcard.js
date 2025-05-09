import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/manageticket/ticketcard.css';
// Replace boat logo with Font Awesome icon
// import boatLogo from '../../assets/boatlogo.png';
import { Modal, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

// Define theme colors to match the design
const THEME = {
  primary: '#0a215a',  // Dark blue
  secondary: '#071c4d', // Darker variant
  accent: '#e8f0fe',
  success: '#34a853',
  danger: '#ea4335',
  warning: '#fbbc04',
  light: '#f8f9fa'
};

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

  // Format departure time for display
  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return { date: 'N/A', time: 'N/A' };
    const dateTime = new Date(dateTimeStr);
    const date = dateTime.toLocaleDateString('en-PH', { 
      year: 'numeric', month: 'short', day: 'numeric',
      timeZone: 'Asia/Manila' 
    });
    const time = dateTime.toLocaleTimeString('en-PH', { 
      hour: '2-digit', minute: '2-digit',
      timeZone: 'Asia/Manila'
    });
    return { date, time };
  };

  // Quick status check for badge color
  const getBadgeClass = (status) => {
    switch(status) {
      case 'BOARDED':
        return 'badge bg-success';
      case 'CHECKED_IN':
        return 'badge bg-primary';
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
    seat_number,
  } = ticket;
  
  const destination = trip?.destination || 'N/A';
  const origin = trip?.origin || 'N/A';
  const customer = passenger?.name || 'N/A';
  const capacity = trip?.available_seats || 'N/A';
  const ferryBoat = trip?.ferry_boat || 'N/A';
  const typeBoat = typeof ferryBoat === 'object' ? (ferryBoat.name || ferryBoat.slug || 'N/A') : ferryBoat;
  
  // Format trip time
  const departureInfo = trip?.departure_time ? formatDateTime(trip.departure_time) : { date: 'N/A', time: 'N/A' };
  const arrivalInfo = trip?.arrival_time ? formatDateTime(trip.arrival_time) : { date: 'N/A', time: 'N/A' };

  return (
    <div className="ticket-card mb-3">
      <div className="card shadow-sm">
        <div className="card-body p-3">
          <div className="row align-items-center">
            {/* Logo column */}
            <div className="col-md-1 d-flex align-items-center justify-content-center mb-2 mb-md-0">
              <i className="fas fa-ship" style={{ fontSize: "30px", color: THEME.primary }}></i>
            </div>
            
            {/* Trip info column */}
            <div className="col-md-3 mb-2 mb-md-0">
              <div className="d-flex flex-column">
                <h6 className="mb-1 text-muted">Route</h6>
                <p className="mb-1 fw-bold">
                  <span>{origin}</span>
                  <i className="fas fa-arrow-right mx-1"></i>
                  <span>{destination}</span>
                </p>
                <div className="d-flex flex-wrap align-items-center mt-1">
                  <div className="d-flex align-items-center me-2 mb-1">
                    <i className="fas fa-calendar-alt me-1 text-muted"></i>
                    <span className="small text-muted">{departureInfo.date}</span>
                  </div>
                  <div className="d-flex align-items-center mb-1">
                    <i className="fas fa-clock me-1 text-muted"></i>
                    <span className="small text-muted">{departureInfo.time}</span>
                  </div>
                </div>
                {trip?.arrival_time && (
                  <div className="d-flex align-items-center mt-1">
                    <i className="fas fa-ship me-1 text-success"></i>
                    <span className="small">Arrival: {arrivalInfo.time} ({arrivalInfo.date})</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Passenger info column */}
            <div className="col-md-3 mb-2 mb-md-0">
              <div className="d-flex flex-column">
                <h6 className="mb-1 text-muted">Passenger</h6>
                <p className="mb-0 fw-bold">{customer}</p>
                <div className="d-flex align-items-center mt-1">
                  <span className="ticket-number-badge me-2">
                    #{ticket_number}
                  </span>
                  <span className="seat-badge">
                    <i className="fas fa-chair me-1"></i> {seat_number || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Boat info column */}
            <div className="col-md-2 mb-2 mb-md-0">
              <div className="d-flex flex-column">
                <h6 className="mb-1 text-muted">Boat</h6>
                <p className="mb-0 fw-bold">{typeBoat}</p>
                <span className="capacity-badge mt-1">
                  <i className="fas fa-users me-1"></i> {capacity} seats
                </span>
              </div>
            </div>
            
            {/* Status column */}
            <div className="col-6 col-md-1 mb-2 mb-md-0">
              <div className="d-flex flex-column align-items-start">
                <h6 className="mb-1 text-muted">Status</h6>
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
            
            {/* Actions column */}
            <div className="col-6 col-md-2 d-flex align-items-center justify-content-end">
              <button
                type="button"
                className="trash-button-ticketcard me-2"
                onClick={() => {
                  setShowDeleteModal(true);
                }}
                title="Delete Ticket"
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
        <Modal.Header closeButton style={{ backgroundColor: THEME.primary, color: 'white' }}>
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
                    disabled={currentStatus === 'NOT_BOARDED'}
                  />
                  <label htmlFor="status-boarded" className="ms-2">
                    <span className="badge bg-success">BOARDED</span>
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
          <Button 
            variant="secondary" 
            onClick={() => setShowStatusModal(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={updateBoardingStatus}
            disabled={loading || currentStatus === selectedStatus}
            style={{ backgroundColor: THEME.primary, borderColor: THEME.primary }}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Updating...
              </>
            ) : (
              'Update Status'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default TicketCard;