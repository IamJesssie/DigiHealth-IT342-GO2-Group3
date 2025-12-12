package com.digihealth.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentBookingDto {
    private UUID doctorId;
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;
    private String reason;
    private String symptoms;
    private String appointmentType;
}
