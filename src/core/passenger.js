import React from 'react';
import Navbar from './navbar/navbar';
import 'bootstrap/dist/css/bootstrap.min.css';

function PassengerList() {
  const passengers = [
    {
      id: 'P123456',
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '+1-555-123-4567',
      totalBookings: 15,
      lastBooking: 'Nov 15, 2024',
      status: 'Active',
    },
    {
      id: 'P123457',
      name: 'Jane Smith',
      email: 'janesmith@example.com',
      phone: '+1-555-987-6543',
      totalBookings: 8,
      lastBooking: 'Oct 30, 2024',
      status: 'Inactive',
    },
    {
      id: 'P123458',
      name: 'Emily Brown',
      email: 'emilybrown@example.com',
      phone: '+1-555-222-3344',
      totalBookings: 12,
      lastBooking: 'Nov 10, 2024',
      status: 'Active',
    },
  ];

  return (
    <div>
      <Navbar />

      <div className="container mt-4">
        {/* Page Title */}
        <h1 className="text-center mb-4">Passenger Management</h1>

        {/* Passenger List */}
        <div className="card">
          <div className="card-header bg-primary text-white">
            List of Passengers
          </div>
          <div className="card-body">
            <table className="table table-striped table-responsive-sm">
              <thead style={{ backgroundColor: '#091057',}}>
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
                    <td>{passenger.phone}</td>
                    <td>{passenger.totalBookings}</td>
                    <td>{passenger.lastBooking}</td>
                    <td>
                      <span
                        className={`badge ${
                          passenger.status === 'Active'
                            ? 'bg-success'
                            : 'bg-secondary'
                        }`}
                      >
                        {passenger.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-success btn-sm me-2">View</button>
                      <button className="btn btn-danger btn-sm">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PassengerList;
