package com.digihealth.backend.controller;

import com.digihealth.backend.dto.CreateUpdateMedicalNoteRequest;
import com.digihealth.backend.dto.MedicalNoteDto;
import com.digihealth.backend.entity.*;
import com.digihealth.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/doctors/me/patients")
@org.springframework.security.access.prepost.PreAuthorize("hasRole('DOCTOR')")
public class MedicalNotesController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private MedicalNoteRepository medicalNoteRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private com.digihealth.backend.service.NotificationService notificationService;

    private Doctor getCurrentDoctor() {
        org.springframework.security.core.Authentication authentication =
                org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return doctorRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Doctor profile not found for current user"));
    }

    private boolean doctorHasRelationshipWithPatient(Doctor doctor, Patient patient) {
        return appointmentRepository.findByDoctor(doctor).stream()
                .anyMatch(a -> a.getPatient().getPatientId().equals(patient.getPatientId()));
    }

    private MedicalNoteDto toDto(MedicalNote note) {
        MedicalNoteDto dto = new MedicalNoteDto();
        dto.setId(note.getNoteId().toString());
        dto.setPatientId(note.getPatient().getPatientId().toString());
        dto.setDoctorId(note.getDoctor().getDoctorId().toString());
        dto.setAppointmentId(note.getAppointment() != null ? note.getAppointment().getAppointmentId().toString() : null);
        dto.setAppointmentType(note.getAppointment() != null ? note.getAppointment().getAppointmentType() : null);
        dto.setNoteText(note.getNoteText());
        dto.setDiagnosis(note.getDiagnosis());
        dto.setPrescriptions(note.getPrescriptions());
        dto.setObservations(note.getObservations());
        dto.setCreatedAt(note.getCreatedAt());
        dto.setUpdatedAt(note.getUpdatedAt());
        return dto;
    }

    @GetMapping("/{patientId}/notes")
    public ResponseEntity<?> listNotes(@PathVariable UUID patientId) {
        Doctor doctor = getCurrentDoctor();
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        if (!doctorHasRelationshipWithPatient(doctor, patient)) {
            return ResponseEntity.status(403).body("Access denied: patient not assigned to current doctor");
        }

        List<MedicalNoteDto> notes = medicalNoteRepository
                .findByPatientAndDoctorOrderByCreatedAtDesc(patient, doctor)
                .stream().map(this::toDto).collect(Collectors.toList());

        return ResponseEntity.ok(notes);
    }

    @GetMapping("/{patientId}/notes/page")
    public ResponseEntity<?> listNotesPage(@PathVariable UUID patientId,
                                           @RequestParam(name = "page", defaultValue = "0") int page,
                                           @RequestParam(name = "size", defaultValue = "10") int size) {
        Doctor doctor = getCurrentDoctor();
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        if (!doctorHasRelationshipWithPatient(doctor, patient)) {
            return ResponseEntity.status(403).body("Access denied: patient not assigned to current doctor");
        }

        org.springframework.data.domain.PageRequest pr = org.springframework.data.domain.PageRequest.of(
                Math.max(page, 0), Math.max(size, 1), org.springframework.data.domain.Sort.by("createdAt").descending());
        org.springframework.data.domain.Page<MedicalNote> pageRes = medicalNoteRepository.findByPatientAndDoctor(patient, doctor, pr);
        java.util.Map<String, Object> payload = new java.util.HashMap<>();
        payload.put("content", pageRes.getContent().stream().map(this::toDto).collect(Collectors.toList()));
        payload.put("page", pageRes.getNumber());
        payload.put("size", pageRes.getSize());
        payload.put("totalElements", pageRes.getTotalElements());
        payload.put("totalPages", pageRes.getTotalPages());
        return ResponseEntity.ok(payload);
    }

    @PostMapping("/{patientId}/notes")
    public ResponseEntity<?> createNote(@PathVariable UUID patientId,
                                        @RequestBody CreateUpdateMedicalNoteRequest request) {
        Doctor doctor = getCurrentDoctor();
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        if (!doctorHasRelationshipWithPatient(doctor, patient)) {
            return ResponseEntity.status(403).body("Access denied: patient not assigned to current doctor");
        }

        MedicalNote note = new MedicalNote();
        note.setPatient(patient);
        note.setDoctor(doctor);
        note.setNoteText(request.getNoteText());
        note.setDiagnosis(request.getDiagnosis());
        note.setPrescriptions(request.getPrescriptions());
        note.setObservations(request.getObservations());
        note.setCreatedAt(LocalDateTime.now());
        note.setUpdatedAt(LocalDateTime.now());

        if (request.getAppointmentId() != null && !request.getAppointmentId().isBlank()) {
            try {
                UUID apptId = UUID.fromString(request.getAppointmentId());
                Appointment appt = appointmentRepository.findById(apptId).orElse(null);
                if (appt != null && appt.getDoctor().getDoctorId().equals(doctor.getDoctorId())
                        && appt.getPatient().getPatientId().equals(patient.getPatientId())) {
                    note.setAppointment(appt);
                }
            } catch (Exception ignored) {}
        }

        MedicalNote saved = medicalNoteRepository.save(note);
        AuditLog log = new AuditLog();
        log.setOperation("CREATE_NOTE");
        log.setActorUserEmail(doctor.getUser().getEmail());
        log.setResourceType("MedicalNote");
        log.setResourceId(saved.getNoteId().toString());
        log.setCreatedAt(LocalDateTime.now());
        auditLogRepository.save(log);
        
        // Send notification to patient that medical records were added
        String patientEmail = patient.getUser().getEmail();
        String appointmentType = request.getAppointmentId() != null && !request.getAppointmentId().isBlank() ? 
            (note.getAppointment() != null ? note.getAppointment().getAppointmentType() : "Appointment") : "General";
        String title = "Medical Records Available - " + appointmentType;
        String message = "Dr. " + doctor.getUser().getFullName() + " has added medical records for your appointment.";
        notificationService.createAndSend(patientEmail, title, message, "MEDICAL_NOTES_ADDED", saved.getNoteId().toString(), null);
        
        return ResponseEntity.ok(toDto(saved));
    }

    @PutMapping("/{patientId}/notes/{noteId}")
    public ResponseEntity<?> updateNote(@PathVariable UUID patientId,
                                        @PathVariable UUID noteId,
                                        @RequestBody CreateUpdateMedicalNoteRequest request) {
        Doctor doctor = getCurrentDoctor();
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        MedicalNote note = medicalNoteRepository.findById(noteId)
                .orElseThrow(() -> new RuntimeException("Medical note not found"));

        if (!note.getDoctor().getDoctorId().equals(doctor.getDoctorId()) ||
                !note.getPatient().getPatientId().equals(patient.getPatientId())) {
            return ResponseEntity.status(403).body("Access denied: cannot edit another doctor's note or wrong patient");
        }

        note.setNoteText(request.getNoteText());
        note.setDiagnosis(request.getDiagnosis());
        note.setPrescriptions(request.getPrescriptions());
        note.setObservations(request.getObservations());
        note.setUpdatedAt(LocalDateTime.now());

        MedicalNote saved = medicalNoteRepository.save(note);
        AuditLog log = new AuditLog();
        log.setOperation("UPDATE_NOTE");
        log.setActorUserEmail(doctor.getUser().getEmail());
        log.setResourceType("MedicalNote");
        log.setResourceId(saved.getNoteId().toString());
        log.setCreatedAt(LocalDateTime.now());
        auditLogRepository.save(log);
        
        // Send notification to patient that medical records were updated
        String patientEmail = patient.getUser().getEmail();
        String appointmentType = note.getAppointment() != null ? note.getAppointment().getAppointmentType() : "General";
        String title = "Medical Records Updated - " + appointmentType;
        String message = "Dr. " + doctor.getUser().getFullName() + " has updated your medical records.";
        notificationService.createAndSend(patientEmail, title, message, "MEDICAL_NOTES_UPDATED", saved.getNoteId().toString(), null);
        
        return ResponseEntity.ok(toDto(saved));
    }

    @DeleteMapping("/{patientId}/notes/{noteId}")
    public ResponseEntity<?> deleteNote(@PathVariable UUID patientId, @PathVariable UUID noteId) {
        Doctor doctor = getCurrentDoctor();
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        MedicalNote note = medicalNoteRepository.findById(noteId)
                .orElseThrow(() -> new RuntimeException("Medical note not found"));

        if (!note.getDoctor().getDoctorId().equals(doctor.getDoctorId()) ||
                !note.getPatient().getPatientId().equals(patient.getPatientId())) {
            return ResponseEntity.status(403).body("Access denied: cannot delete another doctor's note or wrong patient");
        }

        medicalNoteRepository.delete(note);
        AuditLog log = new AuditLog();
        log.setOperation("DELETE_NOTE");
        log.setActorUserEmail(doctor.getUser().getEmail());
        log.setResourceType("MedicalNote");
        log.setResourceId(note.getNoteId().toString());
        log.setCreatedAt(LocalDateTime.now());
        auditLogRepository.save(log);
        return ResponseEntity.noContent().build();
    }
}
