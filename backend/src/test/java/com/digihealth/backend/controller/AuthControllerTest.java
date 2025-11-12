package com.digihealth.backend.controller;

import com.digihealth.backend.dto.LoginRequest;
import com.digihealth.backend.dto.LoginResponse;
import com.digihealth.backend.dto.RegisterDto;
import com.digihealth.backend.service.AuthService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.notNullValue;
import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @Test
    @DisplayName("POST /api/auth/login returns 200 and token field when AuthService succeeds")
    void loginReturnsToken() throws Exception {
        Mockito.when(authService.login(any(LoginRequest.class)))
                .thenReturn("dummy-jwt-token");

        String body = "{ \"email\": \"doctor@example.com\", \"password\": \"password123\" }";

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", notNullValue()));
    }

    @Test
    @DisplayName("POST /api/auth/register returns 200 on success")
    void registerReturnsOk() throws Exception {
        Mockito.doNothing().when(authService).registerDoctor(any(RegisterDto.class));

        String body = "{ \"fullName\": \"Dr. Test\", \"email\": \"doctor@example.com\", \"password\": \"password123\", \"specialization\": \"Cardiology\", \"licenseNumber\": \"LIC123\", \"phoneNumber\": \"123456789\" }";

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk());
    }
}