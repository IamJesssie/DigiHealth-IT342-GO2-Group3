package com.digihealth.backend.controller;

import com.digihealth.backend.dto.*;
import com.digihealth.backend.service.DashboardService;
import com.digihealth.backend.service.DoctorService;
import com.digihealth.backend.entity.Appointment;
import com.digihealth.backend.entity.AppointmentStatus;
import com.digihealth.backend.entity.Doctor;
import com.digihealth.backend.entity.Patient;
import com.digihealth.backend.entity.User;
import com.digihealth.backend.repository.AppointmentRepository;
import com.digihealth.backend.repository.DoctorRepository;
import com.digihealth.backend.repository.PatientRepository;
import com.digihealth.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.time.format.DateTimeFormatter;
import java.time.LocalDate;
import java.time.LocalTime;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/api")
@org.springframework.security.access.prepost.PreAuthorize("hasRole('DOCTOR')")
public class DoctorDashboardController {

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/dashboard/summary")
    public ResponseEntity<DashboardSummaryDto> getDashboardSummary() {
        DashboardSummaryDto summary = dashboardService.getDashboardSummaryForCurrentDoctor();
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/appointments/today")
    public ResponseEntity<List<TodayAppointmentDto>> getTodayAppointments() {
        List<TodayAppointmentDto> appointments = dashboardService.getTodayAppointmentsForCurrentDoctor();
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/doctors/me/patients")
    public ResponseEntity<List<DoctorPatientDto>> getMyPatients() {
        List<DoctorPatientDto> patients = dashboardService.getPatientsForCurrentDoctor();
        return ResponseEntity.ok(patients);
    }

    @GetMapping("/doctors/me/patients/search")
    public ResponseEntity<List<DoctorPatientDto>> searchMyPatients(@RequestParam("q") String query) {
        List<DoctorPatientDto> patients = dashboardService.getPatientsForCurrentDoctor();
        String q = query == null ? "" : query.trim().toLowerCase();
        List<DoctorPatientDto> filtered = patients.stream()
                .filter(p -> p.getName() != null && p.getName().toLowerCase().contains(q)
                        || p.getId() != null && p.getId().toLowerCase().contains(q)
                        || p.getPhone() != null && p.getPhone().toLowerCase().contains(q))
                .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(filtered);
    }

    @GetMapping("/doctors/me/patients/page")
    public ResponseEntity<java.util.Map<String, Object>> getMyPatientsPage(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "q", required = false) String query) {
        List<DoctorPatientDto> patients = dashboardService.getPatientsForCurrentDoctor();
        String q = query == null ? "" : query.trim().toLowerCase();
        List<DoctorPatientDto> filtered = patients.stream()
                .filter(p -> q.isEmpty() ||
                        (p.getName() != null && p.getName().toLowerCase().contains(q)) ||
                        (p.getId() != null && p.getId().toLowerCase().contains(q)) ||
                        (p.getPhone() != null && p.getPhone().toLowerCase().contains(q)))
                .collect(java.util.stream.Collectors.toList());

        int total = filtered.size();
        int from = Math.max(page, 0) * Math.max(size, 1);
        int to = Math.min(from + Math.max(size, 1), total);
        List<DoctorPatientDto> content = from >= total ? java.util.List.of() : filtered.subList(from, to);

        java.util.Map<String, Object> payload = new java.util.HashMap<>();
        payload.put("content", content);
        payload.put("page", Math.max(page, 0));
        payload.put("size", Math.max(size, 1));
        payload.put("totalElements", total);
        payload.put("totalPages", (int) Math.ceil((double) total / Math.max(size, 1)));
        return ResponseEntity.ok(payload);
    }

    @GetMapping("/doctors/me/appointments")
    public ResponseEntity<List<DoctorAppointmentDto>> getMyAppointments() {
        List<DoctorAppointmentDto> appointments = dashboardService.getAppointmentsForCurrentDoctor();
        return ResponseEntity.ok(appointments);
    }

    @PostMapping("/doctors/me/appointments")
    public ResponseEntity<DoctorAppointmentDto> createAppointment(@RequestBody DoctorAppointmentCreateRequest req) {
        Doctor doctor = getCurrentDoctor();
        Patient patient = patientRepository.findById(req.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        Appointment a = new Appointment();
        a.setDoctor(doctor);
        a.setPatient(patient);
        LocalDate d = req.getAppointmentDate();
        LocalTime t = req.getAppointmentTime();
        if (d == null || t == null) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "appointmentDate and appointmentTime are required");
        }
        a.setAppointmentDate(d);
        a.setAppointmentTime(t);
        a.setDurationMinutes(req.getDurationMinutes() != null ? req.getDurationMinutes() : 30);
        a.setNotes(req.getNotes());
        a.setSymptoms(req.getSymptoms());
        a.setFollowUpRequired(Boolean.TRUE.equals(req.getFollowUpRequired()));
        a.setFollowUpDate(req.getFollowUpDate());
        AppointmentStatus status = req.getStatus() != null ? AppointmentStatus.valueOf(req.getStatus()) : AppointmentStatus.SCHEDULED;
        a.setStatus(status);

        Appointment saved = appointmentRepository.save(a);
        return ResponseEntity.ok(toDoctorAppointmentDto(saved));
    }

