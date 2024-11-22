import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/auth/login.css';
import logo from '../../assets/Logo1.png';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://127.0.0.1:8000/api/login/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('accessToken', data.accessToken);
                navigate('/dashboard'); // Navigate to dashboard on successful login
            } else {
                alert(data.detail || 'Invalid credentials');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            alert('Something went wrong. Please try again.');
        }
    };

    return (
        <div className="h-100 d-flex justify-content-center align-items-center">
            <div className="login-container">
                <img src={logo} alt="Logo" className="logo mt-4" />
                <h2 className="title">Welcome to KCQ Express!</h2>
                <p>Welcome back! Please login to access your account</p>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="username">Email or Username</label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Enter your email or username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
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
                            required
                        />
                    </div>

                    {/* Remember me and Forgot Password links */}
                    <div className="remember-forgot-container">
                        <div className="remember-me">
                            <input type="checkbox" id="rememberMe" />
                            <label htmlFor="rememberMe">Remember me</label>
                        </div>
                        <div className="forgot-password">
                            <a href="/forgot-password">Forgot Password?</a>
                        </div>
                    </div>

                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
}

export default Login;
