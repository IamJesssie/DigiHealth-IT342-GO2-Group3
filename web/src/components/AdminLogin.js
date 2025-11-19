import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/auth';
import './AdminLogin.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@digihealth.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      // Redirect to admin dashboard
      navigate('/admin/dashboard');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Invalid email or password';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-background"></div>

      <div className="admin-login-card">
        {/* Card Header */}
        <div className="admin-login-header">
          {/* Admin Icon */}
          <div className="admin-icon-wrapper">
            <svg viewBox="0 0 32 32" className="admin-icon">
              <rect x="8" y="6" width="16" height="6" rx="1" fill="currentColor" />
              <path
                d="M16 6C16 6 10 8 10 14V20C10 24.5 16 28 16 28C16 28 22 24.5 22 20V14C22 8 16 6 16 6Z"
                fill="currentColor"
                opacity="0.6"
              />
              <circle cx="16" cy="16" r="3" fill="currentColor" opacity="0.8" />
            </svg>
          </div>

          {/* Title and Description */}
          <h1 className="admin-login-title">DigiHealth Admin</h1>
          <p className="admin-login-description">Sign in to access the system administration panel</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="admin-login-form">
          {/* Error Message */}
          {error && <div className="admin-login-error">{error}</div>}

          {/* Email Field */}
          <div className="form-field">
            <label htmlFor="admin-email">Admin Email</label>
            <div className="input-wrapper">
              <svg className="input-icon" viewBox="0 0 16 16">
                <path
                  d="M2 3h12a1 1 0 011 1v8a1 1 0 01-1 1H2a1 1 0 01-1-1V4a1 1 0 011-1z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M2 4l6 4.5L14 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <input
                id="admin-email"
                type="email"
                placeholder="admin@digihealth.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="form-field">
            <label htmlFor="admin-password">Password</label>
            <div className="input-wrapper">
              <svg className="input-icon" viewBox="0 0 16 16">
                <rect x="2" y="6" width="12" height="8" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <path d="M4 6V4a4 4 0 118 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="8" cy="10" r="1" fill="currentColor" />
              </svg>
              <input
                id="admin-password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Sign In Button */}
          <button type="submit" className="admin-signin-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In as Admin'}
          </button>

          {/* Demo Credentials Helper */}
          <div className="demo-credentials">
            <p className="demo-label">Demo Credentials:</p>
            <p className="demo-text">Email: admin@digihealth.com</p>
            <p className="demo-text">Password: admin123</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
