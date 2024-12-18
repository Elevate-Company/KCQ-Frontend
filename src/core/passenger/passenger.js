import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../navbar/navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

function PassengerList() {
  const [passengers, setPassengers] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPassengers = async () => {
      const token = localStorage.getItem('accessToken');
      console.log('Token:', token);
      try {
        const response = await axios.get('https://api.kcq-express.co/api/passengers/', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        });

        const data = response.data;
        console.log('Response data:', data);

        setPassengers(data.passengers); // Assuming the API returns an object with a 'passengers' array
      } catch (error) {
        console.error('Error fetching passengers:', error);
        setError('Failed to fetch passengers');
      }
    };

    fetchPassengers();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this passenger?');
    if (!confirmDelete) return;

    const token = localStorage.getItem('accessToken');
    try {
      await axios.delete(`https://api.kcq-express.co/api/passengers/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      });

      setPassengers(passengers.filter(passenger => passenger.id !== id));
    } catch (error) {
      console.error('Error deleting passenger:', error);
      setError('Failed to delete passenger');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h1 className="text-center mb-4">Passenger Management</h1>
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
                      <td>{passenger.total_bookings}</td>
                      <td>{new Date(passenger.updated_at).toLocaleDateString()}</td>
                      <td>
                        <span
                          className={`badge ${
                            passenger.boarding_status === 'Boarded'
                              ? 'bg-success'
                              : passenger.boarding_status === 'In Transit'
                              ? 'bg-warning text-dark'
                              : 'bg-secondary'
                          }`}
                        >
                          {passenger.boarding_status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-success btn-sm me-2 p-1"
                          style={{ fontSize: '0.60rem' }}
                          onClick={() => navigate(`/passenger-info/${passenger.id}`)}
                        >
                          View
                        </button>
                        <button
                          className="btn btn-danger btn-sm p-1"
                          style={{ fontSize: '0.60rem' }}
                          onClick={() => handleDelete(passenger.id)}
                        >
                          Delete
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
    </div>
  );
}

export default PassengerList;