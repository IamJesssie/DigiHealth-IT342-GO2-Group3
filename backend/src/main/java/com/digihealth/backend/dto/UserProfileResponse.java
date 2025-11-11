package com.digihealth.backend.dto;

import com.digihealth.backend.entity.Role;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class UserProfileResponse {
    private UUID userId;
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String profileImageUrl;
    private Role role;

    // Patient specific fields
    private Integer age;
    private String gender;
    private String allergies;
    private String medicalConditions;
    private String emergencyContactName;
    private String emergencyContactPhone;
    private String bloodType;
    private LocalDate birthDate;

    // Address
    private String street;
    private String city;
    private String state;
    private String postalCode;
    private String country;
}
