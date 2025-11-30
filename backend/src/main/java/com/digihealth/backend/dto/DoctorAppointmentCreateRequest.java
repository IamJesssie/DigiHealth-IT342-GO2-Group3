package com.digihealth.backend.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Data
public class DoctorAppointmentCreateRequest {
    private UUID patientId;
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;
    private Integer durationMinutes;
    private String notes;
    private String symptoms;
    private String status;
    private Boolean followUpRequired;
    private LocalDate followUpDate;
}
