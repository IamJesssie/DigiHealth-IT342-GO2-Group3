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
  const ensureDoctorPrefix = (name) => {
    const trimmed = (name || "").trim();
    if (!trimmed) return "";
    return trimmed.toLowerCase().startsWith("dr.")
      ? trimmed.replace(/^dr\./i, "Dr.")
      : `Dr. ${trimmed}`;
  };
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
        placeholder="Dr. Juan Dela Cruz"
        value={formData.fullName || ""}
        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
        onBlur={(e) =>
          setFormData({
            ...formData,
            fullName: ensureDoctorPrefix(e.target.value),
          })
        }
      />

      <label>Email Address *</label>
      <input
        type="email"
        placeholder="doctor.ph@example.com"
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
  const normalizePHDigits = (value) => {
    const digits = (value || "").replace(/\D/g, "");
    if (!digits) return "";
    if (digits.startsWith("09")) {
      return digits.slice(1);
    }
    if (digits.startsWith("63")) {
      return digits.slice(2);
    }
    return digits;
  };

  const formatPHPhone = (value) => {
    let d = normalizePHDigits(value);
    if (!d.startsWith("9")) d = "9" + d.replace(/^[^9]*/, "");
    d = d.slice(0, 10);
    const part1 = d.slice(0, 3);
    const part2 = d.slice(3, 6);
    const part3 = d.slice(6, 10);
    return `+63${part1 ? " " + part1 : ""}${part2 ? " " + part2 : ""}${
      part3 ? " " + part3 : ""
    }`.trim();
  };
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
        <option value="General Physician">General Physician</option>
        <option value="Cardiologist">Cardiologist</option>
        <option value="Dermatologist">Dermatologist</option>
        <option value="Orthopedic">Orthopedic</option>
        <option value="Pediatrician">Pediatrician</option>
        <option value="Neurologist">Neurologist</option>
      </select>

      <label>Medical License Number *</label>
      <input
        type="text"
        placeholder="PRC-1234567"
        value={formData.licenseNumber || ""}
        onChange={(e) =>
          setFormData({ ...formData, licenseNumber: e.target.value })
        }
      />

      <label>Phone Number *</label>
      <input
        type="text"
        placeholder="+63 912 345 6789"
        value={formData.phoneNumber || ""}
        onChange={(e) =>
          setFormData({
            ...formData,
            phoneNumber: formatPHPhone(e.target.value),
          })
        }
      />

      <label>Years of Experience *</label>
      <input
        type="number"
        min="0"
        placeholder="e.g., 5"
        value={formData.experienceYears ?? ""}
        onChange={(e) =>
          setFormData({ ...formData, experienceYears: e.target.value ? parseInt(e.target.value, 10) : undefined })
        }
      />

      <label>Hospital/Clinic Affiliation *</label>
      <input
        type="text"
        placeholder="e.g., St. Luke's Medical Center"
        value={formData.hospitalAffiliation || ""}
        onChange={(e) =>
          setFormData({ ...formData, hospitalAffiliation: e.target.value })
        }
      />

      <label>Professional Bio (optional)</label>
      <textarea
        placeholder="Brief summary of your qualifications, specialties, and care philosophy"
        value={formData.bio || ""}
        onChange={(e) =>
          setFormData({ ...formData, bio: e.target.value })
        }
        rows={4}
        style={{ resize: 'vertical' }}
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
    const workDays = formData.workDays || [];
    const workHours = formData.workHours || {};

    if (workDays.includes(day)) {
      // Remove day from workDays
      const updatedDays = workDays.filter((d) => d !== day);
      // Remove day from workHours
      const { [day]: _, ...updatedHours } = workHours;
      setFormData({
        ...formData,
        workDays: updatedDays,
        workHours: updatedHours,
      });
    } else {
      // Add day to workDays
      setFormData({
        ...formData,
        workDays: [...workDays, day],
        workHours: {
          ...workHours,
          [day]: { startTime: "09:00", endTime: "17:00" },
        },
      });
    }
  };

  const handleTimeChange = (day, field, value) => {
    setFormData({
      ...formData,
      workHours: {
        ...formData.workHours,
        [day]: {
          ...formData.workHours?.[day],
          [field]: value,
        },
      },
    });
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
                <input
                  type="time"
                  value={formData.workHours?.[day]?.startTime || "09:00"}
                  onChange={(e) =>
                    handleTimeChange(day, "startTime", e.target.value)
                  }
                />
                <span>to</span>
                <input
                  type="time"
                  value={formData.workHours?.[day]?.endTime || "17:00"}
                  onChange={(e) =>
                    handleTimeChange(day, "endTime", e.target.value)
                  }
                />
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
