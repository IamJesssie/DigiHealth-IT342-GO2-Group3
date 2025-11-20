package com.digihealth.backend.controller;

import com.digihealth.backend.dto.response.MessageResponse;
import com.digihealth.backend.entity.Doctor;
import com.digihealth.backend.entity.User;
import com.digihealth.backend.service.AdminService;
import com.digihealth.backend.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    
    @Autowired
    private AdminService adminService;
    
    @Autowired
    private DoctorService doctorService;
    
    /**
     * FR-9: Approve doctor registration
     */
    @PutMapping("/doctors/{doctorId}/approve")
    public ResponseEntity<?> approveDoctor(
            @PathVariable Long doctorId,
            @RequestParam Long adminUserId) {
        try {
            Doctor doctor = adminService.approveDoctorRegistration(doctorId, adminUserId);
            return ResponseEntity.ok(doctor);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
    
    /**
     * FR-9: Reject doctor registration
     */
    @PutMapping("/doctors/{doctorId}/reject")
    public ResponseEntity<?> rejectDoctor(@PathVariable Long doctorId) {
        try {
            Doctor doctor = adminService.rejectDoctorRegistration(doctorId);
            return ResponseEntity.ok(doctor);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
    
    /**
     * FR-9: Deactivate doctor account
     */
    @PutMapping("/doctors/{doctorId}/deactivate")
    public ResponseEntity<?> deactivateDoctor(@PathVariable Long doctorId) {
        try {
            Doctor doctor = adminService.deactivateDoctorAccount(doctorId);
            return ResponseEntity.ok(doctor);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
    
    /**
     * FR-9: Activate/Deactivate user account
     */
    @PutMapping("/users/{userId}/status")
    public ResponseEntity<?> updateUserStatus(
            @PathVariable Long userId,
            @RequestParam Boolean isActive) {
        try {
            User user = adminService.updateUserStatus(userId, isActive);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
    
    /**
     * FR-10: Get system statistics and reports
     */
    @GetMapping("/statistics")
    public ResponseEntity<?> getSystemStatistics() {
        try {
            Map<String, Object> statistics = adminService.getSystemStatistics();
            return ResponseEntity.ok(statistics);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
    
    /**
     * FR-10: Get appointment statistics
     */
    @GetMapping("/statistics/appointments")
    public ResponseEntity<?> getAppointmentStatistics() {
        try {
            Map<String, Object> statistics = adminService.getAppointmentStatistics();
            return ResponseEntity.ok(statistics);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
    
    /**
     * FR-12: System health check
     */
    @GetMapping("/system/health")
    public ResponseEntity<?> getSystemHealth() {
        try {
            Map<String, Object> healthStatus = adminService.getSystemHealth();
            return ResponseEntity.ok(healthStatus);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
    
    /**
     * Get all users
     */
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        try {
            var users = adminService.getAllUsers();
            return ResponseEntity.ok(users);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
    
    /**
     * Get pending doctor registrations
     */
    @GetMapping("/doctors/pending")
    public ResponseEntity<?> getPendingDoctors() {
        try {
            var doctors = doctorService.getPendingDoctors();
            return ResponseEntity.ok(doctors);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
}
