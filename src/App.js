import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './core/auth/login';
import ForgotPassword from './core/auth/forgotpassword';
import Dashboard from './core/components';
import DashboardScreen from './core/dashboard/dashboard';
import IssueTicket from './core/issueticket/issue_ticket';
import ManageTrips from './core/managetrip/manage_trips';
import ManageTickets from './core/manageticket/manage_tickets';
import Passenger from './core/passenger/passenger';
import PassengerInfo from './core/passenger/passenger-info';
import Reports from './core/report/reports';
import Settings from './core/settings/settings';
import ProfileCard from './core/navbar/profilecard';
import ProtectedRoute from './components/protectedroute';
import Checkout from './core/issueticket/checkout';
import AddTrip from './core/managetrip/addtrip';
import TripDetails from './core/managetrip/trip-details';
import TicketDetails from './core/manageticket/ticket-details';
import Logs from './core/logs/logs'; 
import NeedHelp from './core/help/needhelp'; 
import AddPassenger from './core/addpassenger';
import Ticket from './core/issueticket/ticket';
import 'bootstrap/dist/css/bootstrap.min.css';

const isAuthenticated = () => localStorage.getItem('accessToken');

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                <Route
                    path="/"
                    element={
                        isAuthenticated() ? (
                            <ProtectedRoute isAuthenticated={isAuthenticated}>
                                <Dashboard />
                            </ProtectedRoute>
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                >
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<DashboardScreen />} />
                    <Route path="issue-ticket" element={<IssueTicket />} />
                    <Route path="manage-trips" element={<ManageTrips />} />
                    <Route path="manage-tickets" element={<ManageTickets />} />
                    <Route path="passenger" element={<Passenger />} />
                    <Route path="passenger-info/:id" element={<PassengerInfo />} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="profile" element={<ProfileCard />} />
                    <Route path="checkout" element={<Checkout />} />
                    <Route path="addtrip" element={<AddTrip />} />
                    <Route path="trip-details/:id" element={<TripDetails />} />
                    <Route path="ticket-details/:ticketNumber" element={<TicketDetails />} />
                    <Route path="logs" element={<Logs />} /> 
                    <Route path="need-help" element={<NeedHelp />} /> 
                    <Route path="add-passenger" element={<AddPassenger />} /> 
                    <Route path="ticket" element={<Ticket />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;