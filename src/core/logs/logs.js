import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../navbar/navbar';

function Logs() {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Mock data for logs
    const mockLogs = [
      {
        date: '2023-10-01T10:00:00Z',
        user: 'John Doe',
        action: 'Login',
        details: 'User logged in successfully',
      },
      {
        date: '2023-10-01T10:05:00Z',
        user: 'Jane Smith',
        action: 'Logout',
        details: 'User logged out successfully',
      },
      {
        date: '2023-10-01T10:10:00Z',
        user: 'John Doe',
        action: 'Update Profile',
        details: 'User updated profile information',
      },
      {
        date: '2023-10-01T10:15:00Z',
        user: 'Jane Smith',
        action: 'Issue Ticket',
        details: 'User issued a ticket for trip ID 12345',
      },
    ];

    // Simulate fetching logs from an API
    setTimeout(() => {
      setLogs(mockLogs);
    }, 1000);
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <h2 className="mb-4">Logs</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Date</th>
              <th>User</th>
              <th>Action</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index}>
                <td>{new Date(log.date).toLocaleString()}</td>
                <td>{log.user}</td>
                <td>{log.action}</td>
                <td>{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Logs;