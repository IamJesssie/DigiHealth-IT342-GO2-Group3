package com.digihealth.backend.controller;

import com.digihealth.backend.entity.*;
import com.digihealth.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/medical-records")
@PreAuthorize("hasRole('PATIENT')")
public class PatientMedicalRecordsController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private MedicalNoteRepository medicalNoteRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    private Patient getCurrentPatient() {
        org.springframework.security.core.Authentication authentication =
                org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return patientRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Patient profile not found for current user"));
    }

    @GetMapping("/patient/my")
    public ResponseEntity<?> getMyMedicalRecords() {
        Patient patient = getCurrentPatient();
        
        // Get all medical notes for this patient
        List<MedicalNote> notes = medicalNoteRepository.findByPatientOrderByCreatedAtDesc(patient);
        
        // Check if patient has appointments
        List<Appointment> appointments = appointmentRepository.findByPatient(patient);
        
        // Transform to response DTOs with doctor information
        List<Map<String, Object>> records = notes.stream().map(note -> {
            Map<String, Object> record = new HashMap<>();
            record.put("id", note.getNoteId().toString());
            record.put("date", note.getCreatedAt().toLocalDate().toString());
            
            // Doctor information
            Doctor doctor = note.getDoctor();
            User doctorUser = doctor.getUser();
            record.put("doctorName", doctorUser.getFullName());
            record.put("specialization", doctor.getSpecialization() != null ? doctor.getSpecialization() : doctorUser.getSpecialization());
            record.put("doctorImage", doctorUser.getProfileImageUrl() != null ? doctorUser.getProfileImageUrl() : "");
            record.put("hospitalAffiliation", doctor.getHospitalAffiliation() != null ? doctor.getHospitalAffiliation() : "");
            
            // Medical information
            String appointmentType = "Consultation";
            if (note.getAppointment() != null && note.getAppointment().getAppointmentType() != null) {
                appointmentType = note.getAppointment().getAppointmentType();
            }
            record.put("type", appointmentType);
            record.put("chiefComplaint", note.getNoteText() != null ? note.getNoteText() : "");
            record.put("diagnosis", note.getDiagnosis() != null ? note.getDiagnosis() : "");
            record.put("clinicalNotes", note.getObservations() != null ? note.getObservations() : "");
            
            // Parse prescriptions (assuming format: "Medicine 1, Medicine 2")
            List<Map<String, String>> prescriptionList = new ArrayList<>();
            if (note.getPrescriptions() != null && !note.getPrescriptions().trim().isEmpty()) {
                String[] meds = note.getPrescriptions().split("\n");
                for (String med : meds) {
                    if (!med.trim().isEmpty()) {
                        Map<String, String> prescription = new HashMap<>();
                        prescription.put("medicine", med.trim());
                        prescription.put("dosage", "As prescribed");
                        prescription.put("duration", "As prescribed");
                        prescriptionList.add(prescription);
                    }
                }
            }
            record.put("prescription", prescriptionList);
            
            // Appointment information if linked
            if (note.getAppointment() != null) {
                Appointment appointment = note.getAppointment();
                record.put("appointmentDate", appointment.getAppointmentDate().toString());
                record.put("appointmentTime", appointment.getAppointmentTime().toString());
            }
            
            // Placeholder for lab results (not implemented yet)
            record.put("labResults", new ArrayList<>());
            record.put("followUp", "");
            
            return record;
        }).collect(Collectors.toList());
        
        // Return contextual response based on appointment history
        if (records.isEmpty()) {
            if (appointments.isEmpty()) {
                // No appointments at all
                Map<String, Object> emptyResponse = new HashMap<>();
                emptyResponse.put("records", new ArrayList<>());
                emptyResponse.put("message", "No medical records yet. Book your first appointment to get started!");
                return ResponseEntity.ok(emptyResponse);
            } else {
                // Has appointments but no notes yet
                Map<String, Object> emptyResponse = new HashMap<>();
                emptyResponse.put("records", new ArrayList<>());
                emptyResponse.put("message", "No medical records yet. Consultation notes will appear after your appointments are completed.");
                return ResponseEntity.ok(emptyResponse);
            }
        }
        
        return ResponseEntity.ok(records);
    }
}
