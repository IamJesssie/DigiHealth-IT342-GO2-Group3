import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/auth";
import AuthLayout from "./AuthLayout";
import "./AdminLogin.css";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await login(email, password);
      const user = response?.data?.user;

      if (!user) {
        setError("Unexpected login response.");
        return;
      }

      if (user.role !== "ADMIN") {
        setError("This account is not authorized for admin access.");
        return;
      }

      navigate("/admin/dashboard");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Invalid email or password.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="admin-login-container">
        <div className="admin-login-header">
          <div className="admin-header-icon">
            <svg viewBox="0 0 24 24" className="admin-shield-icon">
              <path
                d="M12 2L4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3z"
                fill="#0093e9"
              />
            </svg>
          </div>
          <h2 className="admin-header-title">Administrator Access</h2>
          <p className="admin-header-subtitle">
            Secure login for authorized personnel only
          </p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          {error && <div className="admin-login-error">{error}</div>}

          {/* Email */}
          <div className="form-field">
            <label htmlFor="admin-email">Admin Email</label>
            <div className="input-wrapper">
              <svg className="input-icon" viewBox="0 0 16 16">
                <path
                  d="M2 3h12a1 1 0 011 1v8a1 1 0 01-1 1H2a1 1 0 01-1-1V4a1 1 0 011-1z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M2 4l6 4.5L14 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
              <input
                id="admin-email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
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
                />
              </svg>

              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={loading}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Sign In */}
          <button type="submit" className="admin-signin-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default AdminLogin;
