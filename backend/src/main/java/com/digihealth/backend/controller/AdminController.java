package com.digihealth.backend.controller;

import com.digihealth.backend.entity.User;
import com.digihealth.backend.entity.Appointment;
import com.digihealth.backend.repository.UserRepository;
import com.digihealth.backend.repository.AppointmentRepository;
import com.digihealth.backend.dto.DoctorApprovalDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.Map;
import java.util.stream.Collectors;
import java.time.LocalDate;
import com.digihealth.backend.entity.AppointmentStatus;
import com.digihealth.backend.entity.AdminSettings;
import com.digihealth.backend.entity.AuditLog;
import com.digihealth.backend.repository.AdminSettingsRepository;
import com.digihealth.backend.repository.AuditLogRepository;

@RestController
@RequestMapping("/api/admin")
@org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private AdminSettingsRepository adminSettingsRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    /**
     * Get all pending doctor approvals
     * GET /api/admin/doctors/pending
     */
    @GetMapping("/doctors/pending")
    public ResponseEntity<List<User>> getPendingDoctors() {
        List<User> pendingDoctors = userRepository.findAll().stream()
                .filter(user -> user.getRole().name().equals("DOCTOR"))
                .filter(user -> !user.getIsApproved())
                .toList();
        return ResponseEntity.ok(pendingDoctors);
    }

    /**
     * Get all approved doctors
     * GET /api/admin/doctors/approved
     */
    @GetMapping("/doctors/approved")
    public ResponseEntity<List<User>> getApprovedDoctors() {
        List<User> approvedDoctors = userRepository.findAll().stream()
                .filter(user -> user.getRole().name().equals("DOCTOR"))
                .filter(User::getIsApproved)
                .toList();
        return ResponseEntity.ok(approvedDoctors);
    }

    /**
     * Approve a doctor
     * PUT /api/admin/doctors/{doctorId}/approve
     */
    @PutMapping("/doctors/{doctorId}/approve")
    public ResponseEntity<?> approveDoctor(@PathVariable UUID doctorId) {
        User doctor = userRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        if (!doctor.getRole().name().equals("DOCTOR")) {
            return ResponseEntity.badRequest().body("User is not a doctor");
        }

        doctor.setIsApproved(true);
        userRepository.save(doctor);

        AuditLog log = new AuditLog();
        log.setOperation("APPROVE_DOCTOR");
        log.setActorUserEmail(org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName());
        log.setResourceType("User");
        log.setResourceId(doctor.getId().toString());
        log.setCreatedAt(java.time.LocalDateTime.now());
        auditLogRepository.save(log);

        return ResponseEntity.ok(new DoctorApprovalDto(
                doctor.getId(),
                doctor.getFullName(),
                doctor.getSpecialization(),
                doctor.getIsApproved(),
                "Doctor approved successfully"
        ));
    }

    /**
     * Reject a doctor
     * PUT /api/admin/doctors/{doctorId}/reject
     */
    @PutMapping("/doctors/{doctorId}/reject")
    public ResponseEntity<?> rejectDoctor(@PathVariable UUID doctorId) {
        User doctor = userRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        if (!doctor.getRole().name().equals("DOCTOR")) {
            return ResponseEntity.badRequest().body("User is not a doctor");
        }

        // Set to inactive and not approved
        doctor.setIsApproved(false);
        doctor.setIsActive(false);
        userRepository.save(doctor);

        AuditLog log = new AuditLog();
        log.setOperation("REJECT_DOCTOR");
        log.setActorUserEmail(org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName());
        log.setResourceType("User");
        log.setResourceId(doctor.getId().toString());
        log.setCreatedAt(java.time.LocalDateTime.now());
        auditLogRepository.save(log);

        return ResponseEntity.ok(new DoctorApprovalDto(
                doctor.getId(),
                doctor.getFullName(),
                doctor.getSpecialization(),
                doctor.getIsApproved(),
                "Doctor rejected successfully"
        ));
    }

    /**
     * Get all patients
     * GET /api/admin/patients
     */
    @GetMapping("/patients")
    public ResponseEntity<List<User>> getAllPatients() {
        List<User> patients = userRepository.findAll().stream()
                .filter(user -> user.getRole().name().equals("PATIENT"))
                .toList();
        return ResponseEntity.ok(patients);
    }

    /**
     * Get patient by ID
     * GET /api/admin/patients/{patientId}
     */
    @GetMapping("/patients/{patientId}")
    public ResponseEntity<?> getPatient(@PathVariable UUID patientId) {
        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        if (!patient.getRole().name().equals("PATIENT")) {
            return ResponseEntity.badRequest().body("User is not a patient");
        }

        return ResponseEntity.ok(patient);
    }

    /**
     * Get all appointments (admin view)
     * GET /api/admin/appointments
     */
  @GetMapping("/appointments")
  public ResponseEntity<List<Appointment>> getAllAppointments() {
    List<Appointment> appointments = appointmentRepository.findAll();
    return ResponseEntity.ok(appointments);
  }

    /**
     * Get all doctors (both approved and pending)
     * GET /api/admin/doctors
     */
    @GetMapping("/doctors")
    public ResponseEntity<List<User>> getAllDoctors() {
        List<User> doctors = userRepository.findAll().stream()
                .filter(user -> user.getRole().name().equals("DOCTOR"))
                .toList();
        return ResponseEntity.ok(doctors);
    }

    /**
     * Deactivate a user account (doctor or patient only)
     * PUT /api/admin/users/{id}/deactivate
     */
    @PutMapping("/users/{id}/deactivate")
    public ResponseEntity<?> deactivateUser(@PathVariable UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String roleName = user.getRole().name();

        // Prevent deactivating admins, especially the last one
        if ("ADMIN".equals(roleName)) {
            long activeAdmins = userRepository.findAll().stream()
                    .filter(u -> "ADMIN".equals(u.getRole().name()) && Boolean.TRUE.equals(u.getIsActive()))
                    .count();
            if (activeAdmins <= 1) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Cannot deactivate the last active admin account"));
            }
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Admin accounts cannot be deactivated"));
        }

        // Only allow for doctors and patients
        if (!"DOCTOR".equals(roleName) && !"PATIENT".equals(roleName)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Only doctors and patients can be deactivated"));
        }

        // Cascade: Cancel future SCHEDULED appointments
        LocalDate today = LocalDate.now();
        List<Appointment> futureAppts;
        if ("DOCTOR".equals(roleName)) {
            futureAppts = appointmentRepository.findAll().stream()
                    .filter(a -> a.getDoctor().getUser().getId().equals(id))
                    .filter(a -> !a.getAppointmentDate().isBefore(today))
                    .filter(a -> AppointmentStatus.SCHEDULED.equals(a.getStatus()))
                    .collect(Collectors.toList());
        } else { // PATIENT
            futureAppts = appointmentRepository.findAll().stream()
                    .filter(a -> a.getPatient().getUser().getId().equals(id))
                    .filter(a -> !a.getAppointmentDate().isBefore(today))
                    .filter(a -> AppointmentStatus.SCHEDULED.equals(a.getStatus()))
                    .collect(Collectors.toList());
        }
        if (!futureAppts.isEmpty()) {
            futureAppts.forEach(a -> a.setStatus(AppointmentStatus.CANCELLED));
            appointmentRepository.saveAll(futureAppts);
        }

        user.setIsActive(false);
        userRepository.save(user);

        AuditLog log = new AuditLog();
        log.setOperation("DEACTIVATE_USER");
        log.setActorUserEmail(org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName());
        log.setResourceType("User");
        log.setResourceId(id.toString());
        log.setCreatedAt(java.time.LocalDateTime.now());
        auditLogRepository.save(log);

        return ResponseEntity.ok(Map.of(
                "message", "User deactivated successfully",
                "userId", id.toString(),
                "status", "INACTIVE"
        ));
    }

    /**
     * Reactivate a user account (doctor or patient only)
     * PUT /api/admin/users/{id}/reactivate
     */
  @PutMapping("/users/{id}/reactivate")
  public ResponseEntity<?> reactivateUser(@PathVariable UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String roleName = user.getRole().name();

        // Only allow for doctors and patients
        if (!"DOCTOR".equals(roleName) && !"PATIENT".equals(roleName)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Only doctors and patients can be reactivated"));
        }

        user.setIsActive(true);
        userRepository.save(user);

        AuditLog log = new AuditLog();
        log.setOperation("REACTIVATE_USER");
        log.setActorUserEmail(org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName());
        log.setResourceType("User");
        log.setResourceId(id.toString());
        log.setCreatedAt(java.time.LocalDateTime.now());
        auditLogRepository.save(log);

        return ResponseEntity.ok(Map.of(
                "message", "User reactivated successfully",
                "userId", id.toString(),
                "status", "ACTIVE"
        ));
  }

  /**
   * System status monitoring
   * GET /api/admin/system-status
   */
  @GetMapping("/system-status")
  public ResponseEntity<java.util.Map<String, Object>> getSystemStatus() {
    java.util.Map<String, Object> status = new java.util.HashMap<>();
    try {
      long uptimeMs = java.lang.management.ManagementFactory.getRuntimeMXBean().getUptime();
      Runtime rt = Runtime.getRuntime();
      long totalMem = rt.totalMemory();
      long freeMem = rt.freeMemory();
      long usedMem = totalMem - freeMem;

      long totalDoctors = userRepository.findAll().stream().filter(u -> "DOCTOR".equals(u.getRole().name())).count();
      long totalPatients = userRepository.findAll().stream().filter(u -> "PATIENT".equals(u.getRole().name())).count();
      long scheduledAppointments = appointmentRepository.findAll().stream().filter(a -> a.getStatus() == AppointmentStatus.SCHEDULED || a.getStatus() == AppointmentStatus.CONFIRMED).count();
      long completedAppointments = appointmentRepository.findAll().stream().filter(a -> a.getStatus() == AppointmentStatus.COMPLETED).count();

      boolean dbOk = true;
      try {
        // simple check
        userRepository.count();
      } catch (Exception ex) {
        dbOk = false;
      }

      AdminSettings settings = adminSettingsRepository.findById(1L).orElse(null);

      status.put("serverTime", java.time.ZonedDateTime.now().toString());
      status.put("uptimeSeconds", uptimeMs / 1000);
      status.put("memoryUsedBytes", usedMem);
      status.put("memoryTotalBytes", totalMem);
      status.put("databaseHealthy", dbOk);
      status.put("maintenanceMode", settings != null && Boolean.TRUE.equals(settings.getMaintenanceMode()));
      status.put("totalDoctors", totalDoctors);
      status.put("totalPatients", totalPatients);
      status.put("scheduledAppointments", scheduledAppointments);
      status.put("completedAppointments", completedAppointments);

      return ResponseEntity.ok(status);
    } catch (Exception e) {
      status.put("error", e.getMessage());
      return ResponseEntity.ok(status);
    }
  }

  /**
   * Get global admin settings (singleton ID=1)
   * GET /api/admin/settings
   */
  @GetMapping("/settings")
  public ResponseEntity<AdminSettings> getAdminSettings() {
        return adminSettingsRepository.findById(1L)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Update global admin settings (singleton ID=1, admin-only)
     * PUT /api/admin/settings
     */
    @PutMapping("/settings")
    public ResponseEntity<AdminSettings> updateAdminSettings(@RequestBody AdminSettings settings) {
        if (settings.getId() == null || !settings.getId().equals(1L)) {
            return ResponseEntity.badRequest().body(null);
        }
        AdminSettings saved = adminSettingsRepository.save(settings);
        return ResponseEntity.ok(saved);
    }
}
