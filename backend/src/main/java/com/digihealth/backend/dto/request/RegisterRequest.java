package com.digihealth.backend.dto.request;

import lombok.*;
import javax.validation.constraints.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequest {
    
    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 100)
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 100)
    private String lastName;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 120)
    private String password;
    
    @Pattern(regexp = "^[0-9]{10,15}$", message = "Phone number must be 10-15 digits")
    private String phoneNumber;
    
    @NotBlank(message = "Role is required")
    @Pattern(regexp = "^(PATIENT|DOCTOR)$", message = "Role must be PATIENT or DOCTOR")
    private String role;
    
    // Patient-specific fields
    private Integer age;
    private LocalDate birthDate;
    
    @Pattern(regexp = "^(MALE|FEMALE|OTHER)$", message = "Gender must be MALE, FEMALE, or OTHER")
    private String gender;
    
    private String allergies;
    private String medicalConditions;
    private String emergencyContactName;
    private String emergencyContactPhone;
    private String bloodType;
    
    // Address fields
    private String street;
    private String city;
    private String state;
    private String postalCode;
    private String country;
    
    // Doctor-specific fields
    private String licenseNumber;
    private String specialization;
    private String consultationFee;
    private String bio;
    private Integer experienceYears;
    private String hospitalAffiliation;
    private String availableStartTime;
    private String availableEndTime;
}
