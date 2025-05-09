import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../navbar/navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Modal, Button, Container, Card, Table, Badge, Spinner, Row, Col } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import '../../css/passenger/passenger.css';

function PassengerList() {
  const [passengers, setPassengers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [passengerToDelete, setPassengerToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';

  useEffect(() => {
    const fetchPassengers = async () => {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }
      
      try {
        // Get the passenger list with their bookings info included
        const response = await axios.get(`${apiUrl}/api/passengers/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        });

        const passengersData = response.data.passengers;
        
        // For each passenger, get their tickets
        const passengersWithTickets = await Promise.all(
          passengersData.map(async (passenger) => {
            try {
              // Get tickets issued to this passenger
              const ticketsResponse = await axios.get(
                `${apiUrl}/api/tickets/by-passenger/${passenger.id}/`,
                {
                  headers: {
                    Authorization: `Token ${token}`,
                  },
                }
              );
              
              // Count the tickets
              const ticketCount = ticketsResponse.data.length || 0;
              
              // Return passenger with ticket count
              return {
                ...passenger,
                total_checked_tickets: ticketCount
              };
            } catch (error) {
              console.error(`Error fetching tickets for passenger ${passenger.id}:`, error);
              return {
                ...passenger,
                total_checked_tickets: 0
              };
            }
          })
        );

        setPassengers(passengersWithTickets);
      } catch (error) {
        console.error('Error fetching passengers:', error);
        setError('Failed to fetch passengers');
      } finally {
        setLoading(false);
      }
    };

    fetchPassengers();
  }, [apiUrl]);

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
      const response = await axios.delete(`${apiUrl}/api/passengers/${passengerToDelete.id}/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      });

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
    navigate(`/passenger-info/${id}`);
  };

  const handleAddPassenger = () => {
    navigate('/add-passenger');
  };

  // Filter passengers based on search term
  const filteredPassengers = passengers.filter(passenger => 
    passenger.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    passenger.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    passenger.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Navbar />
      <Container fluid className="mt-4 px-4">
        <Card className="shadow-sm border-0">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0">Passenger Management</h4>
            <Button 
              variant="outline-light"
              className="back-btn"
              onClick={handleAddPassenger}
              style={{ width: 'auto', minWidth: '120px' }}
            >
              <FaPlus className="me-2" /> Add Passenger
            </Button>
          </Card.Header>
          <Card.Body>
            <Row className="mb-3">
              <Col md={6} lg={4}>
                <div className="mb-3">
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Search passengers..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </Col>
            </Row>

            <div className="passenger-table-container">
              <Table responsive hover className="align-middle passenger-table">
                <thead>
                  <tr>
                    <th style={{ width: '20%' }}>Name</th>
                    <th style={{ width: '20%' }}>Email</th>
                    <th style={{ width: '15%' }}>Phone</th>
                    <th style={{ width: '10%', textAlign: 'center' }}>Bookings</th>
                    <th style={{ width: '10%' }}>Last Updated</th>
                    <th style={{ width: '20%' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPassengers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        {searchTerm ? "No passengers match your search" : "No passengers found"}
                      </td>
                    </tr>
                  ) : (
                    filteredPassengers.map((passenger) => (
                      <tr key={passenger.id}>
                        <td>{passenger.name}</td>
                        <td>{passenger.email || 'N/A'}</td>
                        <td>{passenger.phone || passenger.contact || 'N/A'}</td>
                        <td className="text-center">
                          <Badge bg="none" style={{ 
                            backgroundColor: passenger.total_checked_tickets > 0 ? '#e8f0fe' : '#f5f5f5',
                            color: passenger.total_checked_tickets > 0 ? '#091057' : '#6c757d',
                            fontSize: '0.85rem',
                            padding: '6px 10px'
                          }}>
                            {passenger.total_checked_tickets || 0}
                          </Badge>
                        </td>
                        <td>{new Date(passenger.updated_at).toLocaleDateString('en-PH', { timeZone: 'Asia/Manila' })}</td>
                        <td>
                          <div className="action-buttons">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="view-btn"
                              onClick={() => handleView(passenger.id)}
                            >
                              View
                            </Button>
                            <Button
                              variant="outline-warning"
                              size="sm"
                              className="delete-btn"
                              onClick={() => openDeleteModal(passenger)}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      </Container>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={closeDeleteModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Passenger</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to request deletion of passenger: 
          <strong> {passengerToDelete?.name}</strong>?
          <p className="text-muted mt-2">
            Note: This will be reviewed by an administrator before permanent deletion.
          </p>
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
            {isDeleting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Processing...
              </>
            ) : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default PassengerList;