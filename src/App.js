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
import Reports from './core/report/reports';
import Settings from './core/settings/settings';
import ProfileCard from './core/navbar/profilecard';
import ProtectedRoute from './components/protectedroute';
import Checkout from './core/issueticket/checkout'; // Import Checkout component
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
                    <Route path="reports" element={<Reports />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="profile" element={<ProfileCard />} />
                    <Route path="checkout" element={<Checkout />} /> {/* Add Checkout route */}
                </Route>
            </Routes>
        </Router>
    );
}

export default App;