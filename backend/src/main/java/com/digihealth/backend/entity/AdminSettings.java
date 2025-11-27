package com.digihealth.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "admin_settings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Clinic Information
    private String clinicName;
    private String email;
    private String phone;
    private String address;
    private String city;
    private String state;
    private String zip;
    @Column(length = 1000)
    private String description;

    // Appointment Policies
    private Integer appointmentSlotMinutes;
    private Integer maxAdvanceDays;
    private Integer minAdvanceHours;
    private Integer cancelDeadlineHours;
    private Boolean autoConfirmAppointments;
    private Boolean allowSameDayBooking;

    // Notification Settings
    private Boolean notifEmail;
    private Boolean notifSms;
    private Boolean notifDoctorOnNew;
    private Boolean notifPatientOnConfirm;
    private Boolean notifOnCancellation;
    private Integer reminderHoursBefore;

    // System Settings
    private Boolean maintenanceMode;
    private Boolean allowNewRegistrations;
    private Boolean requireEmailVerification;
    private Integer sessionTimeoutMinutes;
    private Integer maxLoginAttempts;
}
