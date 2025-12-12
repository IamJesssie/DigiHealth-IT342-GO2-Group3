package com.digihealth.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "admin_settings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminSettings implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "clinic_name")
    private String clinicName;

    @Column(name = "description")
    private String description;

    private String address;
    private String city;
    private String state;
    private String zip;

    private String email;
    private String phone;

    @Column(name = "allow_new_registrations")
    private Boolean allowNewRegistrations = true;

    @Column(name = "allow_same_day_booking")
    private Boolean allowSameDayBooking = true;

    @Column(name = "appointment_slot_minutes")
    private Integer appointmentSlotMinutes = 30;

    @Column(name = "auto_confirm_appointments")
    private Boolean autoConfirmAppointments = false;

    @Column(name = "cancel_deadline_hours")
    private Integer cancelDeadlineHours = 24;

    @Column(name = "max_advance_days")
    private Integer maxAdvanceDays = 90;

    @Column(name = "min_advance_hours")
    private Integer minAdvanceHours = 0;

    @Column(name = "maintenance_mode")
    private Boolean maintenanceMode = false;

    @Column(name = "max_login_attempts")
    private Integer maxLoginAttempts = 5;

    @Column(name = "session_timeout_minutes")
    private Integer sessionTimeoutMinutes = 30;

    @Column(name = "require_email_verification")
    private Boolean requireEmailVerification = false;

    @Column(name = "notif_doctor_on_new")
    private Boolean notifDoctorOnNew = true;

    @Column(name = "notif_patient_on_confirm")
    private Boolean notifPatientOnConfirm = true;

    @Column(name = "notif_on_cancellation")
    private Boolean notifOnCancellation = true;

    @Column(name = "notif_email")
    private Boolean notifEmail = true;

    @Column(name = "notif_sms")
    private Boolean notifSms = false;

    @Column(name = "reminder_hours_before")
    private Integer reminderHoursBefore = 24;
}