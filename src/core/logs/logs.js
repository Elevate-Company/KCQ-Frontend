import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from 'react-toastify';
import Navbar from '../navbar/navbar';
import axios from 'axios';

function Logs() {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }
      
      try {
        const apiUrl = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';
        const response = await axios.get(`${apiUrl}/api/logs/`, {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        
        setLogs(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching logs:', err);
        setError('Failed to fetch logs: ' + (err.response?.data?.error || err.message));
        toast.error('Failed to fetch logs');
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <h2 className="mb-4">Activity Logs</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        
        {loading ? (
          <div className="d-flex justify-content-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>User</th>
                <th>Action</th>
                <th>Model</th>
                <th>Object ID</th>
                <th>Details</th>
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">No logs found</td>
                </tr>
              ) : (
                logs.map((log, index) => (
                  <tr key={index}>
                    <td>{formatTimestamp(log.timestamp)}</td>
                    <td>{log.user}</td>
                    <td>{log.action}</td>
                    <td>{log.model_name}</td>
                    <td>{log.object_id}</td>
                    <td>{log.details}</td>
                    <td>{log.ip_address}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Logs;