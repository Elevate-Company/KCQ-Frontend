import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../navbar/navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Modal, Button } from 'react-bootstrap';

function PassengerList() {
  const [passengers, setPassengers] = useState([]);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [passengerToDelete, setPassengerToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPassengers = async () => {
      const token = localStorage.getItem('accessToken');
      console.log('Token:', token);
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/passengers/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        });

        const data = response.data;
        console.log('Response data:', data);

        // Map passengers, but don't try to fetch tickets - just set total_checked_tickets to 0
        // This avoids the 404 errors since the endpoint doesn't exist
        const passengersWithDefaultTickets = data.passengers.map(passenger => ({
          ...passenger,
          total_checked_tickets: 0
        }));

        setPassengers(passengersWithDefaultTickets);
      } catch (error) {
        console.error('Error fetching passengers:', error);
        setError('Failed to fetch passengers');
      }
    };

    fetchPassengers();
  }, []);

  const openDeleteModal = (passenger) => {
    setPassengerToDelete(passenger);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setPassengerToDelete(null);
  };

  const handleDelete = async () => {
    if (!passengerToDelete) return;
    
    setIsDeleting(true);
    const token = localStorage.getItem('accessToken');
    
    try {
      const response = await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/passengers/${passengerToDelete.id}/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      });

      // Since the passenger is not actually deleted in the backend, don't remove it from the list
      // Just show the success message to inform the user
      toast.info(response.data.detail || "Delete request has been logged for admin review");
      closeDeleteModal();
    } catch (error) {
      console.error('Error processing passenger delete request:', error);
      toast.error(error.response?.data?.detail || "Failed to process delete request");
      setError('Failed to process delete request');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleView = async (id) => {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/passengers/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      });

      const passengerData = response.data;
      console.log('Passenger data:', passengerData);

      navigate(`/passenger-info/${id}`, { state: { passenger: passengerData } });
    } catch (error) {
      console.error('Error fetching passenger:', error);
      navigate(`/passenger-info/${id}`, { state: { error: 'Failed to fetch passenger' } });
    }
  };

  const handleAddPassenger = () => {
    navigate('/add-passenger');
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-center">Passenger Management</h2>
          <button className="btn add-btn" onClick={handleAddPassenger}>+ Add</button>
        </div>
        <div className="card">
          <div
            className="card-header text-white"
            style={{ backgroundColor: '#091057' }}
          >
            List of Passengers
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead style={{ backgroundColor: '#091057', color: 'white' }}>
                  <tr>
                    <th>Passenger ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Total Bookings</th>
                    <th>Last Booking</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {passengers.map((passenger) => (
                    <tr key={passenger.id}>
                      <td>{passenger.id}</td>
                      <td>{passenger.name}</td>
                      <td>{passenger.email}</td>
                      <td>{passenger.phone || passenger.contact}</td>
                      <td>{passenger.total_checked_tickets || 0}</td>
                      <td>{new Date(passenger.updated_at).toLocaleDateString()}</td>
                      <td>
                        <span
                          className={`badge ${
                            passenger.boarding_status === 'BOARDED'
                              ? 'bg-success'
                              : passenger.boarding_status === 'NOT_BOARDED'
                              ? 'bg-warning text-dark'
                              : passenger.boarding_status === 'CANCELLED'
                              ? 'bg-danger'
                              : 'bg-secondary'
                          }`}
                        >
                          {passenger.boarding_status?.replace(/_/g, ' ') || 'N/A'}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-success btn-sm me-2 p-1"
                          style={{ fontSize: '0.60rem' }}
                          onClick={() => handleView(passenger.id)}
                        >
                          View
                        </button>
                        <button
                          className="btn btn-warning btn-sm p-1"
                          style={{ fontSize: '0.60rem' }}
                          onClick={() => openDeleteModal(passenger)}
                        >
                          Request Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {error && <p className="text-danger">{error}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={closeDeleteModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Request Passenger Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {passengerToDelete && (
            <div>
              <p>
                Are you sure you want to request deletion of passenger <strong>{passengerToDelete.name}</strong>?
              </p>
              <p>
                <strong>Note:</strong> This will not immediately delete the passenger. 
                The request will be logged for administrator review.
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeDeleteModal}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Submitting...' : 'Submit Request'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default PassengerList;