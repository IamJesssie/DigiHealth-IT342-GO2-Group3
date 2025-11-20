package com.digihealth.backend.service;

import com.digihealth.backend.entity.Doctor;
import com.digihealth.backend.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class DoctorService {
    
    @Autowired
    private DoctorRepository doctorRepository;
    
    public List<Doctor> getAvailableDoctors() {
        return doctorRepository.findByStatusAndIsAvailable(
                Doctor.DoctorStatus.APPROVED, true);
    }
    
    public List<Doctor> searchBySpecialization(String specialization) {
        return doctorRepository.findBySpecializationContainingIgnoreCaseAndStatus(
                specialization, Doctor.DoctorStatus.APPROVED);
    }
    
    public Doctor getDoctorByUserId(UUID userId) {
        return doctorRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Doctor profile not found"));
    }    
    
    public Doctor getDoctorByUserId(Long userId) {
        return doctorRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Doctor profile not found"));
    }
    
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }
    
    public List<Doctor> getPendingDoctors() {
        return doctorRepository.findByStatus(Doctor.DoctorStatus.PENDING);
    }
    
    @Transactional
    public Doctor updateAvailability(Long id, Boolean isAvailable) {
        Doctor doctor = getDoctorById(id);
        doctor.setIsAvailable(isAvailable);
        return doctorRepository.save(doctor);
    }
    
    @Transactional
    public Doctor updateDoctorProfile(Long id, Doctor doctorUpdate) {
        Doctor doctor = getDoctorById(id);
        
        if (doctorUpdate.getSpecialization() != null) {
            doctor.setSpecialization(doctorUpdate.getSpecialization());
        }
        if (doctorUpdate.getQualifications() != null) {
            doctor.setQualifications(doctorUpdate.getQualifications());
        }
        if (doctorUpdate.getYearsOfExperience() != null) {
            doctor.setYearsOfExperience(doctorUpdate.getYearsOfExperience());
        }
        if (doctorUpdate.getClinicAddress() != null) {
            doctor.setClinicAddress(doctorUpdate.getClinicAddress());
        }
        if (doctorUpdate.getConsultationFee() != null) {
            doctor.setConsultationFee(doctorUpdate.getConsultationFee());
        }
        if (doctorUpdate.getBio() != null) {
            doctor.setBio(doctorUpdate.getBio());
        }
        
        return doctorRepository.save(doctor);
    }
}
