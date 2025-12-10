package com.digihealth.backend.service;

import com.digihealth.backend.entity.Appointment;
import com.digihealth.backend.entity.AppointmentStatus;
import com.digihealth.backend.entity.Doctor;
import com.digihealth.backend.entity.Notification;
import com.digihealth.backend.entity.Patient;
import com.digihealth.backend.repository.DoctorRepository;
import com.digihealth.backend.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;
    private final EmailService emailService;
    private final NotificationRepository notificationRepository;
    private final DoctorRepository doctorRepository;

    public void createAndSend(String recipientEmail, String title, String message, String type, String relatedEntityId, String relatedEntityDate) {
        // 1. Save to DB
        Notification notification = new Notification();
        notification.setRecipientEmail(recipientEmail);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setRelatedEntityId(relatedEntityId);
        notification.setRelatedEntityDate(relatedEntityDate);
        notificationRepository.save(notification);

        // 2. Send via WebSocket
        try {
            messagingTemplate.convertAndSendToUser(recipientEmail, "/queue/notifications", notification);
        } catch (Exception e) {
            log.error("Failed to send WebSocket notification to {}: {}", recipientEmail, e.getMessage());
        }
    }

    public void createAndSend(String recipientEmail, String title, String message, String type) {
        createAndSend(recipientEmail, title, message, type, null, null);
    }

    public void notifyNewPatient(Patient patient) {
        // Notify all doctors about new patient registration (optional, can be spammy but requested)
        List<Doctor> doctors = doctorRepository.findAll();
        for (Doctor doctor : doctors) {
            if (doctor.getUser() != null && Boolean.TRUE.equals(doctor.getUser().getIsApproved())) {
                createAndSend(
                        doctor.getUser().getEmail(),
                        "New Patient Registered",
                        "New patient " + patient.getUser().getFullName() + " has registered.",
                        "PATIENT_NEW",
                        null,
                        null
                );
            }
        }
    }

    public void notifyNewAppointment(Appointment appointment) {
        // Notify Doctor
        String doctorEmail = appointment.getDoctor().getUser().getEmail();
        createAndSend(
                doctorEmail,
                "New Appointment",
                "New appointment with " + appointment.getPatient().getUser().getFullName() + " on " + appointment.getAppointmentDate() + " at " + appointment.getAppointmentTime(),
                "APPOINTMENT_NEW",
                appointment.getAppointmentId().toString(),
                appointment.getAppointmentDate().toString()
        );

        // Send Emails
        emailService.sendNewAppointmentEmails(appointment);
    }

    public void notifyAppointmentStatusChange(Appointment appointment) {
        // Notify Patient
        String patientEmail = appointment.getPatient().getUser().getEmail();
        createAndSend(
                patientEmail,
                "Appointment Updated",
                "Your appointment status is now: " + appointment.getStatus(),
                "APPOINTMENT_" + appointment.getStatus(),
                appointment.getAppointmentId().toString(),
                appointment.getAppointmentDate().toString()
        );

        // Notify Doctor if Cancelled or Confirmed (if not already notified by new)
        String doctorEmail = appointment.getDoctor().getUser().getEmail();
        if (appointment.getStatus() == AppointmentStatus.CANCELLED || appointment.getStatus() == AppointmentStatus.CONFIRMED) {
            String message = "Appointment with " + appointment.getPatient().getUser().getFullName() + " is " + appointment.getStatus();
            if (appointment.getStatus() == AppointmentStatus.CANCELLED && appointment.getNotes() != null && !appointment.getNotes().isEmpty()) {
                message += ". " + appointment.getNotes();
            }
             createAndSend(
                doctorEmail,
                "Appointment " + appointment.getStatus(),
                message,
                "APPOINTMENT_" + appointment.getStatus(),
                appointment.getAppointmentId().toString(),
                appointment.getAppointmentDate().toString()
            );
        }

        // Send Emails
        emailService.sendStatusUpdateEmail(appointment);
    }

    public void notifyAppointmentRescheduled(Appointment appointment, LocalDate oldDate, LocalTime oldTime) {
        // Notify Doctor
        String doctorEmail = appointment.getDoctor().getUser().getEmail();
        createAndSend(
                doctorEmail,
                "Appointment Rescheduled",
                "Appointment with " + appointment.getPatient().getUser().getFullName() + " rescheduled to " + appointment.getAppointmentDate() + " " + appointment.getAppointmentTime(),
                "APPOINTMENT_RESCHEDULED",
                appointment.getAppointmentId().toString(),
                appointment.getAppointmentDate().toString()
        );

        // Notify Patient
        String patientEmail = appointment.getPatient().getUser().getEmail();
        createAndSend(
                patientEmail,
                "Appointment Rescheduled",
                "Your appointment has been rescheduled to " + appointment.getAppointmentDate() + " " + appointment.getAppointmentTime(),
                "APPOINTMENT_RESCHEDULED",
                appointment.getAppointmentId().toString(),
                appointment.getAppointmentDate().toString()
        );

        // Send Emails
        emailService.sendRescheduleEmails(appointment, oldDate, oldTime);
    }
}
