import React, { useState } from 'react';
import './LoginScreen.css';
import { login } from '../api/client';
import { setToken } from '../auth/auth';
import { useNavigate } from 'react-router-dom';

export default function DigiHealthLoginScreen({ onNavigateToRegister, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    try {
      const { token, raw } = await login(email, password);
      // Store token using auth helper (writes to digihealth_jwt)
      setToken(token);

      // Notify parent if provided (backwards compatible)
      if (typeof onLoginSuccess === 'function') {
        onLoginSuccess({ token, raw });
      }

      // Always navigate to dashboard on successful login
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      const backendMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        (typeof error.response?.data === 'string'
          ? error.response.data
          : null);
      setErrorMsg(backendMessage || 'Invalid email or password. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-screen-container">
      <div className="login-form-container">
        <div className="header-container">
          <div className="logo-container">
            <img alt="DigiHealth Logo" className="logo-image" src="/assets/icon.svg" />
          </div>
          <p className="header-title">DigiHealth</p>
          <p className="header-subtitle">Doctor Portal</p>
        </div>
        <form className="form-card" onSubmit={handleLogin}>
          <p className="welcome-text">Welcome Back</p>
          <button type="button" className="google-btn">
            <img alt="Google Icon" src="/assets/doctorlogin.svg" />
            Continue with Google
          </button>
          <div className="divider-container">
            <div className="divider-line" />
            <p className="divider-text">Or login with email</p>
            <div className="divider-line" />
          </div>
          <div className="form-inputs">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="doctor@digihealth.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <a href="#" className="forgot-password">Forgot Password?</a>
            {errorMsg && (
              <div className="error-message" style={{ marginTop: '8px' }}>
                {errorMsg}
              </div>
            )}
            <button
              type="submit"
              className="login-btn"
              disabled={submitting || !email || !password}
            >
              {submitting ? 'Logging in...' : 'Login'}
            </button>
          </div>
          <div className="register-link">
            <p>Don't have an account? <a href="#" onClick={onNavigateToRegister}>Register as a Doctor</a></p>
          </div>
        </form>
        <div className="footer-container">
          <p>DigiHealth Clinic Management System</p>
          <p>© 2025 DigiHealth. All rights reserved.</p>
          <p>For support: support@digihealth.com</p>
        </div>
      </div>
    </div>
  );
}
