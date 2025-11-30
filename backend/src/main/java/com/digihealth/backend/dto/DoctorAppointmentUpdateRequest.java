package com.digihealth.backend.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class DoctorAppointmentUpdateRequest {
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;
    private Integer durationMinutes;
    private String status;
    private String notes;
    private String symptoms;
    private Boolean followUpRequired;
    private LocalDate followUpDate;
}
