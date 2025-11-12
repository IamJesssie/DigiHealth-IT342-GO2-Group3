package com.digihealth.backend.service;

import com.digihealth.backend.dto.CurrentUserProfileDto;
import com.digihealth.backend.dto.CurrentUserProfileUpdateRequest;
import com.digihealth.backend.dto.UserProfileResponse;
import com.digihealth.backend.dto.UserProfileUpdateRequest;
import com.digihealth.backend.entity.*;
import com.digihealth.backend.repository.DoctorRepository;
import com.digihealth.backend.repository.PatientRepository;
import com.digihealth.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class UserProfileService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Transactional(readOnly = true)
    public UserProfileResponse getUserProfile(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserProfileResponse response = new UserProfileResponse();
        response.setUserId(user.getId());
        response.setEmail(user.getEmail());
        response.setFirstName(user.getFullName()); // or split if needed
        response.setLastName(null);
        response.setPhoneNumber(user.getPhoneNumber());
        response.setProfileImageUrl(null);
        response.setRole(user.getRole());

        if (user.getRole() == Role.PATIENT) {
            patientRepository.findByUser(user).ifPresent(patient -> {
                response.setAge(patient.getAge());
                response.setGender(patient.getGender().name());
                response.setAllergies(patient.getAllergies());
                response.setMedicalConditions(patient.getMedicalConditions());
                response.setEmergencyContactName(patient.getEmergencyContactName());
                response.setEmergencyContactPhone(patient.getEmergencyContactPhone());
                response.setBloodType(patient.getBloodType());
                response.setBirthDate(patient.getBirthDate());

                if (patient.getAddress() != null) {
                    Address address = patient.getAddress();
                    response.setStreet(address.getStreet());
                    response.setCity(address.getCity());
                    response.setState(address.getState());
                    response.setPostalCode(address.getPostalCode());
                    response.setCountry(address.getCountry());
                }
            });
        }

        return response;
    }

    @Transactional
    public UserProfileResponse updateUserProfile(UUID userId, UserProfileUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // For current model, map updated name into fullName
        if (request.getFirstName() != null || request.getLastName() != null) {
            String first = request.getFirstName() != null ? request.getFirstName() : "";
            String last = request.getLastName() != null ? request.getLastName() : "";
            String combined = (first + " " + last).trim();
            if (!combined.isEmpty()) {
                user.setFullName(combined);
            }
        }
        user.setPhoneNumber(request.getPhoneNumber());
        // No dedicated profileImageUrl field on User; ignore or extend entity if needed

        if (user.getRole() == Role.PATIENT) {
            Patient patient = patientRepository.findByUser(user)
                    .orElseGet(() -> {
                        Patient newPatient = new Patient();
                        newPatient.setUser(user);
                        return newPatient;
                    });

            patient.setAge(request.getAge());
            patient.setGender(Gender.valueOf(request.getGender()));
            patient.setAllergies(request.getAllergies());
            patient.setMedicalConditions(request.getMedicalConditions());
            patient.setEmergencyContactName(request.getEmergencyContactName());
            patient.setEmergencyContactPhone(request.getEmergencyContactPhone());
            patient.setBloodType(request.getBloodType());
            patient.setBirthDate(request.getBirthDate());

            Address address = patient.getAddress() == null ? new Address() : patient.getAddress();
            address.setStreet(request.getStreet());
            address.setCity(request.getCity());
            address.setState(request.getState());
            address.setPostalCode(request.getPostalCode());
            address.setCountry(request.getCountry());
            patient.setAddress(address);

            patientRepository.save(patient);
        }

        userRepository.save(user);

        return getUserProfile(userId);
    }

    @Transactional
    public void deleteUserProfile(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setIsActive(false);
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public CurrentUserProfileDto getCurrentUserProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        // Debug logging
        System.out.println("[UserProfileService] Authentication object: " + authentication);
        System.out.println("[UserProfileService] Is authenticated: " + (authentication != null && authentication.isAuthenticated()));
        if (authentication != null) {
            System.out.println("[UserProfileService] Principal type: " + authentication.getPrincipal().getClass().getName());
            System.out.println("[UserProfileService] Principal: " + authentication.getPrincipal());
            System.out.println("[UserProfileService] Name: " + authentication.getName());
        }
        
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("No authenticated user found");
        }
        
        String email = authentication.getName();
        System.out.println("[UserProfileService] Looking up user by email: " + email);
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        System.out.println("[UserProfileService] User found: " + user.getId() + " - " + user.getEmail());

        CurrentUserProfileDto dto = new CurrentUserProfileDto();
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhoneNumber());
        dto.setRole(user.getRole().name());

        if (user.getRole() == Role.DOCTOR) {
            doctorRepository.findByUser(user).ifPresent(doctor -> {
                dto.setDepartment(doctor.getHospitalAffiliation());
                dto.setSpecialization(doctor.getSpecialization());
                dto.setMedicalLicenseNumber(doctor.getLicenseNumber());
                dto.setYearsOfExperience(doctor.getExperienceYears());
                dto.setProfessionalBio(doctor.getBio());
            });
        }

        return dto;
    }

    @Transactional
    public CurrentUserProfileDto updateCurrentUserProfile(CurrentUserProfileUpdateRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFullName(request.getFullName());
        user.setPhoneNumber(request.getPhone());
        // email and role are read-only

        if (user.getRole() == Role.DOCTOR) {
            // For doctors, ensure we have a Doctor entity but never fail with 403/exception
            // if it doesn't exist yet. Create and populate it from the request when needed.
            Doctor doctor = doctorRepository.findByUser(user)
                    .orElseGet(() -> {
                        Doctor newDoctor = new Doctor();
                        newDoctor.setUser(user);
                        return newDoctor;
                    });

            // Update doctor-scoped fields only if provided; allow partial updates.
            if (request.getDepartment() != null) {
                doctor.setHospitalAffiliation(request.getDepartment());
            }
            if (request.getSpecialization() != null) {
                doctor.setSpecialization(request.getSpecialization());
            }
            if (request.getMedicalLicenseNumber() != null) {
                doctor.setLicenseNumber(request.getMedicalLicenseNumber());
            }
            if (request.getYearsOfExperience() != null) {
                doctor.setExperienceYears(request.getYearsOfExperience());
            }
            if (request.getProfessionalBio() != null) {
                doctor.setBio(request.getProfessionalBio());
            }

            doctorRepository.save(doctor);
        }

        userRepository.save(user);

        return getCurrentUserProfile();
    }
}
