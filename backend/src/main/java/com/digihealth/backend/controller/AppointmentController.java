package com.digihealth.backend.controller;

import com.digihealth.backend.dto.AppointmentBookingDto;
import com.digihealth.backend.dto.StatusUpdateDto;
import com.digihealth.backend.entity.Appointment;
import com.digihealth.backend.entity.AppointmentStatus;
import com.digihealth.backend.entity.User;
import com.digihealth.backend.entity.Doctor;
import com.digihealth.backend.entity.Patient;
import com.digihealth.backend.entity.DayOfWeek;
import com.digihealth.backend.entity.DoctorWorkDay;
import com.digihealth.backend.repository.AppointmentRepository;
import com.digihealth.backend.repository.UserRepository;
import com.digihealth.backend.repository.DoctorRepository;
import com.digihealth.backend.repository.PatientRepository;
import com.digihealth.backend.repository.DoctorWorkDayRepository;
import com.digihealth.backend.repository.AdminSettingsRepository;
import com.digihealth.backend.entity.AdminSettings;
import com.digihealth.backend.security.JwtTokenProvider;
import com.digihealth.backend.service.AppointmentNotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.stream.Collectors;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private AppointmentNotificationService appointmentNotificationService;

  @Autowired
  private DoctorWorkDayRepository doctorWorkDayRepository;

  @Autowired
  private AdminSettingsRepository adminSettingsRepository;



    /**
     * Book an appointment
     * POST /api/appointments/book
     * {
     *   "doctorId": "uuid",
     *   "appointmentDate": "2025-02-20",
     *   "appointmentTime": "09:00",
     *   "reason": "Regular checkup",
     *   "symptoms": "None"
     * }
     */
  @PostMapping("/book")
  @PreAuthorize("hasRole('PATIENT')")
  public ResponseEntity<?> bookAppointment(@RequestBody AppointmentBookingDto bookingDto) {
    try {
            // Get current user (patient)
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated()) {
                return ResponseEntity.badRequest().body("User not authenticated");
            }

            String email = auth.getName();
            User patientUser = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Patient user not found"));

            // Get doctor user
            User doctorUser = userRepository.findById(bookingDto.getDoctorId())
                    .orElseThrow(() -> new RuntimeException("Doctor not found"));

            if (!doctorUser.getRole().name().equals("DOCTOR")) {
                return ResponseEntity.badRequest().body("Selected user is not a doctor");
            }

            if (!Boolean.TRUE.equals(doctorUser.getIsApproved())) {
                return ResponseEntity.badRequest().body("Doctor is not approved yet");
            }

            // Get Doctor entity linked to this user
            Doctor doctor = doctorRepository.findByUserId(bookingDto.getDoctorId())
                    .orElseThrow(() -> new RuntimeException("Doctor profile not found"));

            // Get Patient entity linked to current user
            Patient patient = patientRepository.findByUserId(patientUser.getId())
                    .orElseThrow(() -> new RuntimeException("Patient profile not found"));

      java.time.LocalDate today = java.time.LocalDate.now();
      java.time.LocalDateTime now = java.time.LocalDateTime.now();

      AdminSettings settings = adminSettingsRepository.findById(1L).orElse(null);
      boolean maintenanceMode = settings != null && Boolean.TRUE.equals(settings.getMaintenanceMode());
      if (maintenanceMode) {
        return ResponseEntity.badRequest().body("Booking is currently disabled (maintenance mode)");
      }

      boolean allowSameDay = settings == null || Boolean.TRUE.equals(settings.getAllowSameDayBooking());
      Integer minAdvanceHours = settings != null && settings.getMinAdvanceHours() != null ? settings.getMinAdvanceHours() : 24;
      Integer maxAdvanceDays = settings != null && settings.getMaxAdvanceDays() != null ? settings.getMaxAdvanceDays() : 90;
      Integer slotMinutes = settings != null && settings.getAppointmentSlotMinutes() != null ? settings.getAppointmentSlotMinutes() : 30;
      boolean autoConfirm = settings != null && Boolean.TRUE.equals(settings.getAutoConfirmAppointments());

      java.time.LocalDate apptDate = bookingDto.getAppointmentDate();
      java.time.LocalTime apptTime = bookingDto.getAppointmentTime();
      java.time.LocalDateTime apptDateTime = java.time.LocalDateTime.of(apptDate, apptTime);

      if (!allowSameDay && apptDate.equals(today)) {
        return ResponseEntity.badRequest().body("Same-day booking is not allowed");
      }

      long hoursUntil = java.time.Duration.between(now, apptDateTime).toHours();
      if (hoursUntil < minAdvanceHours) {
        return ResponseEntity.badRequest().body("Booking must be at least " + minAdvanceHours + " hours in advance");
      }

      long daysUntil = java.time.Duration.between(now.toLocalDate().atStartOfDay(), apptDate.atStartOfDay()).toDays();
      if (daysUntil > maxAdvanceDays) {
        return ResponseEntity.badRequest().body("Booking cannot be made more than " + maxAdvanceDays + " days in advance");
      }

      String abbr = apptDate.getDayOfWeek().name().substring(0, 3);
      DayOfWeek workDayEnum = DayOfWeek.valueOf(abbr);
      DoctorWorkDay workDay = doctorWorkDayRepository.findByDoctorAndWorkDay(doctor, workDayEnum)
              .stream().findFirst().orElse(null);

      if (workDay == null) {
        return ResponseEntity.badRequest().body("Doctor does not work on the selected day");
      }

      String startStr = workDay.getAvailableStartTime() != null ? workDay.getAvailableStartTime() : "09:00";
      String endStr = workDay.getAvailableEndTime() != null ? workDay.getAvailableEndTime() : "17:00";
      java.time.LocalTime start = java.time.LocalTime.parse(startStr);
      java.time.LocalTime end = java.time.LocalTime.parse(endStr);

      if (apptTime.isBefore(start) || !apptTime.isBefore(end)) {
        return ResponseEntity.badRequest().body("Selected time is outside doctor's working hours");
      }

      int minute = apptTime.getMinute();
      if (minute % slotMinutes != 0) {
        return ResponseEntity.badRequest().body("Selected time is not aligned to " + slotMinutes + "-minute slots");
      }

      List<Appointment> existingOnDay = appointmentRepository.findByDoctorAndAppointmentDate(doctor, apptDate);
      boolean timeTaken = existingOnDay.stream().anyMatch(a -> a.getAppointmentTime().equals(apptTime));
      if (timeTaken) {
        return ResponseEntity.badRequest().body("Time slot already booked");
      }

      Appointment appointment = new Appointment();
      appointment.setPatient(patient);
      appointment.setDoctor(doctor);
      appointment.setAppointmentDate(apptDate);
      appointment.setAppointmentTime(apptTime);
      appointment.setNotes(bookingDto.getReason());
      appointment.setSymptoms(bookingDto.getSymptoms());
      appointment.setStatus(autoConfirm ? AppointmentStatus.CONFIRMED : AppointmentStatus.SCHEDULED);

      Appointment saved = appointmentRepository.save(appointment);

      return ResponseEntity.ok(saved);
    } catch (Exception e) {
      return ResponseEntity.badRequest().body("Error booking appointment: " + e.getMessage());
    }
  }

    /**
     * Get all appointments for current user (doctor)
     * GET /api/appointments/my
     */
    @GetMapping("/my")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> getMyAppointments() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Get doctor entity for this user
            Doctor doctor = doctorRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new RuntimeException("Doctor profile not found"));

            List<Appointment> appointments = appointmentRepository.findByDoctor(doctor);
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error retrieving appointments: " + e.getMessage());
        }
    }

    @GetMapping("/patient/my")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<?> getMyPatientAppointments() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Patient patient = patientRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new RuntimeException("Patient profile not found"));

            List<Appointment> appointments = appointmentRepository.findByPatient(patient);
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error retrieving appointments: " + e.getMessage());
        }
    }

    @GetMapping("/doctors/{doctorId}/available-slots")
    @PreAuthorize("hasAnyRole('PATIENT','DOCTOR')")
  public ResponseEntity<?> getAvailableSlots(@PathVariable UUID doctorId, @RequestParam("date") java.time.LocalDate date) {
    try {
            User doctorUser = userRepository.findById(doctorId)
                    .orElseThrow(() -> new RuntimeException("Doctor not found"));
            if (!doctorUser.getRole().name().equals("DOCTOR")) {
                return ResponseEntity.badRequest().body("User is not a doctor");
            }
            if (!Boolean.TRUE.equals(doctorUser.getIsApproved())) {
                return ResponseEntity.badRequest().body("Doctor is not approved yet");
            }

            Doctor doctor = doctorRepository.findByUserId(doctorId)
                    .orElseThrow(() -> new RuntimeException("Doctor profile not found"));

            String abbr = date.getDayOfWeek().name().substring(0, 3);
            DayOfWeek workDayEnum = DayOfWeek.valueOf(abbr);
            DoctorWorkDay workDay = doctorWorkDayRepository.findByDoctorAndWorkDay(doctor, workDayEnum)
                    .stream().findFirst().orElse(null);

            if (workDay == null) {
                return ResponseEntity.ok(java.util.Collections.emptyList());
            }

            String startStr = workDay.getAvailableStartTime() != null ? workDay.getAvailableStartTime() : "09:00";
            String endStr = workDay.getAvailableEndTime() != null ? workDay.getAvailableEndTime() : "17:00";

            java.time.LocalTime start = java.time.LocalTime.parse(startStr);
            java.time.LocalTime end = java.time.LocalTime.parse(endStr);

            List<Appointment> booked = appointmentRepository.findByDoctorAndAppointmentDate(doctor, date);
            java.util.Set<java.time.LocalTime> bookedTimes = booked.stream()
                    .map(Appointment::getAppointmentTime)
                    .collect(java.util.stream.Collectors.toSet());

      AdminSettings settings = adminSettingsRepository.findById(1L).orElse(null);
      int slotMinutes = settings != null && settings.getAppointmentSlotMinutes() != null ? settings.getAppointmentSlotMinutes() : 30;

      java.util.List<String> slots = new java.util.ArrayList<>();
      java.time.LocalTime t = start;
      while (!t.isAfter(end.minusMinutes(slotMinutes))) {
        if (!bookedTimes.contains(t)) {
          slots.add(String.format("%02d:%02d", t.getHour(), t.getMinute()));
        }
        t = t.plusMinutes(slotMinutes);
      }

            return ResponseEntity.ok(slots);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error retrieving slots: " + e.getMessage());
        }
    }

    /**
     * Get doctor's working days and hours
     * GET /api/appointments/doctors/{doctorId}/work-days
     * Response:
     * {
     *   "workDays": ["MON","TUE","WED"],
     *   "hours": { "MON": {"start":"09:00","end":"17:00"}, ... },
     *   "slotMinutes": 30
     * }
     */
    @GetMapping("/doctors/{doctorId}/work-days")
    @PreAuthorize("hasAnyRole('PATIENT','DOCTOR','ADMIN')")
    public ResponseEntity<?> getDoctorWorkDays(@PathVariable UUID doctorId) {
        try {
            User doctorUser = userRepository.findById(doctorId)
                    .orElseThrow(() -> new RuntimeException("Doctor not found"));
            if (!doctorUser.getRole().name().equals("DOCTOR")) {
                return ResponseEntity.badRequest().body("User is not a doctor");
            }
            if (!Boolean.TRUE.equals(doctorUser.getIsApproved())) {
                return ResponseEntity.badRequest().body("Doctor is not approved yet");
            }

            Doctor doctor = doctorRepository.findByUserId(doctorId)
                    .orElseThrow(() -> new RuntimeException("Doctor profile not found"));

            java.util.List<DoctorWorkDay> days = doctorWorkDayRepository.findByDoctor(doctor);
            java.util.List<String> workDays = days.stream()
                    .map(d -> d.getWorkDay().name())
                    .collect(Collectors.toList());

            Map<String, Map<String, String>> hours = days.stream().collect(Collectors.toMap(
                    d -> d.getWorkDay().name(),
                    d -> Map.of(
                            "start", d.getAvailableStartTime() != null ? d.getAvailableStartTime() : "09:00",
                            "end", d.getAvailableEndTime() != null ? d.getAvailableEndTime() : "17:00"
                    )
            ));

            AdminSettings settings = adminSettingsRepository.findById(1L).orElse(null);
            int slotMinutes = settings != null && settings.getAppointmentSlotMinutes() != null ? settings.getAppointmentSlotMinutes() : 30;

            Map<String, Object> payload = new java.util.HashMap<>();
            payload.put("workDays", workDays);
            payload.put("hours", hours);
            payload.put("slotMinutes", slotMinutes);

            return ResponseEntity.ok(payload);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error retrieving work days: " + e.getMessage());
        }
    }

    /**
     * Update appointment status
     * PUT /api/appointments/{appointmentId}/status
     * {
     *   "status": "CONFIRMED"
     * }
     */
    @PutMapping("/{appointmentId}/status")
    public ResponseEntity<?> updateAppointmentStatus(
            @PathVariable UUID appointmentId,
            @RequestBody StatusUpdateDto statusUpdate) {
        try {
            Appointment appointment = appointmentRepository.findById(appointmentId)
                    .orElseThrow(() -> new RuntimeException("Appointment not found"));

            appointment.setStatus(AppointmentStatus.valueOf(statusUpdate.getStatus()));
            Appointment updated = appointmentRepository.save(appointment);
        
        appointmentNotificationService.notifyAppointmentStatusChange(updated);

        return ResponseEntity.ok(updated);
    } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating appointment: " + e.getMessage());
        }
    }

    /**
     * Get all doctors (available for booking)
     * GET /api/doctors
     */
    @GetMapping("/doctors")
    public ResponseEntity<?> getAllDoctors() {
        try {
            List<User> doctors = userRepository.findAll().stream()
                    .filter(u -> u.getRole().name().equals("DOCTOR"))
                    .filter(User::getIsApproved)
                    .toList();
            return ResponseEntity.ok(doctors);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error retrieving doctors: " + e.getMessage());
        }
    }

    /**
     * Get doctor details
     * GET /api/doctors/{doctorId}
     */
    @GetMapping("/doctors/{doctorId}")
    public ResponseEntity<?> getDoctor(@PathVariable UUID doctorId) {
        try {
            User doctor = userRepository.findById(doctorId)
                    .orElseThrow(() -> new RuntimeException("Doctor not found"));

            if (!doctor.getRole().name().equals("DOCTOR")) {
                return ResponseEntity.badRequest().body("User is not a doctor");
            }

            return ResponseEntity.ok(doctor);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error retrieving doctor: " + e.getMessage());
        }
    }
}
