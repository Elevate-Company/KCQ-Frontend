import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from 'react-toastify';
import Navbar from '../navbar/navbar';
import axios from 'axios';
import { Container, Card, Table, Badge, Spinner, Alert, Row, Col } from 'react-bootstrap';
import '../../css/logs/logs.css';

// Define theme colors to match sidebar
const THEME = {
  primary: '#091057',
  secondary: '#071440',
  accent: '#e8f0fe',
  success: '#34a853',
  danger: '#ea4335',
  warning: '#fbbc04',
  light: '#f8f9fa'
};

function Logs() {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [filterModel, setFilterModel] = useState('');
  const [filterAction, setFilterAction] = useState('');

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

  const getActionBadgeColor = (action) => {
    switch(action.toLowerCase()) {
      case 'create':
        return THEME.success;
      case 'update':
        return THEME.warning;
      case 'delete':
        return THEME.danger;
      default:
        return THEME.primary;
    }
  };

  const filteredLogs = logs.filter(log => {
    const modelMatch = filterModel ? log.model_name.toLowerCase().includes(filterModel.toLowerCase()) : true;
    const actionMatch = filterAction ? log.action.toLowerCase().includes(filterAction.toLowerCase()) : true;
    return modelMatch && actionMatch;
  });

  const uniqueModels = [...new Set(logs.map(log => log.model_name))];
  const uniqueActions = [...new Set(logs.map(log => log.action))];

  return (
    <div>
      <Navbar />
      <Container fluid className="mt-4 px-4">
        <Card className="shadow-sm border-0">
          <Card.Header style={{ backgroundColor: THEME.primary, color: 'white' }}>
            <h4 className="mb-0">System Activity Logs</h4>
          </Card.Header>
          <Card.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Row className="mb-3">
              <Col md={6} lg={3}>
                <div className="mb-3">
                  <label htmlFor="modelFilter" className="form-label">Filter by Model</label>
                  <select 
                    id="modelFilter" 
                    className="form-select"
                    value={filterModel}
                    onChange={(e) => setFilterModel(e.target.value)}
                  >
                    <option value="">All Models</option>
                    {uniqueModels.map(model => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </select>
                </div>
              </Col>
              <Col md={6} lg={3}>
                <div className="mb-3">
                  <label htmlFor="actionFilter" className="form-label">Filter by Action</label>
                  <select 
                    id="actionFilter" 
                    className="form-select"
                    value={filterAction}
                    onChange={(e) => setFilterAction(e.target.value)}
                  >
                    <option value="">All Actions</option>
                    {uniqueActions.map(action => (
                      <option key={action} value={action}>{action}</option>
                    ))}
                  </select>
                </div>
              </Col>
            </Row>

            <div className="table-responsive">
              <Table hover className="align-middle">
                <thead style={{ backgroundColor: THEME.accent }}>
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
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-4">No logs found</td>
                    </tr>
                  ) : (
                    filteredLogs.map((log, index) => (
                      <tr key={index}>
                        <td>{formatTimestamp(log.timestamp)}</td>
                        <td>{log.user}</td>
                        <td>
                          <Badge pill bg="none" style={{ 
                            backgroundColor: getActionBadgeColor(log.action),
                            color: 'white'
                          }}>
                            {log.action}
                          </Badge>
                        </td>
                        <td>{log.model_name}</td>
                        <td>{log.object_id}</td>
                        <td>
                          <div style={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {log.details}
                          </div>
                        </td>
                        <td>{log.ip_address}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
            <div className="mt-3 text-muted small">
              Showing {filteredLogs.length} of {logs.length} logs
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default Logs;