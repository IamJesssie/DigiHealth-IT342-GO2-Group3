import React, { useState, useEffect } from "react";
import AuthLayout from "./AuthLayout"; // Import the new base
import { useAuth } from "../auth/auth";
import { useNavigate, useLocation } from "react-router-dom";

export default function DigiHealthLoginScreen({ onNavigateToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Show approval message from registration
  useEffect(() => {
    if (location.state?.message) {
      setErrorMsg(location.state.message);
    }
  }, [location.state]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    try {
      await login(email, password, { allowedRole: "DOCTOR" });
      navigate("/dashboard");
    } catch (error) {
      console.error("[LoginScreen] Login error:", error);
      console.error(
        "[LoginScreen] Error response status:",
        error.response?.status
      );
      console.error("[LoginScreen] Error response data:", error.response?.data);

      const backendMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        (typeof error.response?.data === "string" ? error.response.data : null);

      if (
        backendMessage?.includes("pending approval") ||
        error.response?.status === 403
      ) {
        setErrorMsg(
          "Your doctor account is pending approval. Please wait for an administrator to approve your registration before logging in. This typically takes 24-48 hours. Contact support if this takes longer."
        );
      } else if (error.response?.status === 401) {
        setErrorMsg(
          "Invalid email or password. Please check your credentials and try again."
        );
      } else {
        setErrorMsg(
          backendMessage ||
            error.message ||
            "Invalid email or password. Please try again."
        );
      }
      console.log("[LoginScreen] Error message set:", setErrorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <form className="form-card login-card-override" onSubmit={handleLogin}>
        <p className="welcome-text">Welcome Back</p>
        <button type="button" className="google-btn">
          <img alt="Google Icon" src="/assets/DoctorLogin.svg" />
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
          <a href="#" className="forgot-password">
            Forgot Password?
          </a>
          {errorMsg && (
            <div className="error-message" style={{ marginTop: "8px" }}>
              {errorMsg}
            </div>
          )}
          <button
            type="submit"
            className="login-btn"
            disabled={submitting || !email || !password}
          >
            {submitting ? "Logging in..." : "Login"}
          </button>
        </div>
        <div className="register-link">
          <p>
            Don't have an account?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/register");
              }}
            >
              Register as a Doctor
            </a>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
