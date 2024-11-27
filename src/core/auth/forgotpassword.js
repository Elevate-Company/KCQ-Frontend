import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/auth/forgotpassword.css';
import logo from '../../assets/Logo1.png'; // Import the image

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        alert("Reset link sent to: " + email);
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card shadow p-4" style={{ maxWidth: '400px', width: '100%' }}>
                {/* Add the image above the Forgot Password text */}
                <img src={logo} alt="Logo" className="forgotboat mb-4" />
                <h3 className="text-center mb-4">Forgot Password</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                            Email
                        </label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="send-link w-100 mb-3">
                        Send Reset Link
                    </button>
                </form>
                <button
                    className="btn w-100"
                    onClick={() => navigate('/login')}
                >
                    &lt; Back to Login
                </button>
            </div>
        </div>
    );
}

export default ForgotPassword;
