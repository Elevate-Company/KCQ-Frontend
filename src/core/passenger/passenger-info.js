import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../navbar/navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

function PassengerInfo() {
  const { id } = useParams();
  const [passenger, setPassenger] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPassenger = async () => {
      const token = localStorage.getItem('accessToken');
      console.log('Token:', token);
      try {
        const response = await axios.get(`https://api.kcq-express.co/api/passengers/${id}/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        });

        const data = response.data;
        console.log('Response data:', data);

        setPassenger(data);
      } catch (error) {
        console.error('Error fetching passenger:', error);
        setError('Failed to fetch passenger');
      }
    };

    fetchPassenger();
  }, [id]);

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  if (!passenger) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h1 className="text-center mb-4">Passenger Information</h1>
        <div className="card">
          <div
            className="card-header text-white"
            style={{ backgroundColor: '#091057' }}
          >
            Passenger Details
          </div>
          <div className="card-body">
            <table className="table table-striped">
              <tbody>
                <tr>
                  <th>ID</th>
                  <td>{passenger.id}</td>
                </tr>
                <tr>
                  <th>Name</th>
                  <td>{passenger.name}</td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>{passenger.email || 'N/A'}</td>
                </tr>
                <tr>
                  <th>Contact</th>
                  <td>{passenger.contact || 'N/A'}</td>
                </tr>
                <tr>
                  <th>Total Bookings</th>
                  <td>{passenger.total_bookings}</td>
                </tr>
                <tr>
                  <th>Boarding Status</th>
                  <td>{passenger.boarding_status}</td>
                </tr>
                <tr>
                  <th>Created At</th>
                  <td>{new Date(passenger.created_at).toLocaleString()}</td>
                </tr>
                <tr>
                  <th>Updated At</th>
                  <td>{new Date(passenger.updated_at).toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PassengerInfo;