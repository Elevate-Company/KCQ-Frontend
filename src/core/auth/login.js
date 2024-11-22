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
        navigate('/dashboard');
    
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
                            <button
                                type="button"
                                className="btn btn-link p-0"
                                onClick={() => navigate('/forgot-password')}
                                style={{ textDecoration: 'none', color: '#ccc' }}
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
