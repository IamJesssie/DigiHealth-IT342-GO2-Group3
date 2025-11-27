import "./AuthLayout.css";

const StepLayout = ({
  title,
  subtitle,
  children,
  onBack,
  onNext,
  nextLabel,
}) => {
  return (
    <div className="form-card">
      <p className="form-title">{title}</p>
      <p className="form-subtitle">{subtitle}</p>

      <div className="form-inputs">{children}</div>

      <div className="button-container">
        {onBack && (
          <button type="button" className="back-btn" onClick={onBack}>
            Back
          </button>
        )}

        {onNext && (
          <button type="button" className="next-btn" onClick={onNext}>
            {nextLabel || "Next"}
          </button>
        )}
      </div>
    </div>
  );
};

export const RegistrationStep1 = ({
  onNext,
  onNavigateToLogin,
  formData,
  setFormData,
}) => {
  return (
    <StepLayout
      title="Basic Information"
      subtitle="Create your doctor account"
      onBack={onNavigateToLogin}
      onNext={onNext}
    >
      <label>Full Name *</label>
      <input
        type="text"
        placeholder="Dr. John Doe"
        value={formData.fullName || ""}
        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
      />

      <label>Email Address *</label>
      <input
        type="email"
        placeholder="doctor@example.com"
        value={formData.email || ""}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />

      <label>Password *</label>
      <input
        type="password"
        placeholder="Minimum 8 characters"
        value={formData.password || ""}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />

      <label>Confirm Password *</label>
      <input
        type="password"
        placeholder="Re-enter password"
        value={formData.confirmPassword || ""}
        onChange={(e) =>
          setFormData({ ...formData, confirmPassword: e.target.value })
        }
      />
    </StepLayout>
  );
};

export const RegistrationStep2 = ({
  onNext,
  onBack,
  formData,
  setFormData,
}) => {
  return (
    <StepLayout
      title="Professional Information"
      subtitle="Tell us about your practice"
      onBack={onBack}
      onNext={onNext}
    >
      <label>Specialization *</label>
      <select
        value={formData.specialization || ""}
        onChange={(e) =>
          setFormData({ ...formData, specialization: e.target.value })
        }
      >
        <option value="" disabled>
          Select your specialization
        </option>
        <option value="General Practitioner">General Practitioner</option>
        <option value="Cardiology">Cardiology</option>
        <option value="Dermatology">Dermatology</option>
        <option value="Pediatrics">Pediatrics</option>
        <option value="Neurology">Neurology</option>
      </select>

      <label>Medical License Number *</label>
      <input
        type="text"
        placeholder="MD-12345"
        value={formData.licenseNumber || ""}
        onChange={(e) =>
          setFormData({ ...formData, licenseNumber: e.target.value })
        }
      />

      <label>Phone Number *</label>
      <input
        type="text"
        placeholder="+63"
        value={formData.phoneNumber || ""}
        onChange={(e) =>
          setFormData({ ...formData, phoneNumber: e.target.value })
        }
      />
    </StepLayout>
  );
};

export const RegistrationStep3 = ({
  onBack,
  onSubmit,
  formData,
  setFormData,
  isComplete,
  isSubmitting,
}) => {
  const toggleDay = (day) => {
    const days = formData.workDays || [];
    if (days.includes(day)) {
      setFormData({ ...formData, workDays: days.filter((d) => d !== day) });
    } else {
      setFormData({ ...formData, workDays: [...days, day] });
    }
  };

  return (
    <StepLayout
      title="Set Your Availability"
      subtitle="Define your working hours"
      onBack={onBack}
      onNext={onSubmit}
      nextLabel={isSubmitting ? "Registering..." : "Complete Registration"}
    >
      <div className="availability-form">
        {[
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ].map((day) => (
          <div key={day} className="day-row">
            <div className="day-label">
              <input
                type="checkbox"
                checked={formData.workDays?.includes(day) || false}
                onChange={() => toggleDay(day)}
              />
              <label>{day}</label>
            </div>

            {formData.workDays?.includes(day) ? (
              <div className="time-inputs">
                <input type="time" />
                <span>to</span>
                <input type="time" />
              </div>
            ) : (
              <div className="unavailable-text">Unavailable</div>
            )}
          </div>
        ))}
      </div>
    </StepLayout>
  );
};

export default {
  RegistrationStep1,
  RegistrationStep2,
  RegistrationStep3,
};
