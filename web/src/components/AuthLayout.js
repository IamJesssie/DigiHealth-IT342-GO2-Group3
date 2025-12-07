import React, { useState } from "react";
import "./AuthLayout.css";

const AuthLayout = ({
  subtitle,
  children,
  alternateFormLabel,
  onAlternateFormClick,
}) => {
  const [fade, setFade] = useState("fade-in");

  const handleFadeSwitch = () => {
    setFade("fade-out");
    setTimeout(() => {
      if (onAlternateFormClick) onAlternateFormClick();
      setFade("fade-in");
    }, 300);
  };

  return (
    <div className="auth-layout-container">
      <div className="auth-content-container">
        {/* Shared Header Section */}
        <div className="header-container">
          <div className="logo-container">
            <img
              alt="DigiHealth Logo"
              className="logo-image"
              src="/assets/Icon.svg"
            />
          </div>
          <p className="header-subtitle">{subtitle}</p>
        </div>

        {/* Dynamic Content (Forms/Steppers go here) */}
        <div className={`auth-body ${fade}`}>
          {children}
          {alternateFormLabel && (
            <p className="switch-form" onClick={handleFadeSwitch}>
              {alternateFormLabel}
            </p>
          )}
        </div>

        {/* Shared Footer Section */}
        <div className="footer-container">
          <div className="footer-top">
            <div className="footer-brand">
              <span>DigiHealth</span>
            </div>
            <div className="footer-links">
              <a href="mailto:support@digihealth.com">Support</a>
              <a href="/terms">Terms</a>
              <a href="/privacy">Privacy</a>
            </div>
          </div>
          <div className="footer-divider"></div>
          <div className="footer-bottom">
            <span>© 2025 DigiHealth. All rights reserved.</span>
            <span className="footer-version">v1.0.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
