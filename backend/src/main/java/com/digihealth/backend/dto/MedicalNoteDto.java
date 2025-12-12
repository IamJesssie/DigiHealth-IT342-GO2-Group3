package com.digihealth.backend.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class MedicalNoteDto {
    private String id;
    private String patientId;
    private String doctorId;
    private String appointmentId;
    private String appointmentType;
    private String noteText;
    private String diagnosis;
    private String prescriptions;
    private String observations;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
