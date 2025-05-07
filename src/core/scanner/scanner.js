import React, { useState, useEffect, useRef } from 'react';
import { Container, Card, Form, Button, Alert, Spinner, Row, Col, Badge } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { createScannerDetector } from '../../utils/scannerDetector';
import '../../css/scanner/scanner.css';

// Define consistent colors for the application
const THEME = {
  primary: '#0a215a',
  secondary: '#071c4d',
  accent: '#e8f0fe',
  success: '#34a853',
  danger: '#ea4335',
  warning: '#fbbc04',
  dark: '#071440', 
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

  const getBoardingStatusColor = (status) => {
    switch(status) {
      case 'CHECKED_IN':
        return THEME.success;
      case 'BOARDED':
        return THEME.primary;
      case 'NOT_CHECKED_IN':
        return THEME.warning;
      case 'CANCELLED':
      case 'MISSED':
        return THEME.danger;
      default:
        return '#6c757d'; // Gray
    }
  };

  const formatBoardingStatus = (status) => {
    if (!status) return 'N/A';
    return status.replace(/_/g, ' ');
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4 text-center">Ticket Scanner</h2>
      
      <Card className="mb-4 shadow-sm">
        <Card.Header className={`text-white ${isScanning ? 'bg-warning' : 'bg-primary'}`}>
          <h5 className="mb-0">
            {isScanning ? 'Scanning...' : 'Scan Ticket'}
          </h5>
        </Card.Header>
        <Card.Body>
          <p className="mb-3">
            Use the QR code scanner to scan a ticket, or enter the ticket number manually.
            {isScanning && <strong className="text-warning"> Scanner detected!</strong>}
          </p>
          
          <Form onSubmit={handleSubmit} className={isScanning ? 'scanner-active scanning' : 'scanner-active'}>
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
              />
              {isScanning && (
                <div className="scanning-indicator">
                  <Spinner animation="border" size="sm" className="me-2" />
                  Reading...
                </div>
              )}
            </Form.Group>
            
            <div className="d-grid">
              <Button 
                variant="primary" 
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
          
          <Alert variant="info" className="mt-3">
            <h6 className="mb-1">QR Code Scanner Troubleshooting:</h6>
            <ol className="mb-0 ps-3">
              <li>Ensure your QR code scanner is properly connected</li>
              <li>Check scanner configuration (may need to add Enter suffix)</li>
              <li>Try scanning in a text editor first to verify it's working</li>
              <li>If scanner doesn't work, enter ticket number manually</li>
            </ol>
          </Alert>
          
          {/* Debug section for raw input */}
          <div className="mt-3 pt-3 border-top">
            <h6>Scanner Debug Info:</h6>
            <p className="mb-1">
              <small>This section shows what your scanner is sending. After scanning, you should see the ticket number appear in the field above, and here:</small>
            </p>
            <pre className="bg-light p-2 mt-2 mb-0" style={{fontSize: '0.8rem'}}>
              Current input: {ticketNumber || '<none>'}
            </pre>
            <p className="mt-2 mb-0">
              <small>If you see data here but validation fails, the issue might be with the backend validation.</small>
            </p>
          </div>
        </Card.Body>
      </Card>
      
      {lastScanned && (
        <Card className="mb-4 shadow-sm">
          <Card.Header 
            className={lastScanned.valid ? 'bg-success text-white' : 'bg-danger text-white'}
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
                      <Badge 
                        style={{ 
                          backgroundColor: getBoardingStatusColor(lastScanned.ticket.passenger?.boarding_status),
                          color: 'white'
                        }}
                      >
                        {formatBoardingStatus(lastScanned.ticket.passenger?.boarding_status)}
                      </Badge>
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
      
      {recentScans.length > 0 && (
        <Card className="shadow-sm">
          <Card.Header className="bg-light">
            <h5 className="mb-0">Recent Scans</h5>
          </Card.Header>
          <Card.Body className="p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Ticket Number</th>
                    <th>Passenger</th>
                    <th>Status</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {recentScans.map((scan, index) => (
                    <tr key={index}>
                      <td>{formatTimestamp(scan.timestamp)}</td>
                      <td>{scan.ticket?.ticket_number || 'N/A'}</td>
                      <td>{scan.ticket?.passenger?.name || 'N/A'}</td>
                      <td>
                        <Badge 
                          style={{ 
                            backgroundColor: scan.ticket ? getBoardingStatusColor(scan.ticket.passenger?.boarding_status) : '#6c757d',
                            color: 'white'
                          }}
                        >
                          {scan.ticket ? formatBoardingStatus(scan.ticket.passenger?.boarding_status) : 'N/A'}
                        </Badge>
                      </td>
                      <td>
                        <Badge 
                          bg={scan.valid ? 'success' : 'danger'}
                        >
                          {scan.valid ? 'Valid' : 'Invalid'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}

export default Scanner; 