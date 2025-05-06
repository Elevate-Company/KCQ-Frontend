import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../navbar/navbar';
import '../../css/issueticket/checkout.css';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';
const STANDARD_PRICE = 400;

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

// Validation helper function
const validateTicketData = (ticket) => {
  if (!ticket.trip) throw new Error('Trip ID is required');
  if (!ticket.passenger) throw new Error('Passenger ID is required');
  if (!ticket.age_group) throw new Error('Age group is required');
  if (!ticket.price) throw new Error('Price is required');
  
  return true;
};

function Checkout() {
  const [tickets, setTickets] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [baggageTickets, setBaggageTickets] = useState([]);
  const [username, setUsername] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [cashAmount, setCashAmount] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedTickets = localStorage.getItem('tickets');
    const savedTotalAmount = localStorage.getItem('totalAmount');
    const usernameID = localStorage.getItem('username');
    setUsername(usernameID);

    if (savedTickets) {
      const parsedTickets = JSON.parse(savedTickets);
      console.log('Raw tickets from localStorage:', parsedTickets);
      
      const validatedTickets = parsedTickets.map((ticket) => {
        console.log('Processing ticket:', ticket);
        if (!ticket.trip?.id || !ticket.passenger?.id) {
          console.error('Missing required IDs:', ticket);
        }
        return {
          ...ticket,
          passenger: {
            ...ticket.passenger,
            total_bookings: ticket.passenger?.total_bookings || 0,
            is_delete: ticket.passenger?.is_delete || false,
            boarding_status: ticket.passenger?.boarding_status || 'NOT_CHECKED_IN',
            created_by: usernameID || 'Unknown',
          },
        };
      });
      
      setTickets(validatedTickets);
      setBaggageTickets(validatedTickets.map((ticket) => ticket.baggage_ticket || false));
      console.log('Processed tickets:', validatedTickets);
    }
    if (savedTotalAmount) {
      setTotalAmount(parseFloat(savedTotalAmount));
      // Initialize cash amount with total
      setCashAmount(savedTotalAmount);
    }
  }, []);

  const handleBaggageTicketChange = (index) => {
    const updatedBaggageTickets = [...baggageTickets];
    updatedBaggageTickets[index] = !updatedBaggageTickets[index];
    setBaggageTickets(updatedBaggageTickets);

    const updatedTickets = [...tickets];
    updatedTickets[index].baggage_ticket = updatedBaggageTickets[index];
    setTickets(updatedTickets);
  };

  const calculateDiscount = (price) => {
    return STANDARD_PRICE - price;
  };

  const normalizeAgeGroup = (ageGroup) => {
    const validGroups = ['adult', 'child', 'student', 'senior', 'infant'];
    const group = ageGroup.toLowerCase();
    return validGroups.includes(group) ? group : 'adult';
  };

  const validatePaymentDetails = () => {
    if (paymentMethod === 'CASH' && (!cashAmount || parseFloat(cashAmount) < totalAmount)) {
      toast.error('Cash amount must be at least equal to the total amount');
      return false;
    }
    
    if ((paymentMethod === 'GCASH' || paymentMethod === 'MAYA') && !referenceNumber) {
      toast.error('Reference number is required for online payments');
      return false;
    }
    
    return true;
  };

  const handleGenerateTicket = async () => {
    try {
      // Validate payment details first
      if (!validatePaymentDetails()) {
        return;
      }

      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error('No access token found. Please log in.');
        return;
      }

      // Prevent duplicate submissions
      if (isGenerating) {
        return;
      }

      setIsGenerating(true);
      setError(null);

      const generatedTickets = [];
      const processedTicketNumbers = new Set(); // Track processed ticket numbers

      for (let i = 0; i < tickets.length; i++) {
        const ticket = tickets[i];

        // Skip if we've already processed this ticket number
        if (processedTicketNumbers.has(ticket.ticket_number)) {
          console.log('Skipping duplicate ticket:', ticket.ticket_number);
          continue;
        }

        // Early validation of required fields
        if (!ticket.trip?.id) {
          throw new Error(`Missing trip ID for ticket ${i + 1}`);
        }
        if (!ticket.passenger?.id) {
          throw new Error(`Missing passenger ID for ${ticket.passenger?.name || 'unknown passenger'}`);
        }

        const transformedTicket = {
          trip_id: parseInt(ticket.trip.id),
          passenger_id: parseInt(ticket.passenger.id),
          ticket_number: ticket.ticket_number || `TICKET-${Date.now()}-${i}`,
          seat_number: ticket.seat_number || '',
          age_group: normalizeAgeGroup(ticket.age_group || 'adult'),
          price: parseFloat(ticket.price || STANDARD_PRICE),
          discount: parseFloat(calculateDiscount(ticket.price || STANDARD_PRICE)),
          baggage_ticket: Boolean(baggageTickets[i]),
          payment_method: paymentMethod,
          payment_reference: paymentMethod !== 'CASH' ? referenceNumber : null,
          cash_amount: paymentMethod === 'CASH' ? parseFloat(cashAmount) : null
        };

        try {
          console.log('Sending ticket data:', transformedTicket);  // Add this debug line
          const response = await axios.post(`${apiUrl}/api/tickets/`, transformedTicket, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Token ${token}`,
            },
          });
          console.log('Ticket Posted Successfully:', response.data);
          generatedTickets.push(response.data);
          processedTicketNumbers.add(ticket.ticket_number); // Mark as processed
        } catch (err) {
          // If it's a duplicate error, skip this ticket
          if (err.response?.data?.error?.includes('UNIQUE constraint failed')) {
            console.log('Ticket already exists:', ticket.ticket_number);
            continue;
          }
          console.error('Full error response:', err.response);
          const errorDetails = err.response?.data || {};
          const errorMessage = Object.entries(errorDetails)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ') || err.message;
          throw new Error(`Failed to post ticket for ${ticket.passenger?.name || 'passenger'}: ${errorMessage}`);
        }
      }

      if (generatedTickets.length > 0) {
        // Clear tickets from localStorage only after successful generation
        localStorage.removeItem('tickets');
        localStorage.removeItem('totalAmount');
        localStorage.setItem('generatedTickets', JSON.stringify(generatedTickets));
        toast.success('Tickets generated successfully!');
        navigate('/ticket', { state: { tickets: generatedTickets } });
      } else {
        setError('No new tickets were generated. They may already exist.');
        toast.warning('No new tickets were generated. They may already exist.');
      }
    } catch (error) {
      console.error('Ticket generation failed:', error);
      setError(error.message || 'Failed to generate tickets');
      toast.error(error.message || 'Failed to generate tickets');
    } finally {
      setIsGenerating(false);
    }
  };

  const isGenerateButtonDisabled = () => {
    return isGenerating || tickets.length === 0;
  };

  const getPaymentMethodIcon = (method) => {
    switch(method) {
      case 'GCASH':
        return <i className="fas fa-mobile-alt" style={{ color: THEME.primary }}></i>;
      case 'MAYA':
        return <i className="fas fa-credit-card" style={{ color: THEME.danger }}></i>;
      default:
        return <i className="fas fa-money-bill-wave" style={{ color: THEME.success }}></i>;
    }
  };

  return (
    <div style={{ background: THEME.light, minHeight: '100vh' }}>
      <Navbar />
      <div className="container mt-5">
        <div className="row">
          <div className="col-12 mb-4">
            <div className="d-flex align-items-center">
              <i className="fas fa-ship fa-2x me-3" style={{ color: THEME.primary }}></i>
              <h2 style={{ color: THEME.secondary, fontWeight: 600 }}>KCQ Express Ferry Checkout</h2>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="card mb-4" style={{ 
              borderRadius: "12px", 
              boxShadow: "0 6px 12px rgba(0,0,0,0.08)", 
              border: `1px solid ${THEME.primary}30`,
              overflow: "hidden"
            }}>
              <div style={{ 
                background: `linear-gradient(135deg, ${THEME.primary}, ${THEME.secondary})`,
                padding: "16px 20px"
              }}>
                <div className="d-flex align-items-center">
                  <i className="fas fa-clipboard-list text-white me-2"></i>
                  <h4 className="mb-0 text-white fw-bold">Ticket Details</h4>
                </div>
              </div>
              <div className="card-body">
                {error && (
                  <div className="alert alert-danger d-flex align-items-center" role="alert">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    <div>{error}</div>
                  </div>
                )}

                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead style={{ background: THEME.accent }}>
                      <tr>
                        <th>Passenger</th>
                        <th>Trip</th>
                        <th>Seat</th>
                        <th>Age Group</th>
                        <th>Amount</th>
                        <th>Baggage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.map((ticket, index) => (
                        <tr key={index}>
                          <td>
                            <div className="d-flex flex-column">
                              <span className="fw-bold">{ticket.passenger?.name || 'N/A'}</span>
                              <small className="text-muted">{ticket.passenger?.email || 'N/A'}</small>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex flex-column">
                              <span>{ticket.trip?.origin || 'N/A'} → {ticket.trip?.destination || 'N/A'}</span>
                              <small style={{ color: THEME.secondary }}>Ticket: {ticket.ticket_number || `TICKET-${index}`}</small>
                            </div>
                          </td>
                          <td>{ticket.seat_number || 'N/A'}</td>
                          <td>
                            <span className="badge" style={{ 
                              background: THEME.accent, 
                              color: THEME.secondary,
                              padding: "6px 8px"
                            }}>
                              {ticket.passenger?.type || 'adult'}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex flex-column">
                              <span className="fw-semibold">PHP {ticket.price || STANDARD_PRICE}</span>
                              <small style={{ color: THEME.success }}>
                                Discount: PHP {calculateDiscount(ticket.price || STANDARD_PRICE)}
                              </small>
                            </div>
                          </td>
                          <td>
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                style={{ borderColor: THEME.primary }}
                                checked={baggageTickets[index] || false}
                                onChange={() => handleBaggageTicketChange(index)}
                              />
                              <label className="form-check-label" onClick={() => handleBaggageTicketChange(index)}>
                                <i className="fas fa-suitcase ms-2" style={{ 
                                  color: baggageTickets[index] ? THEME.primary : '#c0c0c0'
                                }}></i>
                              </label>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot style={{ background: THEME.accent }}>
                      <tr>
                        <td colSpan="4" className="text-end fw-bold">Total:</td>
                        <td colSpan="2" className="fw-bold" style={{ color: THEME.primary }}>PHP {totalAmount}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card mb-4" style={{ 
              borderRadius: "12px", 
              boxShadow: "0 6px 12px rgba(0,0,0,0.08)",
              border: `1px solid ${THEME.primary}30`,
              overflow: "hidden"
            }}>
              <div style={{ 
                background: `linear-gradient(135deg, ${THEME.primary}, ${THEME.secondary})`,
                padding: "16px 20px"
              }}>
                <div className="d-flex align-items-center">
                  <i className="fas fa-credit-card text-white me-2"></i>
                  <h4 className="mb-0 text-white fw-bold">Payment Method</h4>
                </div>
              </div>
              <div className="card-body">
                <div className="payment-options mb-4">
                  <div className="form-check mb-3 p-2" style={{ 
                    borderRadius: "8px", 
                    background: paymentMethod === 'CASH' ? THEME.accent : 'transparent',
                    border: paymentMethod === 'CASH' ? `1px solid ${THEME.primary}30` : 'none'
                  }}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      id="cashOption"
                      value="CASH"
                      checked={paymentMethod === 'CASH'}
                      onChange={() => setPaymentMethod('CASH')}
                      style={{ borderColor: THEME.primary }}
                    />
                    <label className="form-check-label d-flex align-items-center w-100" htmlFor="cashOption">
                      <span className="payment-icon me-3" style={{ width: '30px', textAlign: 'center' }}>
                        <i className="fas fa-money-bill-wave fs-5" style={{ color: THEME.success }}></i>
                      </span>
                      <span className="fw-medium">Cash</span>
                    </label>
                  </div>
                  
                  <div className="form-check mb-3 p-2" style={{ 
                    borderRadius: "8px", 
                    background: paymentMethod === 'GCASH' ? THEME.accent : 'transparent',
                    border: paymentMethod === 'GCASH' ? `1px solid ${THEME.primary}30` : 'none'
                  }}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      id="gcashOption"
                      value="GCASH"
                      checked={paymentMethod === 'GCASH'}
                      onChange={() => setPaymentMethod('GCASH')}
                      style={{ borderColor: THEME.primary }}
                    />
                    <label className="form-check-label d-flex align-items-center w-100" htmlFor="gcashOption">
                      <span className="payment-icon me-3" style={{ width: '30px', textAlign: 'center' }}>
                        <i className="fas fa-mobile-alt fs-5" style={{ color: THEME.primary }}></i>
                      </span>
                      <span className="fw-medium">GCash</span>
                    </label>
                  </div>
                  
                  <div className="form-check mb-3 p-2" style={{ 
                    borderRadius: "8px", 
                    background: paymentMethod === 'MAYA' ? THEME.accent : 'transparent',
                    border: paymentMethod === 'MAYA' ? `1px solid ${THEME.primary}30` : 'none'
                  }}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      id="mayaOption"
                      value="MAYA"
                      checked={paymentMethod === 'MAYA'}
                      onChange={() => setPaymentMethod('MAYA')}
                      style={{ borderColor: THEME.primary }}
                    />
                    <label className="form-check-label d-flex align-items-center w-100" htmlFor="mayaOption">
                      <span className="payment-icon me-3" style={{ width: '30px', textAlign: 'center' }}>
                        <i className="fas fa-credit-card fs-5" style={{ color: THEME.danger }}></i>
                      </span>
                      <span className="fw-medium">Maya</span>
                    </label>
                  </div>
                </div>

                <div className="payment-details p-3" style={{ 
                  background: THEME.accent, 
                  borderRadius: "8px",
                  border: `1px solid ${THEME.primary}30` 
                }}>
                  {paymentMethod === 'CASH' ? (
                    <div className="mb-3">
                      <label htmlFor="cashAmount" className="form-label fw-bold" style={{ color: THEME.secondary }}>
                        <i className="fas fa-money-bill-wave me-2" style={{ color: THEME.success }}></i>
                        Cash Amount
                      </label>
                      <div className="input-group">
                        <span className="input-group-text" style={{ background: THEME.secondary, color: 'white' }}>PHP</span>
                        <input
                          type="number"
                          className="form-control"
                          id="cashAmount"
                          value={cashAmount}
                          onChange={(e) => setCashAmount(e.target.value)}
                          min={totalAmount}
                          required
                          style={{ borderColor: THEME.primary }}
                        />
                      </div>
                      {parseFloat(cashAmount) >= totalAmount && (
                        <div className="mt-2 alert alert-success py-2 d-flex align-items-center">
                          <i className="fas fa-check-circle me-2"></i>
                          <small>Change: PHP {(parseFloat(cashAmount) - totalAmount).toFixed(2)}</small>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="mb-3">
                      <label htmlFor="referenceNumber" className="form-label fw-bold" style={{ color: THEME.secondary }}>
                        <i className={`fas ${paymentMethod === 'GCASH' ? 'fa-mobile-alt' : 'fa-credit-card'} me-2`} 
                           style={{ color: paymentMethod === 'GCASH' ? THEME.primary : THEME.danger }}></i>
                        Reference Number ({paymentMethod === 'GCASH' ? 'GCash' : 'Maya'})
                      </label>
                      <div className="input-group">
                        <span className="input-group-text" style={{ 
                          background: paymentMethod === 'GCASH' ? THEME.primary : THEME.danger, 
                          color: 'white' 
                        }}>
                          <i className={`fas ${paymentMethod === 'GCASH' ? 'fa-mobile-alt' : 'fa-credit-card'}`}></i>
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          id="referenceNumber"
                          value={referenceNumber}
                          onChange={(e) => setReferenceNumber(e.target.value)}
                          placeholder="Enter reference number"
                          required
                          style={{ borderColor: paymentMethod === 'GCASH' ? THEME.primary : THEME.danger }}
                        />
                      </div>
                      <div className="mt-2 d-flex align-items-start text-muted">
                        <i className="fas fa-info-circle me-2 mt-1"></i>
                        <small>
                          Please enter the reference number from your {paymentMethod === 'GCASH' ? 'GCash' : 'Maya'} payment receipt.
                        </small>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  className="btn w-100 mt-4 py-3"
                  onClick={handleGenerateTicket}
                  disabled={isGenerateButtonDisabled()}
                  style={{ 
                    background: `linear-gradient(135deg, ${THEME.primary}, ${THEME.secondary})`,
                    color: 'white',
                    borderRadius: '8px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    opacity: isGenerateButtonDisabled() ? 0.7 : 1
                  }}
                >
                  {isGenerating ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Generating Tickets...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-ship me-2"></i>
                      Generate Tickets
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;