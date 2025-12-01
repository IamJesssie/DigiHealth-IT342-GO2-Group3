package com.digihealth.backend.controller;

import com.digihealth.backend.dto.*;
import com.digihealth.backend.service.DashboardService;
import com.digihealth.backend.service.DoctorService;
import com.digihealth.backend.entity.Appointment;
import com.digihealth.backend.entity.AppointmentStatus;
import com.digihealth.backend.entity.Doctor;
import com.digihealth.backend.entity.Patient;
import com.digihealth.backend.entity.User;
import com.digihealth.backend.entity.Address;
import com.digihealth.backend.entity.Gender;
import com.digihealth.backend.repository.AppointmentRepository;
import com.digihealth.backend.repository.DoctorRepository;
import com.digihealth.backend.repository.PatientRepository;
import com.digihealth.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;
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

    @Autowired
    private com.digihealth.backend.repository.AdminSettingsRepository adminSettingsRepository;

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

    @PutMapping("/doctors/me/patients/{patientId}/details")
    public ResponseEntity<?> updatePatientDetails(@PathVariable UUID patientId, @RequestBody PatientDetailsUpdateRequest req) {
        Doctor doctor = getCurrentDoctor();
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        if (!hasDoctorPatientRelationship(doctor, patient)) {
            return ResponseEntity.status(403).build();
        }

        if (req.getAge() != null) patient.setAge(req.getAge());
        if (req.getGender() != null) {
            try { patient.setGender(Gender.valueOf(req.getGender())); } catch (Exception ignored) {}
        }
        if (req.getAllergies() != null) patient.setAllergies(req.getAllergies());
        if (req.getMedicalConditions() != null) patient.setMedicalConditions(req.getMedicalConditions());
        if (req.getEmergencyContactName() != null) patient.setEmergencyContactName(req.getEmergencyContactName());
        if (req.getEmergencyContactPhone() != null) patient.setEmergencyContactPhone(req.getEmergencyContactPhone());
        if (req.getBloodType() != null) patient.setBloodType(req.getBloodType());
        if (req.getBirthDate() != null) patient.setBirthDate(req.getBirthDate());

        Address addr = patient.getAddress();
        if (addr == null) addr = new Address();
        if (req.getStreet() != null) addr.setStreet(req.getStreet());
        if (req.getCity() != null) addr.setCity(req.getCity());
        if (req.getState() != null) addr.setState(req.getState());
        if (req.getPostalCode() != null) addr.setPostalCode(req.getPostalCode());
        if (req.getCountry() != null) addr.setCountry(req.getCountry());
        patient.setAddress(addr);

        Patient saved = patientRepository.save(patient);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/doctors/me/patients/{patientId}/details")
    public ResponseEntity<java.util.Map<String, Object>> getPatientDetails(@PathVariable UUID patientId) {
        Doctor doctor = getCurrentDoctor();
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        if (!hasDoctorPatientRelationship(doctor, patient)) {
            return ResponseEntity.status(403).build();
        }

        java.util.Map<String, Object> payload = new java.util.HashMap<>();
        payload.put("age", patient.getAge());
        payload.put("gender", patient.getGender() != null ? patient.getGender().name() : "");
        payload.put("allergies", patient.getAllergies() != null ? patient.getAllergies() : "");
        payload.put("medicalConditions", patient.getMedicalConditions() != null ? patient.getMedicalConditions() : "");
        payload.put("emergencyContactName", patient.getEmergencyContactName() != null ? patient.getEmergencyContactName() : "");
        payload.put("emergencyContactPhone", patient.getEmergencyContactPhone() != null ? patient.getEmergencyContactPhone() : "");
        payload.put("bloodType", patient.getBloodType() != null ? patient.getBloodType() : "");
        payload.put("birthDate", patient.getBirthDate());

        Address a = patient.getAddress();
        payload.put("street", a != null && a.getStreet() != null ? a.getStreet() : "");
        payload.put("city", a != null && a.getCity() != null ? a.getCity() : "");
        payload.put("state", a != null && a.getState() != null ? a.getState() : "");
        payload.put("postalCode", a != null && a.getPostalCode() != null ? a.getPostalCode() : "");
        payload.put("country", a != null && a.getCountry() != null ? a.getCountry() : "");

        return ResponseEntity.ok(payload);
    }

    private boolean hasDoctorPatientRelationship(Doctor doctor, Patient patient) {
        return appointmentRepository.findByDoctor(doctor).stream()
                .anyMatch(a -> a.getPatient().getPatientId().equals(patient.getPatientId()));
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

    @GetMapping("/doctors/me/available-slots")
    public ResponseEntity<List<String>> getAvailableSlots(@RequestParam("date") String dateStr) {
        Doctor doctor = getCurrentDoctor();
        LocalDate date = LocalDate.parse(dateStr);

        WorkingHoursDto wh = doctorService.getWorkingHours();
        String dayName;
        switch (date.getDayOfWeek()) {
            case MONDAY: dayName = "Monday"; break;
            case TUESDAY: dayName = "Tuesday"; break;
            case WEDNESDAY: dayName = "Wednesday"; break;
            case THURSDAY: dayName = "Thursday"; break;
            case FRIDAY: dayName = "Friday"; break;
            case SATURDAY: dayName = "Saturday"; break;
            case SUNDAY: dayName = "Sunday"; break;
            default: dayName = "Monday";
        }

        if (wh.getWorkDays() == null || !wh.getWorkDays().contains(dayName)) {
            return ResponseEntity.ok(java.util.Collections.emptyList());
        }

        WorkingHoursDto.TimeRange tr = wh.getWorkHours() != null ? wh.getWorkHours().get(dayName) : null;
        String startStr = tr != null && tr.getStartTime() != null ? tr.getStartTime() : "09:00";
        String endStr = tr != null && tr.getEndTime() != null ? tr.getEndTime() : "17:00";
        LocalTime start = LocalTime.parse(startStr);
        LocalTime end = LocalTime.parse(endStr);

        int slotMinutes = adminSettingsRepository.findById(1L)
                .map(s -> s.getAppointmentSlotMinutes() != null ? s.getAppointmentSlotMinutes() : 30)
                .orElse(30);

        List<String> occupied = appointmentRepository.findByDoctor(doctor).stream()
                .filter(a -> date.equals(a.getAppointmentDate()))
                .map(a -> a.getAppointmentTime().toString().substring(0, 5))
                .collect(Collectors.toList());

        List<String> slots = new java.util.ArrayList<>();
        LocalTime t = start;
        while (!t.plusMinutes(slotMinutes).isAfter(end)) {
            String s = t.toString().substring(0, 5);
            if (!occupied.contains(s)) {
                slots.add(s);
            }
            t = t.plusMinutes(slotMinutes);
        }
        return ResponseEntity.ok(slots);
    }
}
