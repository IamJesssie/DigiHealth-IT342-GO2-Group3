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
import com.digihealth.backend.security.JwtTokenProvider;
import com.digihealth.backend.service.AppointmentNotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

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

            // Create appointment
            Appointment appointment = new Appointment();
            appointment.setPatient(patient);
            appointment.setDoctor(doctor);
            appointment.setAppointmentDate(bookingDto.getAppointmentDate());
            appointment.setAppointmentTime(bookingDto.getAppointmentTime());
            appointment.setNotes(bookingDto.getReason());
            appointment.setSymptoms(bookingDto.getSymptoms());
            appointment.setStatus(AppointmentStatus.SCHEDULED);

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

            String startStr = workDay != null && workDay.getAvailableStartTime() != null ? workDay.getAvailableStartTime() : "09:00";
            String endStr = workDay != null && workDay.getAvailableEndTime() != null ? workDay.getAvailableEndTime() : "17:00";

            java.time.LocalTime start = java.time.LocalTime.parse(startStr);
            java.time.LocalTime end = java.time.LocalTime.parse(endStr);

            List<Appointment> booked = appointmentRepository.findByDoctorAndAppointmentDate(doctor, date);
            java.util.Set<java.time.LocalTime> bookedTimes = booked.stream()
                    .map(Appointment::getAppointmentTime)
                    .collect(java.util.stream.Collectors.toSet());

            java.util.List<String> slots = new java.util.ArrayList<>();
            java.time.LocalTime t = start;
            while (!t.isAfter(end.minusMinutes(30))) {
                if (!bookedTimes.contains(t)) {
                    slots.add(String.format("%02d:%02d", t.getHour(), t.getMinute()));
                }
                t = t.plusMinutes(30);
            }

            return ResponseEntity.ok(slots);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error retrieving slots: " + e.getMessage());
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
