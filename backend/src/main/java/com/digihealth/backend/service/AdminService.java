package com.digihealth.backend.service;

import com.digihealth.backend.entity.*;
import com.digihealth.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class AdminService {
    
    @Autowired
    private DoctorRepository doctorRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PatientRepository patientRepository;
    
    @Autowired
    private AppointmentRepository appointmentRepository;
    
    @Transactional
    public Doctor approveDoctorRegistration(UUID doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        doctor.setApprovalStatus(ApprovalStatus.APPROVED);
        return doctorRepository.save(doctor);
    }
    
    @Transactional
    public Doctor rejectDoctorRegistration(UUID doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        doctor.setApprovalStatus(ApprovalStatus.REJECTED);
        return doctorRepository.save(doctor);
    }
    
    @Transactional
    public User updateUserStatus(UUID userId, Boolean isActive) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsActive(isActive);
        return userRepository.save(user);
    }
    
    public Map<String, Object> getSystemStatistics() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalPatients", patientRepository.count());
        stats.put("totalDoctors", doctorRepository.count());
        stats.put("approvedDoctors", doctorRepository.findByApprovalStatus(ApprovalStatus.APPROVED).size());
        stats.put("pendingDoctors", doctorRepository.findByApprovalStatus(ApprovalStatus.PENDING).size());
        stats.put("totalAppointments", appointmentRepository.count());
        stats.put("scheduledAppointments", appointmentRepository.countByStatus(AppointmentStatus.SCHEDULED));
        stats.put("completedAppointments", appointmentRepository.countByStatus(AppointmentStatus.COMPLETED));
        stats.put("cancelledAppointments", appointmentRepository.countByStatus(AppointmentStatus.CANCELLED));
        return stats;
    }
    
    public Map<String, Object> getAppointmentStatistics() {
        Map<String, Object> stats = new HashMap<>();
        long scheduled = appointmentRepository.countByStatus(AppointmentStatus.SCHEDULED);
        long confirmed = appointmentRepository.countByStatus(AppointmentStatus.CONFIRMED);
        long completed = appointmentRepository.countByStatus(AppointmentStatus.COMPLETED);
        long cancelled = appointmentRepository.countByStatus(AppointmentStatus.CANCELLED);
        long noShow = appointmentRepository.countByStatus(AppointmentStatus.NO_SHOW);
        
        stats.put("scheduled", scheduled);
        stats.put("confirmed", confirmed);
        stats.put("completed", completed);
        stats.put("cancelled", cancelled);
        stats.put("noShow", noShow);
        stats.put("total", scheduled + confirmed + completed + cancelled + noShow);
        return stats;
    }
    
    public Map<String, Object> getSystemHealth() {
        Map<String, Object> health = new HashMap<>();
        try {
            long userCount = userRepository.count();
            health.put("databaseStatus", "UP");
            health.put("databaseConnection", true);
            health.put("recordsCount", userCount);
        } catch (Exception e) {
            health.put("databaseStatus", "DOWN");
            health.put("databaseConnection", false);
            health.put("databaseError", e.getMessage());
        }
        health.put("timestamp", LocalDateTime.now().toString());
        health.put("status", "OPERATIONAL");
        return health;
    }
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
