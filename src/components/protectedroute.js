import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
    const isAuthenticated = !!localStorage.getItem('accessToken');

    // If not authenticated, redirect to the login page
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children; // If authenticated, show the protected component
}

export default ProtectedRoute;