    @PutMapping("/doctors/me/appointments/{appointmentId}")
    public ResponseEntity<DoctorAppointmentDto> updateAppointment(@PathVariable UUID appointmentId, @RequestBody DoctorAppointmentUpdateRequest req) {
        Doctor doctor = getCurrentDoctor();
        Appointment a = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        if (!a.getDoctor().getDoctorId().equals(doctor.getDoctorId())) {
            return ResponseEntity.status(403).build();
        }

        if (req.getAppointmentDate() != null) {
            a.setAppointmentDate(req.getAppointmentDate());
        }
        if (req.getAppointmentTime() != null) {
            a.setAppointmentTime(req.getAppointmentTime());
        }
        if (req.getDurationMinutes() != null) {
            a.setDurationMinutes(req.getDurationMinutes());
        }
        if (req.getStatus() != null) {
            a.setStatus(AppointmentStatus.valueOf(req.getStatus()));
        }
        if (req.getNotes() != null) {
            a.setNotes(req.getNotes());
        }
        if (req.getSymptoms() != null) {
            a.setSymptoms(req.getSymptoms());
        }
        if (req.getFollowUpRequired() != null) {
            a.setFollowUpRequired(req.getFollowUpRequired());
        }
        if (req.getFollowUpDate() != null) {
            a.setFollowUpDate(req.getFollowUpDate());
        }

        Appointment updated = appointmentRepository.save(a);
        return ResponseEntity.ok(toDoctorAppointmentDto(updated));
    }

    private Doctor getCurrentDoctor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return doctorRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
    }

    private DoctorAppointmentDto toDoctorAppointmentDto(Appointment appointment) {
        DoctorAppointmentDto dto = new DoctorAppointmentDto();
        dto.setId(appointment.getAppointmentId().toString());
        dto.setStartDateTime(appointment.getAppointmentDate().atTime(appointment.getAppointmentTime()).format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
        User pUser = appointment.getPatient() != null ? appointment.getPatient().getUser() : null;
        dto.setPatientName(pUser != null ? pUser.getFullName() : ("Patient " + appointment.getPatient().getPatientId().toString().substring(0,8)));
        dto.setPatientId(appointment.getPatient().getPatientId().toString());
        dto.setDoctorName(appointment.getDoctor().getUser().getFullName());
        dto.setType("Consultation");
        dto.setStatus(appointment.getStatus().name());
        return dto;
    }

    @PutMapping("/doctors/me/working-hours")
    public ResponseEntity<?> updateWorkingHours(@RequestBody WorkingHoursDto workingHoursDto) {
        doctorService.updateWorkingHours(workingHoursDto);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/doctors/me/working-hours")
    public ResponseEntity<WorkingHoursDto> getWorkingHours() {
        WorkingHoursDto workingHours = doctorService.getWorkingHours();
        return ResponseEntity.ok(workingHours);
    }
}
