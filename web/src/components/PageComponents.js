import React from "react";
import "./PageStyling.css";

export function PageWrapper({ children }) {
  return <div className="page-container">{children}</div>;
}

export function PageMessage({ title, message }) {
  return (
    <div className="page-message">
      <h2>{title}</h2>
      <p>{message}</p>
    </div>
  );
}

export function PageFolder({ children }) {
  return <div className="page-folder">{children}</div>;
}
