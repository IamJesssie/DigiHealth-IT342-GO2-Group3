import React, { useState } from 'react';
import axios from 'axios';
import './LoginScreen.css';

export default function DigiHealthLoginScreen({ onNavigateToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('Attempting to login with:', { email, password });
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email,
        password,
      });
      console.log('Login successful:', response.data);
      // Here you would typically save the token and redirect the user
    } catch (error) {
      console.error('Login failed:', error.response ? error.response.data : error.message);
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
            <button type="submit" className="login-btn">Login</button>
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
