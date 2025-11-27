import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/auth";
import {
  RegistrationStep1,
  RegistrationStep2,
  RegistrationStep3,
} from "./RegisterLayout";
import SuccessModal from "./SuccessModal";
import AuthLayout from "./AuthLayout"; // Import the new base
import "./AuthLayout.css";

import { registerDoctor } from "../api/client";

const DoctorRegistration = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const isRegistrationComplete = () => {
    return (
      formData.fullName &&
      formData.email &&
      formData.password &&
      formData.specialization &&
      formData.licenseNumber &&
      formData.phoneNumber &&
      formData.workDays &&
      formData.workDays.length > 0
    );
  };

  const handleRegistrationSubmit = async () => {
    if (!isRegistrationComplete()) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }
    setErrorMsg("");
    setIsSubmitting(true);
    try {
      await registerDoctor(formData);
      setShowModal(true);
    } catch (error) {
      const response = error.response;
      const status = response?.status;
      const backendMessage =
        response?.data?.message ||
        response?.data?.error ||
        (typeof response?.data === "string" ? response.data : null);

      if (
        status === 400 &&
        backendMessage &&
        backendMessage.toLowerCase().includes("email already exists")
      ) {
        try {
          await login(formData.email, formData.password);
          navigate("/dashboard");
          return;
        } catch (loginError) {
          setErrorMsg(
            "Account already exists. Please confirm your credentials or log in manually."
          );
          return;
        }
      }

      if (status === 400) {
        setErrorMsg(
          backendMessage ||
            "Invalid registration details. Please review and try again."
        );
        return;
      }

      if (status === 401) {
        setErrorMsg(backendMessage || "Invalid email or password.");
        return;
      }

      setErrorMsg(
        backendMessage ||
          "Registration failed due to a server error. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <RegistrationStep1
            onNext={nextStep}
            onNavigateToLogin={() => navigate("/login")}
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 2:
        return (
          <RegistrationStep2
            onNext={nextStep}
            onBack={prevStep}
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 3:
        return (
          <RegistrationStep3
            onBack={prevStep}
            onSubmit={handleRegistrationSubmit}
            formData={formData}
            setFormData={setFormData}
            isComplete={isRegistrationComplete()}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return <div>Registration Complete!</div>;
    }
  };

  return (
    <AuthLayout>
      {errorMsg && <div className="error-message">{errorMsg}</div>}

      {/* Render the current registration step */}
      {renderStep()}

      {showModal && (
        <SuccessModal
          onClose={() => {
            setShowModal(false);
            navigate("/login", {
              state: {
                message:
                  "Registration successful! Your account is pending approval. Please wait for an administrator to approve your registration before attempting to login. This typically takes 24-48 hours.",
              },
            });
          }}
        />
      )}
    </AuthLayout>
  );
};

export default DoctorRegistration;
