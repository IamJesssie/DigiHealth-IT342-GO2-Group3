package com.digihealth.backend.service;

import com.digihealth.backend.dto.request.AppointmentRequest;
import com.digihealth.backend.entity.*;
import com.digihealth.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;

@Service
public class AppointmentService {
    
    @Autowired
    private AppointmentRepository appointmentRepository;
    
    @Autowired
    private PatientRepository patientRepository;
    
    @Autowired
    private DoctorRepository doctorRepository;
    
    @Transactional
    public Appointment createAppointment(AppointmentRequest request) {
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        
        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        
        if (doctor.getApprovalStatus() != ApprovalStatus.APPROVED) {
            throw new RuntimeException("Doctor is not approved yet");
        }
        
        appointmentRepository.findByDoctorAndDateAndTime(
                request.getDoctorId(),
                request.getAppointmentDate(),
                request.getAppointmentTime()
        ).ifPresent(existing -> {
            if (existing.getStatus() == AppointmentStatus.SCHEDULED ||
                existing.getStatus() == AppointmentStatus.CONFIRMED) {
                throw new RuntimeException("Time slot is already booked");
            }
        });
        
        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setAppointmentTime(request.getAppointmentTime());
        appointment.setDurationMinutes(request.getDurationMinutes());
        appointment.setNotes(request.getNotes());
        appointment.setSymptoms(request.getSymptoms());
        appointment.setStatus(AppointmentStatus.SCHEDULED);
        appointment.setFollowUpRequired(false);
        
        return appointmentRepository.save(appointment);
    }
    
    public List<Appointment> getAppointmentsByPatient(UUID patientId) {
        return appointmentRepository.findByPatient_PatientId(patientId);
    }
    
    public List<Appointment> getAppointmentsByDoctor(UUID doctorId) {
        return appointmentRepository.findByDoctor_DoctorId(doctorId);
    }
    
    public Appointment getAppointmentById(UUID id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
    }
    
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }
    
    @Transactional
    public Appointment updateAppointmentStatus(UUID id, String status) {
        Appointment appointment = getAppointmentById(id);
        AppointmentStatus newStatus = AppointmentStatus.valueOf(status.toUpperCase());
        appointment.setStatus(newStatus);
        return appointmentRepository.save(appointment);
    }
    
    @Transactional
    public Appointment updateAppointmentNotes(UUID id, String notes, String symptoms) {
        Appointment appointment = getAppointmentById(id);
        if (notes != null) appointment.setNotes(notes);
        if (symptoms != null) appointment.setSymptoms(symptoms);
        return appointmentRepository.save(appointment);
    }
    
    @Transactional
    public Appointment cancelAppointment(UUID id) {
        return updateAppointmentStatus(id, "CANCELLED");
    }
    
    @Transactional
    public Appointment completeAppointment(UUID id) {
        return updateAppointmentStatus(id, "COMPLETED");
    }
}
