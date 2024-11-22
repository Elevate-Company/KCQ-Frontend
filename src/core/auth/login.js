import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/auth/login.css';
import logo from '../../assets/logo.png';

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
        <div className='h-100 d-flex justify-content-center align-items-center'>

        <div className="login-container">
            <img src={logo} alt="Logo" className="logo" />
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
            <p>
                <a href="/forgot-password">Forgot Password?</a>
            </p>
        </div>
        </div>
    );
}

export default Login;
