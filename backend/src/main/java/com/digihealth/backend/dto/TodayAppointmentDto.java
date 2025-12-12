package com.digihealth.backend.dto;

import lombok.Data;

@Data
public class TodayAppointmentDto {
    private String id;
    private String time;
    private String patientName;
    private String type;
    private String status;
    private String appointmentDate;

    // Explicit setters for tests
    public void setId(String id) {
        this.id = id;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setAppointmentDate(String appointmentDate) {
        this.appointmentDate = appointmentDate;
    }
}