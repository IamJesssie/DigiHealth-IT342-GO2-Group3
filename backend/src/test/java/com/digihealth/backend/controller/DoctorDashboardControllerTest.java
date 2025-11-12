package com.digihealth.backend.controller;

import com.digihealth.backend.dto.DashboardSummaryDto;
import com.digihealth.backend.dto.DoctorAppointmentDto;
import com.digihealth.backend.dto.DoctorPatientDto;
import com.digihealth.backend.dto.TodayAppointmentDto;
import com.digihealth.backend.service.DashboardService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.notNullValue;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(DoctorDashboardController.class)
class DoctorDashboardControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DashboardService dashboardService;

    @Test
    @WithMockUser(username = "doctor@example.com", roles = {"DOCTOR"})
    @DisplayName("GET /api/dashboard/summary returns dashboard summary for authenticated doctor")
    void getDashboardSummary_authenticated() throws Exception {
        DashboardSummaryDto dto = new DashboardSummaryDto();
        dto.setTotalPatients(5L);
        dto.setTodayConfirmed(2L);
        dto.setTodayPending(1L);
        dto.setTodayCompleted(2L);

        when(dashboardService.getDashboardSummaryForCurrentDoctor()).thenReturn(dto);

        mockMvc.perform(get("/api/dashboard/summary")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalPatients").value(5))
                .andExpect(jsonPath("$.todayConfirmed").value(2))
                .andExpect(jsonPath("$.todayPending").value(1))
                .andExpect(jsonPath("$.todayCompleted").value(2));
    }

    @Test
    @WithMockUser(username = "doctor@example.com", roles = {"DOCTOR"})
    @DisplayName("GET /api/appointments/today returns list of today appointments for authenticated doctor")
    void getTodayAppointments_authenticated() throws Exception {
        TodayAppointmentDto app = new TodayAppointmentDto();
        app.setId("1");
        app.setTime("09:00");
        app.setPatientName("John Doe");
        app.setType("Consultation");
        app.setStatus("CONFIRMED");

        when(dashboardService.getTodayAppointmentsForCurrentDoctor())
                .thenReturn(Collections.singletonList(app));

        mockMvc.perform(get("/api/appointments/today")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id").value("1"))
                .andExpect(jsonPath("$[0].time").value("09:00"))
                .andExpect(jsonPath("$[0].patientName").value("John Doe"))
                .andExpect(jsonPath("$[0].type").value("Consultation"))
                .andExpect(jsonPath("$[0].status").value("CONFIRMED"));
    }

    @Test
    @WithMockUser(username = "doctor@example.com", roles = {"DOCTOR"})
    @DisplayName("GET /api/doctors/me/patients returns patients scoped to current doctor")
    void getMyPatients_authenticated() throws Exception {
        DoctorPatientDto dto = new DoctorPatientDto();
        dto.setId("p1");
        dto.setName("John Doe");
        dto.setPhone("123456789");
        dto.setEmail("john@example.com");
        dto.setLastVisit("2025-01-01");

        when(dashboardService.getPatientsForCurrentDoctor())
                .thenReturn(List.of(dto));

        mockMvc.perform(get("/api/doctors/me/patients")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id").value("p1"))
                .andExpect(jsonPath("$[0].name").value("John Doe"))
                .andExpect(jsonPath("$[0].phone").value("123456789"))
                .andExpect(jsonPath("$[0].email").value("john@example.com"))
                .andExpect(jsonPath("$[0].lastVisit").value("2025-01-01"));
    }

    @Test
    @WithMockUser(username = "doctor@example.com", roles = {"DOCTOR"})
    @DisplayName("GET /api/doctors/me/appointments returns appointments scoped to current doctor")
    void getMyAppointments_authenticated() throws Exception {
        DoctorAppointmentDto dto = new DoctorAppointmentDto();
        dto.setId("a1");
        dto.setStartDateTime("2025-01-01 10:00");
        dto.setPatientName("John Doe");
        dto.setDoctorName("Dr. Smith");
        dto.setType("Consultation");
        dto.setStatus("CONFIRMED");

        when(dashboardService.getAppointmentsForCurrentDoctor())
                .thenReturn(List.of(dto));

        mockMvc.perform(get("/api/doctors/me/appointments")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id").value("a1"))
                .andExpect(jsonPath("$[0].startDateTime").value("2025-01-01 10:00"))
                .andExpect(jsonPath("$[0].patientName").value("John Doe"))
                .andExpect(jsonPath("$[0].doctorName").value("Dr. Smith"))
                .andExpect(jsonPath("$[0].type").value("Consultation"))
                .andExpect(jsonPath("$[0].status").value("CONFIRMED"));
    }

    @Test
    @DisplayName("GET /api/dashboard/summary rejects unauthenticated access")
    void getDashboardSummary_unauthenticated() throws Exception {
        mockMvc.perform(get("/api/dashboard/summary")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().is4xxClientError());
    }
}