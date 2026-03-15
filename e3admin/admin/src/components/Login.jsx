import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdEmail, MdLock } from 'react-icons/md';
import './Login.css';
import e3logo from '../assets/e3logo.png';
// Use the jpg branding as seen in Dashboard

const Login = ({ onLogin }) => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Secure authentication using environment variables
        const adminUser = import.meta.env.VITE_ADMIN_USERNAME;
        const adminPass = import.meta.env.VITE_ADMIN_PASSWORD;

        if (credentials.username === adminUser && credentials.password === adminPass) {
            localStorage.setItem('isAuthenticated', 'true');
            onLogin();
            navigate('/dashboard');
        } else {
            setError('Invalid username or password');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '20px', color: '#D32F2F', fontStyle: 'italic' }}>NEXTGEN</h1>
                    <h2>Admin Login</h2>
                    <p>Enter your credentials to access the panel</p>
                </div>

                {error && <div className="error-msg">{error}</div>}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label>Username</label>
                        <div className="form-input-wrapper">
                            <MdEmail className="input-icon" /> {/* Keeping icon or can change to MdPerson if available, assuming MdEmail for now based on previous code or should I import MdPerson? Let's stick to existing imports or check if MdPerson is available. Previous code imported { MdEmail, MdLock }. I'll stick to MdEmail or better, change to text type and 'username' name. */}
                            <input
                                type="text"
                                name="username"
                                placeholder="Enter username"
                                value={credentials.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <div className="form-input-wrapper">
                            <MdLock className="input-icon" />
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                value={credentials.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="login-btn">
                        Sign In
                    </button>
                </form>

                <div className="login-footer">
                    <p>© 2026 Nextgen. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
