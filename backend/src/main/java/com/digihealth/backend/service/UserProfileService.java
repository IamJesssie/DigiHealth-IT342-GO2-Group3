package com.digihealth.backend.service;

import com.digihealth.backend.dto.UserProfileResponse;
import com.digihealth.backend.dto.UserProfileUpdateRequest;
import com.digihealth.backend.entity.*;
import com.digihealth.backend.repository.PatientRepository;
import com.digihealth.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class UserProfileService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Transactional(readOnly = true)
    public UserProfileResponse getUserProfile(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserProfileResponse response = new UserProfileResponse();
        response.setUserId(user.getUserId());
        response.setEmail(user.getEmail());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setPhoneNumber(user.getPhoneNumber());
        response.setProfileImageUrl(user.getProfileImageUrl());
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

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setProfileImageUrl(request.getProfileImageUrl());

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
}
