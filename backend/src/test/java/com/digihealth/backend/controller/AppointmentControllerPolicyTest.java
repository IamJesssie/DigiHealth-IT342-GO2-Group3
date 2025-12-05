package com.digihealth.backend.controller;

import com.digihealth.backend.entity.*;
import com.digihealth.backend.repository.*;
import com.digihealth.backend.service.AppointmentNotificationService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = true)
class AppointmentControllerPolicyTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private DoctorRepository doctorRepository;

    @MockBean
    private PatientRepository patientRepository;

    @MockBean
    private AppointmentRepository appointmentRepository;

    @MockBean
    private DoctorWorkDayRepository doctorWorkDayRepository;

    @MockBean
    private AdminSettingsRepository adminSettingsRepository;

    @MockBean
    private AppointmentNotificationService appointmentNotificationService;

    @SpyBean
    private com.digihealth.backend.security.JwtAuthenticationFilter jwtAuthenticationFilter;

    @SpyBean
    private com.digihealth.backend.security.JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @SpyBean
    private com.digihealth.backend.security.JwtAccessDeniedHandler jwtAccessDeniedHandler;

    private User buildPatientUser(UUID id, String email) {
        User u = new User();
        u.setId(id);
        u.setEmail(email);
        u.setRole(Role.PATIENT);
        u.setIsApproved(true);
        return u;
    }

    private User buildDoctorUser(UUID id, String email) {
        User u = new User();
        u.setId(id);
        u.setEmail(email);
        u.setRole(Role.DOCTOR);
        u.setIsApproved(true);
        return u;
    }

    private Doctor buildDoctor(User doctorUser) {
        Doctor d = new Doctor();
        d.setUser(doctorUser);
        return d;
    }

    private Patient buildPatient(User patientUser) {
        Patient p = new Patient();
        p.setUser(patientUser);
        return p;
    }

    private DoctorWorkDay buildWorkDay(Doctor d, DayOfWeek day, String start, String end) {
        DoctorWorkDay w = new DoctorWorkDay();
        w.setDoctor(d);
        w.setWorkDay(day);
        w.setAvailableStartTime(start);
        w.setAvailableEndTime(end);
        return w;
    }

    private void stubCommon(UUID doctorId, String patientEmail, User patientUser, User doctorUser, Doctor doctor, Patient patient, AdminSettings settings, DayOfWeek day) {
        Mockito.when(userRepository.findByEmail(patientEmail)).thenReturn(Optional.of(patientUser));
        Mockito.when(userRepository.findById(doctorId)).thenReturn(Optional.of(doctorUser));
        Mockito.when(doctorRepository.findByUserId(doctorId)).thenReturn(Optional.of(doctor));
        Mockito.when(patientRepository.findByUserId(patientUser.getId())).thenReturn(Optional.of(patient));
        Mockito.when(adminSettingsRepository.findById(1L)).thenReturn(Optional.of(settings));
        Mockito.when(doctorWorkDayRepository.findByDoctorAndWorkDay(ArgumentMatchers.eq(doctor), ArgumentMatchers.eq(day)))
                .thenReturn(List.of(buildWorkDay(doctor, day, "09:00", "17:00")));
        Mockito.when(appointmentRepository.save(ArgumentMatchers.any(Appointment.class))).thenAnswer(inv -> {
            Appointment a = inv.getArgument(0);
            return a;
        });
    }

    @Test
    @DisplayName("Reject same-day booking when disabled")
    @WithMockUser(username = "patient@digihealth.com", roles = {"PATIENT"})
    void book_rejectSameDay_whenNotAllowed() throws Exception {
        UUID doctorId = UUID.randomUUID();
        User patientUser = buildPatientUser(UUID.randomUUID(), "patient@digihealth.com");
        User doctorUser = buildDoctorUser(doctorId, "doctor@digihealth.com");
        Doctor doctor = buildDoctor(doctorUser);
        Patient patient = buildPatient(patientUser);
        AdminSettings settings = new AdminSettings();
        settings.setId(1L);
        settings.setAllowSameDayBooking(false);
        settings.setMinAdvanceHours(24);
        settings.setMaxAdvanceDays(90);
        settings.setAppointmentSlotMinutes(30);
        settings.setAutoConfirmAppointments(false);
        LocalDate date = LocalDate.now();
        DayOfWeek day = DayOfWeek.valueOf(date.getDayOfWeek().name().substring(0,3));
        stubCommon(doctorId, "patient@digihealth.com", patientUser, doctorUser, doctor, patient, settings, day);

        String payload = "{\n" +
                "  \"doctorId\": \"" + doctorId + "\",\n" +
                "  \"appointmentDate\": \"" + date + "\",\n" +
                "  \"appointmentTime\": \"10:00\",\n" +
                "  \"reason\": \"Checkup\",\n" +
                "  \"symptoms\": \"None\"\n" +
                "}";

        mockMvc.perform(post("/api/appointments/book")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("Same-day booking is not allowed")));
    }

    @Test
    @DisplayName("Reject booking within minimum advance hours")
    @WithMockUser(username = "patient@digihealth.com", roles = {"PATIENT"})
    void book_rejectWithinMinAdvanceHours() throws Exception {
        UUID doctorId = UUID.randomUUID();
        User patientUser = buildPatientUser(UUID.randomUUID(), "patient@digihealth.com");
        User doctorUser = buildDoctorUser(doctorId, "doctor@digihealth.com");
        Doctor doctor = buildDoctor(doctorUser);
        Patient patient = buildPatient(patientUser);
        AdminSettings settings = new AdminSettings();
        settings.setId(1L);
        settings.setAllowSameDayBooking(true);
        settings.setMinAdvanceHours(24);
        settings.setMaxAdvanceDays(90);
        settings.setAppointmentSlotMinutes(30);
        settings.setAutoConfirmAppointments(false);
        LocalDate date = LocalDate.now().plusDays(0);
        DayOfWeek day = DayOfWeek.valueOf(date.getDayOfWeek().name().substring(0,3));
        stubCommon(doctorId, "patient@digihealth.com", patientUser, doctorUser, doctor, patient, settings, day);

        String payload = "{\n" +
                "  \"doctorId\": \"" + doctorId + "\",\n" +
                "  \"appointmentDate\": \"" + date + "\",\n" +
                "  \"appointmentTime\": \"" + LocalTime.now().plusHours(2).withSecond(0).withNano(0).toString().substring(0,5) + "\",\n" +
                "  \"reason\": \"Checkup\",\n" +
                "  \"symptoms\": \"None\"\n" +
                "}";

        mockMvc.perform(post("/api/appointments/book")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("hours in advance")));
    }

    @Test
    @DisplayName("Reject booking beyond maximum advance days")
    @WithMockUser(username = "patient@digihealth.com", roles = {"PATIENT"})
    void book_rejectBeyondMaxAdvanceDays() throws Exception {
        UUID doctorId = UUID.randomUUID();
        User patientUser = buildPatientUser(UUID.randomUUID(), "patient@digihealth.com");
        User doctorUser = buildDoctorUser(doctorId, "doctor@digihealth.com");
        Doctor doctor = buildDoctor(doctorUser);
        Patient patient = buildPatient(patientUser);
        AdminSettings settings = new AdminSettings();
        settings.setId(1L);
        settings.setAllowSameDayBooking(true);
        settings.setMinAdvanceHours(24);
        settings.setMaxAdvanceDays(1);
        settings.setAppointmentSlotMinutes(30);
        settings.setAutoConfirmAppointments(false);
        LocalDate date = LocalDate.now().plusDays(10);
        DayOfWeek day = DayOfWeek.valueOf(date.getDayOfWeek().name().substring(0,3));
        stubCommon(doctorId, "patient@digihealth.com", patientUser, doctorUser, doctor, patient, settings, day);

        String payload = "{\n" +
                "  \"doctorId\": \"" + doctorId + "\",\n" +
                "  \"appointmentDate\": \"" + date + "\",\n" +
                "  \"appointmentTime\": \"10:00\",\n" +
                "  \"reason\": \"Checkup\",\n" +
                "  \"symptoms\": \"None\"\n" +
                "}";

        mockMvc.perform(post("/api/appointments/book")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("days in advance")));
    }

    @Test
    @DisplayName("Reject booking outside working hours")
    @WithMockUser(username = "patient@digihealth.com", roles = {"PATIENT"})
    void book_rejectOutsideWorkingHours() throws Exception {
        UUID doctorId = UUID.randomUUID();
        User patientUser = buildPatientUser(UUID.randomUUID(), "patient@digihealth.com");
        User doctorUser = buildDoctorUser(doctorId, "doctor@digihealth.com");
        Doctor doctor = buildDoctor(doctorUser);
        Patient patient = buildPatient(patientUser);
        AdminSettings settings = new AdminSettings();
        settings.setId(1L);
        settings.setAllowSameDayBooking(true);
        settings.setMinAdvanceHours(0);
        settings.setMaxAdvanceDays(90);
        settings.setAppointmentSlotMinutes(30);
        settings.setAutoConfirmAppointments(false);
        LocalDate date = LocalDate.now().plusDays(1);
        DayOfWeek day = DayOfWeek.valueOf(date.getDayOfWeek().name().substring(0,3));
        Mockito.when(userRepository.findByEmail("patient@digihealth.com")).thenReturn(Optional.of(patientUser));
        Mockito.when(userRepository.findById(doctorId)).thenReturn(Optional.of(doctorUser));
        Mockito.when(doctorRepository.findByUserId(doctorId)).thenReturn(Optional.of(doctor));
        Mockito.when(patientRepository.findByUserId(patientUser.getId())).thenReturn(Optional.of(patient));
        Mockito.when(adminSettingsRepository.findById(1L)).thenReturn(Optional.of(settings));
        Mockito.when(doctorWorkDayRepository.findByDoctorAndWorkDay(ArgumentMatchers.eq(doctor), ArgumentMatchers.eq(day)))
                .thenReturn(List.of(buildWorkDay(doctor, day, "10:00", "11:00")));

        String payload = "{\n" +
                "  \"doctorId\": \"" + doctorId + "\",\n" +
                "  \"appointmentDate\": \"" + date + "\",\n" +
                "  \"appointmentTime\": \"08:00\",\n" +
                "  \"reason\": \"Checkup\",\n" +
                "  \"symptoms\": \"None\"\n" +
                "}";

        mockMvc.perform(post("/api/appointments/book")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("outside doctor's working hours")));
    }

    @Test
    @DisplayName("Reject booking not aligned to slot minutes")
    @WithMockUser(username = "patient@digihealth.com", roles = {"PATIENT"})
    void book_rejectNotAlignedToSlots() throws Exception {
        UUID doctorId = UUID.randomUUID();
        User patientUser = buildPatientUser(UUID.randomUUID(), "patient@digihealth.com");
        User doctorUser = buildDoctorUser(doctorId, "doctor@digihealth.com");
        Doctor doctor = buildDoctor(doctorUser);
        Patient patient = buildPatient(patientUser);
        AdminSettings settings = new AdminSettings();
        settings.setId(1L);
        settings.setAllowSameDayBooking(true);
        settings.setMinAdvanceHours(0);
        settings.setMaxAdvanceDays(90);
        settings.setAppointmentSlotMinutes(15);
        settings.setAutoConfirmAppointments(false);
        LocalDate date = LocalDate.now().plusDays(1);
        DayOfWeek day = DayOfWeek.valueOf(date.getDayOfWeek().name().substring(0,3));
        stubCommon(doctorId, "patient@digihealth.com", patientUser, doctorUser, doctor, patient, settings, day);

        String payload = "{\n" +
                "  \"doctorId\": \"" + doctorId + "\",\n" +
                "  \"appointmentDate\": \"" + date + "\",\n" +
                "  \"appointmentTime\": \"10:10\",\n" +
                "  \"reason\": \"Checkup\",\n" +
                "  \"symptoms\": \"None\"\n" +
                "}";

        mockMvc.perform(post("/api/appointments/book")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("not aligned")));
    }

    @Test
    @DisplayName("Reject already booked time slot")
    @WithMockUser(username = "patient@digihealth.com", roles = {"PATIENT"})
    void book_rejectAlreadyBooked() throws Exception {
        UUID doctorId = UUID.randomUUID();
        User patientUser = buildPatientUser(UUID.randomUUID(), "patient@digihealth.com");
        User doctorUser = buildDoctorUser(doctorId, "doctor@digihealth.com");
        Doctor doctor = buildDoctor(doctorUser);
        Patient patient = buildPatient(patientUser);
        AdminSettings settings = new AdminSettings();
        settings.setId(1L);
        settings.setAllowSameDayBooking(true);
        settings.setMinAdvanceHours(0);
        settings.setMaxAdvanceDays(90);
        settings.setAppointmentSlotMinutes(30);
        settings.setAutoConfirmAppointments(false);
        LocalDate date = LocalDate.now().plusDays(1);
        DayOfWeek day = DayOfWeek.valueOf(date.getDayOfWeek().name().substring(0,3));
        stubCommon(doctorId, "patient@digihealth.com", patientUser, doctorUser, doctor, patient, settings, day);
        Appointment existing = new Appointment();
        existing.setDoctor(doctor);
        existing.setAppointmentDate(date);
        existing.setAppointmentTime(LocalTime.of(10,0));
        Mockito.when(appointmentRepository.findByDoctorAndAppointmentDate(ArgumentMatchers.eq(doctor), ArgumentMatchers.eq(date)))
                .thenReturn(List.of(existing));

        String payload = "{\n" +
                "  \"doctorId\": \"" + doctorId + "\",\n" +
                "  \"appointmentDate\": \"" + date + "\",\n" +
                "  \"appointmentTime\": \"10:00\",\n" +
                "  \"reason\": \"Checkup\",\n" +
                "  \"symptoms\": \"None\"\n" +
                "}";

        mockMvc.perform(post("/api/appointments/book")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("Time slot already booked")));
    }

    @Test
    @DisplayName("Create appointment with CONFIRMED when autoConfirm enabled")
    @WithMockUser(username = "patient@digihealth.com", roles = {"PATIENT"})
    void book_createConfirmed_whenAutoConfirmEnabled() throws Exception {
        UUID doctorId = UUID.randomUUID();
        User patientUser = buildPatientUser(UUID.randomUUID(), "patient@digihealth.com");
        User doctorUser = buildDoctorUser(doctorId, "doctor@digihealth.com");
        Doctor doctor = buildDoctor(doctorUser);
        Patient patient = buildPatient(patientUser);
        AdminSettings settings = new AdminSettings();
        settings.setId(1L);
        settings.setAllowSameDayBooking(true);
        settings.setMinAdvanceHours(0);
        settings.setMaxAdvanceDays(90);
        settings.setAppointmentSlotMinutes(30);
        settings.setAutoConfirmAppointments(true);
        LocalDate date = LocalDate.now().plusDays(1);
        DayOfWeek day = DayOfWeek.valueOf(date.getDayOfWeek().name().substring(0,3));
        stubCommon(doctorId, "patient@digihealth.com", patientUser, doctorUser, doctor, patient, settings, day);
        Mockito.when(appointmentRepository.findByDoctorAndAppointmentDate(ArgumentMatchers.eq(doctor), ArgumentMatchers.eq(date)))
                .thenReturn(List.of());

        String payload = "{\n" +
                "  \"doctorId\": \"" + doctorId + "\",\n" +
                "  \"appointmentDate\": \"" + date + "\",\n" +
                "  \"appointmentTime\": \"10:00\",\n" +
                "  \"reason\": \"Checkup\",\n" +
                "  \"symptoms\": \"None\"\n" +
                "}";

        mockMvc.perform(post("/api/appointments/book")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isOk())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("CONFIRMED")));
    }

    @Test
    @DisplayName("Create appointment with SCHEDULED when autoConfirm disabled")
    @WithMockUser(username = "patient@digihealth.com", roles = {"PATIENT"})
    void book_createScheduled_whenAutoConfirmDisabled() throws Exception {
        UUID doctorId = UUID.randomUUID();
        User patientUser = buildPatientUser(UUID.randomUUID(), "patient@digihealth.com");
        User doctorUser = buildDoctorUser(doctorId, "doctor@digihealth.com");
        Doctor doctor = buildDoctor(doctorUser);
        Patient patient = buildPatient(patientUser);
        AdminSettings settings = new AdminSettings();
        settings.setId(1L);
        settings.setAllowSameDayBooking(true);
        settings.setMinAdvanceHours(0);
        settings.setMaxAdvanceDays(90);
        settings.setAppointmentSlotMinutes(30);
        settings.setAutoConfirmAppointments(false);
        LocalDate date = LocalDate.now().plusDays(1);
        DayOfWeek day = DayOfWeek.valueOf(date.getDayOfWeek().name().substring(0,3));
        stubCommon(doctorId, "patient@digihealth.com", patientUser, doctorUser, doctor, patient, settings, day);
        Mockito.when(appointmentRepository.findByDoctorAndAppointmentDate(ArgumentMatchers.eq(doctor), ArgumentMatchers.eq(date)))
                .thenReturn(List.of());

        String payload = "{\n" +
                "  \"doctorId\": \"" + doctorId + "\",\n" +
                "  \"appointmentDate\": \"" + date + "\",\n" +
                "  \"appointmentTime\": \"10:00\",\n" +
                "  \"reason\": \"Checkup\",\n" +
                "  \"symptoms\": \"None\"\n" +
                "}";

        mockMvc.perform(post("/api/appointments/book")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isOk())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("SCHEDULED")));
    }

    @Test
    @DisplayName("Admin system-status returns metrics for ADMIN role")
    @WithMockUser(username = "admin@digihealth.com", roles = {"ADMIN"})
    void admin_systemStatus_returnsMetrics() throws Exception {
        AdminSettings settings = new AdminSettings();
        settings.setId(1L);
        Mockito.when(adminSettingsRepository.findById(1L)).thenReturn(Optional.of(settings));
        Mockito.when(userRepository.findAll()).thenReturn(java.util.List.of());
        Mockito.when(appointmentRepository.findAll()).thenReturn(java.util.List.of());

        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get("/api/admin/system-status"))
                .andExpect(status().isOk())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("uptimeSeconds")))
                .andExpect(content().string(org.hamcrest.Matchers.containsString("serverTime")));
    }
}
