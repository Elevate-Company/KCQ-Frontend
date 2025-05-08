import React, { useState, useEffect, useRef } from 'react';
import { Container, Card, Form, Button, Alert, Spinner, Row, Col, Badge, Table } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { createScannerDetector } from '../../utils/scannerDetector';
import '../../css/scanner/scanner.css';
import '../../css/scanner/scanner-fixes.css'; // Import the fixes CSS
import Navbar from '../navbar/navbar';

// Define consistent colors to match the sidebar
const THEME = {
  primary: '#091057',
  secondary: '#071440',
  accent: '#e8f0fe',
  success: '#34a853',
  danger: '#ea4335',
  warning: '#fbbc04',
  light: '#f8f9fa'
};

function Scanner() {
  const [ticketNumber, setTicketNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [error, setError] = useState(null);
  const [lastScanned, setLastScanned] = useState(null);
  const [recentScans, setRecentScans] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  
  const inputRef = useRef(null);
  const scannerRef = useRef(null);
  const apiUrl = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';

  // Initialize scanner detector
  useEffect(() => {
    // Initialize scanner detector
    scannerRef.current = createScannerDetector(
      // On successful scan completion
      (scannedCode) => {
        console.log('QR code scanned:', scannedCode);
        // Show code in the UI for debugging purposes
        setTicketNumber(scannedCode);
        validateTicket(scannedCode);
        setIsScanning(false);
      },
      // On scan start
      () => {
        setIsScanning(true);
        setError(null);
      },
      // On scan error
      (errorMsg) => {
        console.error('Scan error:', errorMsg);
        setError(`Scanner error: ${errorMsg}`);
        setIsScanning(false);
      }
    );
    
    // Start the scanner detector
    scannerRef.current.init();
    
    // Clean up on unmount
    return () => {
      if (scannerRef.current) {
        scannerRef.current.destroy();
      }
    };
  }, []);

  // Keep input field focused
  useEffect(() => {
    const focusInput = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };
    
    focusInput();
    document.addEventListener('click', focusInput);
    
    return () => {
      document.removeEventListener('click', focusInput);
    };
  }, []);
  
  // Handle manual input changes
  const handleInputChange = (e) => {
    setTicketNumber(e.target.value);
  };

  // Handle form submission for manual input
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!ticketNumber.trim()) {
      setError('Please enter a ticket number');
      return;
    }
    
    validateTicket(ticketNumber);
  };
  
  // Make the API call to validate the ticket
  const validateTicket = async (code) => {
    setIsLoading(true);
    setError(null);
    setValidationResult(null);
    
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(
        `${apiUrl}/api/tickets/validate-scan/`,
        { ticket_number: code },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
        }
      );
      
      // Log the structure to debug
      console.log('Ticket validation response:', response.data);
      
      // Update last scanned ticket and add to recent scans
      setLastScanned({
        timestamp: new Date(),
        ...response.data
      });
      
      // Keep only the last 5 scans
      if (response.data.ticket) {
        setRecentScans(prev => {
          const newScans = [{
            timestamp: new Date(),
            ...response.data
          }, ...prev];
          
          return newScans.slice(0, 5);
        });
      }
      
      setValidationResult(response.data);
      
      // Show toast notification
      if (response.data.valid) {
        toast.success('Ticket validated successfully');
      } else {
        toast.error(response.data.message);
      }
      
    } catch (err) {
      console.error('Error validating ticket:', err);
      setError(err.response?.data?.message || 'Failed to validate ticket');
      toast.error('Error validating ticket');
    } finally {
      setIsLoading(false);
      setTicketNumber(''); // Clear input after submission
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const formatTimestamp = (date) => {
    if (!date) return 'N/A';
    return date.toLocaleString();
  };

  const formatBoardingStatus = (status) => {
    if (!status) return 'N/A';
    return status.replace(/_/g, ' ');
  };

  // Render boarding status badge with proper styling
  const renderBoardingStatus = (ticket) => {
    // Use ticket's boarding_status
    const status = ticket?.boarding_status || 'N/A';
    
    if (!status || status === 'N/A') {
      return <span className="status-badge badge-na">N/A</span>;
    }
    
    let badgeClass = "badge-na";
    switch(status) {
      case 'CHECKED_IN':
        badgeClass = "badge-valid";
        break;
      case 'BOARDED':
        badgeClass = "badge-boarded";
        break;
      case 'NOT_CHECKED_IN':
      case 'NOT_BOARDED':
        badgeClass = "badge-na";
        break;
      case 'CANCELLED':
      case 'MISSED':
        badgeClass = "badge-invalid";
        break;
      default:
        badgeClass = "badge-na";
    }
    
    return <span className={`status-badge ${badgeClass}`}>
      {status.replace(/_/g, ' ')}
    </span>;
  };

  // Render validation result badge
  const renderValidationBadge = (isValid) => {
    return (
      <span className={`status-badge ${isValid ? 'badge-valid' : 'badge-invalid'}`}>
        {isValid ? 'Valid' : 'Invalid'}
      </span>
    );
  };

  return (
    <div>
      <Navbar />
      <Container fluid className="py-4 px-4">
        <Card className="shadow-sm border-0 mb-4">
          <Card.Header className="card-header-primary">
            <h4 className="mb-0">{isScanning ? 'Scanning...' : 'Ticket Scanner'}</h4>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col lg={7}>
                <p className="mb-3">
                  Use the QR code scanner to scan a ticket, or enter the ticket number manually.
                  {isScanning && <strong className="text-warning"> Scanner detected!</strong>}
                </p>
                
                <Form onSubmit={handleSubmit} className={isScanning ? 'scanner-active scanning mb-4' : 'scanner-active mb-4'}>
                  <Form.Group className="mb-3 position-relative">
                    <Form.Label>Ticket Number</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Scan or enter ticket number"
                      value={ticketNumber}
                      onChange={handleInputChange}
                      ref={inputRef}
                      autoFocus
                      readOnly={isLoading || isScanning}
                      className="scanner-input"
                      style={{ borderColor: isScanning ? THEME.warning : THEME.primary }}
                    />
                    {isScanning && (
                      <div className="scanning-indicator" style={{ backgroundColor: THEME.warning }}>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Reading...
                      </div>
                    )}
                  </Form.Group>
                  
                  <div className="d-grid">
                    <Button 
                      type="submit" 
                      disabled={isLoading || !ticketNumber.trim() || isScanning}
                      style={{ backgroundColor: THEME.primary, borderColor: THEME.primary }}
                    >
                      {isLoading ? (
                        <>
                          <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                          Validating...
                        </>
                      ) : 'Validate Ticket'}
                    </Button>
                  </div>
                </Form>
                
                {error && (
                  <Alert variant="danger" className="mt-3">
                    {error}
                  </Alert>
                )}
                
                {lastScanned && (
                  <Card className="border-0 shadow-sm mt-4">
                    <Card.Header
                      className={lastScanned.valid ? 'validation-header' : 'validation-header-invalid'}
                    >
                      <h5 className="mb-0">
                        {lastScanned.valid ? 'Valid Ticket' : 'Invalid Ticket'}
                      </h5>
                    </Card.Header>
                    <Card.Body>
                      <p className="mb-2">
                        <strong>Status:</strong> {lastScanned.message}
                      </p>
                      <p className="mb-0">
                        <strong>Scanned at:</strong> {formatTimestamp(lastScanned.timestamp)}
                      </p>
                      
                      {lastScanned.ticket && (
                        <div className="mt-3 pt-3 border-top">
                          <h6>Ticket Details</h6>
                          <Row>
                            <Col md={6}>
                              <p className="mb-1"><strong>Ticket Number:</strong> {lastScanned.ticket.ticket_number}</p>
                              <p className="mb-1"><strong>Passenger:</strong> {lastScanned.ticket.passenger?.name || 'N/A'}</p>
                              <p className="mb-1">
                                <strong>Status:</strong>{' '}
                                {renderBoardingStatus(lastScanned.ticket)}
                              </p>
                            </Col>
                            <Col md={6}>
                              <p className="mb-1"><strong>Trip:</strong> {lastScanned.ticket.trip?.origin} to {lastScanned.ticket.trip?.destination}</p>
                              <p className="mb-1"><strong>Seat:</strong> {lastScanned.ticket.seat_number || 'N/A'}</p>
                              <p className="mb-1"><strong>Issued:</strong> {formatDate(lastScanned.ticket.issue_date)}</p>
                            </Col>
                          </Row>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                )}
              </Col>
              
              <Col lg={5}>
                <Card className="border-0 shadow-sm h-100">
                  <Card.Header className="recent-scans-header">
                    <h5 className="mb-0">Recent Scans</h5>
                  </Card.Header>
                  <Card.Body className="p-0">
                    <div className="table-responsive">
                      <Table striped hover responsive className="mt-3 recent-scans-table">
                        <thead className="table-header">
                          <tr>
                            <th>Timestamp</th>
                            <th>Ticket Number</th>
                            <th>Passenger</th>
                            <th>Status</th>
                            <th>Result</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentScans.length === 0 ? (
                            <tr>
                              <td colSpan="5" className="text-center">No scans yet</td>
                            </tr>
                          ) : (
                            recentScans.map((scan, index) => (
                              <tr key={index}>
                                <td>{formatTimestamp(scan.timestamp)}</td>
                                <td>{scan.ticket?.ticket_number || 'N/A'}</td>
                                <td>{scan.ticket?.passenger?.name || 'N/A'}</td>
                                <td>
                                  {renderBoardingStatus(scan.ticket)}
                                </td>
                                <td>
                                  {renderValidationBadge(scan.valid)}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </Table>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        
        <Card className="shadow-sm border-0">
          <Card.Header className="card-header-primary">
            <h5 className="mb-0">Scanning Tips</h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <h6>For QR Scanner Users:</h6>
                <ol>
                  <li>Click in the text field to ensure it's focused</li>
                  <li>Scan the ticket's QR code</li>
                  <li>The scanner should automatically submit the code</li>
                </ol>
              </Col>
              <Col md={6}>
                <h6>For Manual Entry:</h6>
                <ol>
                  <li>Type the ticket number in the field</li>
                  <li>Click "Validate Ticket" or press Enter</li>
                  <li>Verify the ticket information matches the passenger</li>
                </ol>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default Scanner; 