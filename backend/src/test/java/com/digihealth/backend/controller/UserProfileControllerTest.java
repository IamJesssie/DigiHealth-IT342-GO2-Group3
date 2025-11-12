package com.digihealth.backend.controller;

import com.digihealth.backend.dto.CurrentUserProfileDto;
import com.digihealth.backend.dto.CurrentUserProfileUpdateRequest;
import com.digihealth.backend.service.UserProfileService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.notNullValue;
import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserProfileController.class)
class UserProfileControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserProfileService userProfileService;

    private CurrentUserProfileDto sampleProfile() {
        CurrentUserProfileDto dto = new CurrentUserProfileDto();
        dto.setFullName("Dr. Example");
        dto.setEmail("doctor@example.com");
        dto.setPhone("123456789");
        dto.setRole("DOCTOR");
        dto.setDepartment("Cardiology");
        dto.setSpecialization("Heart");
        dto.setMedicalLicenseNumber("LIC123");
        dto.setYearsOfExperience(10);
        dto.setProfessionalBio("Experienced cardiologist");
        return dto;
    }

    @Test
    @WithMockUser(username = "doctor@example.com", roles = {"DOCTOR"})
    @DisplayName("GET /api/users/me returns current user profile for authenticated user")
    void getCurrentUserProfile_authenticated() throws Exception {
        Mockito.when(userProfileService.getCurrentUserProfile())
                .thenReturn(sampleProfile());

        mockMvc.perform(get("/api/users/me")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fullName").value("Dr. Example"))
                .andExpect(jsonPath("$.email").value("doctor@example.com"))
                .andExpect(jsonPath("$.phone").value("123456789"))
                .andExpect(jsonPath("$.role").value("DOCTOR"))
                .andExpect(jsonPath("$.department", notNullValue()))
                .andExpect(jsonPath("$.specialization", notNullValue()))
                .andExpect(jsonPath("$.medicalLicenseNumber", notNullValue()))
                .andExpect(jsonPath("$.yearsOfExperience", notNullValue()))
                .andExpect(jsonPath("$.professionalBio", notNullValue()));
    }

    @Test
    @WithMockUser(username = "doctor@example.com", roles = {"DOCTOR"})
    @DisplayName("PUT /api/users/me updates current user profile and returns updated profile")
    void updateCurrentUserProfile_authenticated() throws Exception {
        CurrentUserProfileDto updated = sampleProfile();
        updated.setFullName("Dr. Updated");
        updated.setPhone("987654321");

        Mockito.when(userProfileService.updateCurrentUserProfile(any(CurrentUserProfileUpdateRequest.class)))
                .thenReturn(updated);

        String body = "{ " +
                "\"fullName\": \"Dr. Updated\", " +
                "\"phone\": \"987654321\", " +
                "\"department\": \"Cardiology\", " +
                "\"specialization\": \"Heart\", " +
                "\"medicalLicenseNumber\": \"LIC123\", " +
                "\"yearsOfExperience\": 10, " +
                "\"professionalBio\": \"Experienced cardiologist\" " +
                "}";

        mockMvc.perform(put("/api/users/me")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fullName").value("Dr. Updated"))
                .andExpect(jsonPath("$.phone").value("987654321"));
    }

    @Test
    @DisplayName("GET /api/users/me rejects unauthenticated access")
    void getCurrentUserProfile_unauthenticated() throws Exception {
        mockMvc.perform(get("/api/users/me")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().is4xxClientError());
    }
}