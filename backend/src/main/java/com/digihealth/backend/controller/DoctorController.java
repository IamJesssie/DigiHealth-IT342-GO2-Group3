package com.digihealth.backend.controller;

import com.digihealth.backend.dto.response.MessageResponse;
import com.digihealth.backend.entity.Doctor;
import com.digihealth.backend.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "*", maxAge = 3600)
public class DoctorController {
    
    @Autowired
    private DoctorService doctorService;
    
    @GetMapping("/approved")
    public ResponseEntity<?> getApprovedDoctors() {
        try {
            List<Doctor> doctors = doctorService.getApprovedDoctors();
            return ResponseEntity.ok(doctors);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
    
    @GetMapping("/search")
    public ResponseEntity<?> searchDoctorsBySpecialization(@RequestParam String specialization) {
        try {
            List<Doctor> doctors = doctorService.searchBySpecialization(specialization);
            return ResponseEntity.ok(doctors);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getDoctorById(@PathVariable UUID id) {
        try {
            Doctor doctor = doctorService.getDoctorById(id);
            return ResponseEntity.ok(doctor);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
    
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<?> getDoctorByUserId(@PathVariable UUID userId) {
        try {
            Doctor doctor = doctorService.getDoctorByUserId(userId);
            return ResponseEntity.ok(doctor);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<?> updateDoctorProfile(@PathVariable UUID id, @RequestBody Doctor doctorUpdate) {
        try {
            Doctor doctor = doctorService.updateDoctorProfile(id, doctorUpdate);
            return ResponseEntity.ok(new MessageResponse("Doctor profile updated", doctor));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllDoctors() {
        try {
            List<Doctor> doctors = doctorService.getAllDoctors();
            return ResponseEntity.ok(doctors);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
    
    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getPendingDoctors() {
        try {
            List<Doctor> doctors = doctorService.getPendingDoctors();
            return ResponseEntity.ok(doctors);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
}
