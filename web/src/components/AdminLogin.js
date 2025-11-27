import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/auth";
import AuthLayout from "./AuthLayout";
import "./AdminLogin.css";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("admin@digihealth.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await login(email, password);

      // Check if user is admin - get user data from response
      const user = response?.data?.user;

      if (!user) {
        setError("Invalid login response. Please try again.");
        return;
      }

      if (user.role !== "ADMIN") {
        setError("Access denied. Admin credentials required.");
        return;
      }

      // Redirect to admin dashboard
      navigate("/admin/dashboard");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Invalid email or password";
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
            <img
              src="/assets/header-logo.svg"
              alt="DigiHealth Logo"
              className="admin-icon"
            />
          </div>

          {/* Title and Description */}
          <h1 className="admin-login-title">DigiHealth Admin</h1>
          <p className="admin-login-description">
            Sign in to access the system administration panel
          </p>
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
                <path
                  d="M2 4l6 4.5L14 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
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
                <rect
                  x="2"
                  y="6"
                  width="12"
                  height="8"
                  rx="1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M4 6V4a4 4 0 118 0v2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
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
            {loading ? "Signing in..." : "Sign In as Admin"}
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
