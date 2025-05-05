import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../../css/auth/login.css';
import logo from '../../assets/Logo1.png';

function Login() {
    const [employeeNumber, setEmployeeNumber] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        console.log('Submitting login form');

        try {
            const apiUrl = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';
            const response = await fetch(`${apiUrl}/api/auth/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ employee_number: employeeNumber, password }),
            });

            console.log('Response received:', response);

            const data = await response.json();

            console.log('Response data:', data);

            if (!response.ok) {
                console.error('Login failed:', data);
                throw new Error(data.error || 'Login failed');
            }

            localStorage.setItem('accessToken', data.token);
            localStorage.setItem('firstName', data.first_name);
            localStorage.setItem('lastName', data.last_name);
            localStorage.setItem('username', data.username);
            localStorage.setItem('employeeNumber', data.employee_number);
            toast.success('Login successful!');
            navigate('/dashboard');

        } catch (error) {
            console.error('Error during login:', error);
            setError(error.message || 'Login failed. Please check your credentials and try again.');
            toast.error(error.message || 'Login failed. Please check your credentials and try again.');
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSubmit(event);
        }
    };

    return (
        <div className="h-100 d-flex justify-content-center align-items-center">
            <div className="login-container">
                <img src={logo} alt="Logo" className="logo mt-4" />
                <h2 className="title">Welcome to KCQ Express!</h2>
                <p>Welcome back! Please login to access your account</p>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="employeeNumber">Employee Number</label>
                        <input
                            type="text"
                            id="employeeNumber"
                            placeholder="Enter your employee number"
                            value={employeeNumber}
                            onChange={(e) => setEmployeeNumber(e.target.value)}
                            onKeyPress={handleKeyPress}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyPress={handleKeyPress}
                            required
                        />
                    </div>

                    {/* Remember me and Forgot Password links */}
                    <div className="remember-forgot-container mb-4">
                        <div className="remember-me">
                            <input type="checkbox" id="rememberMe" />
                            <label htmlFor="rememberMe">Remember me</label>
                        </div>
                        <div className="forgot-password">
                            <button
                                type="button"
                                className="btn p-0 fs-6"
                                onClick={() => navigate('/forgot-password')}
                                style={{ color: '#000' }}
                            >
                                Forgot Password?
                            </button>
                        </div>
                    </div>

                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
}

export default Login;