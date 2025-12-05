package com.digihealth.backend.security;

import com.digihealth.backend.controller.AdminController;
import com.digihealth.backend.repository.AdminSettingsRepository;
import com.digihealth.backend.repository.AppointmentRepository;
import com.digihealth.backend.repository.AuditLogRepository;
import com.digihealth.backend.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@org.springframework.boot.test.context.SpringBootTest
@org.springframework.context.annotation.Import(com.digihealth.backend.config.SecurityConfig.class)
@org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc(addFilters = true)
class AdminControllerSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private AppointmentRepository appointmentRepository;

    @MockBean
    private AdminSettingsRepository adminSettingsRepository;

    @MockBean
    private AuditLogRepository auditLogRepository;

    @org.springframework.boot.test.mock.mockito.SpyBean
    private com.digihealth.backend.security.JwtAuthenticationFilter jwtAuthenticationFilter;

    @org.springframework.boot.test.mock.mockito.SpyBean
    private com.digihealth.backend.security.JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @org.springframework.boot.test.mock.mockito.SpyBean
    private com.digihealth.backend.security.JwtAccessDeniedHandler jwtAccessDeniedHandler;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @Test
    @WithMockUser(username = "admin@digihealth.com", roles = {"ADMIN"})
    @DisplayName("Admin endpoints allow ADMIN role")
    void adminEndpoints_allowAdmin() throws Exception {
        Mockito.when(userRepository.findAll()).thenReturn(List.of());
        mockMvc.perform(get("/api/admin/doctors"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "doctor@digihealth.com", roles = {"DOCTOR"})
    @DisplayName("Admin endpoints deny non-ADMIN roles")
    void adminEndpoints_denyNonAdmin() throws Exception {
        Mockito.when(userRepository.findAll()).thenReturn(List.of());
        mockMvc.perform(get("/api/admin/doctors"))
                .andExpect(status().isForbidden());
    }
}
