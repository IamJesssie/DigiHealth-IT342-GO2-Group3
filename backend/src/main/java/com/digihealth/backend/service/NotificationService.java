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
        
        log.info("Saved notification to DB for {}: title={}, type={}", recipientEmail, title, type);

        // 2. Send via WebSocket
        try {
            messagingTemplate.convertAndSendToUser(recipientEmail, "/queue/notifications", notification);
            log.info("Sent WebSocket notification to {}", recipientEmail);
        } catch (Exception e) {
            log.error("Failed to send WebSocket notification to {}: {}", recipientEmail, e.getMessage());
        }
    }

    public void createAndSend(String recipientEmail, String title, String message, String type) {
        createAndSend(recipientEmail, title, message, type, null, null);
    }

    public void notifyNewPatient(Patient patient) {
        // Only notify doctors if patient has an appointment with them
        // Otherwise skip notification to avoid spam
        // Note: This will be called after patient registration, so likely no appointments yet
        // Consider removing this call from registration, or defer until first appointment booking
        log.info("New patient {} registered. Notification deferred until appointment booking.", patient.getUser().getFullName());
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
        // Notify Patient - ALL status changes should notify patient
        String patientEmail = appointment.getPatient().getUser().getEmail();
        String patientName = appointment.getPatient().getUser().getFullName();
        String doctorName = appointment.getDoctor().getUser().getFullName();
        
        log.info("Sending appointment status change notification for appointment {} with status {}", 
                 appointment.getAppointmentId(), appointment.getStatus());
        
        // Create patient notification with contextual message
        String patientMessage;
        String notificationType = "APPOINTMENT_" + appointment.getStatus();
        
        if (appointment.getStatus() == AppointmentStatus.CANCELLED) {
            patientMessage = "Your appointment with Dr. " + doctorName + " on " + 
                           appointment.getAppointmentDate() + " at " + appointment.getAppointmentTime() + 
                           " has been cancelled.";
            if (appointment.getNotes() != null && !appointment.getNotes().isEmpty()) {
                patientMessage += " Reason: " + appointment.getNotes();
            }
        } else if (appointment.getStatus() == AppointmentStatus.CONFIRMED) {
            patientMessage = "Your appointment with Dr. " + doctorName + " on " + 
                           appointment.getAppointmentDate() + " at " + appointment.getAppointmentTime() + 
                           " has been confirmed.";
        } else if (appointment.getStatus() == AppointmentStatus.COMPLETED) {
            patientMessage = "Your appointment with Dr. " + doctorName + " has been completed. " +
                           "Medical records are now available.";
        } else {
            patientMessage = "Your appointment status is now: " + appointment.getStatus();
        }
        
        log.info("Notification message for patient {}: {}", patientEmail, patientMessage);
        
        createAndSend(
                patientEmail,
                "Appointment Updated",
                patientMessage,
                notificationType,
                appointment.getAppointmentId().toString(),
                appointment.getAppointmentDate().toString()
        );

        // Notify Doctor if Cancelled (patient initiated) or Completed
        String doctorEmail = appointment.getDoctor().getUser().getEmail();
        if (appointment.getStatus() == AppointmentStatus.CANCELLED) {
            String message = "Appointment with " + patientName + " on " + 
                           appointment.getAppointmentDate() + " at " + appointment.getAppointmentTime() + 
                           " is " + appointment.getStatus();
            if (appointment.getNotes() != null && !appointment.getNotes().isEmpty()) {
                message += ". Reason: " + appointment.getNotes();
            }
             createAndSend(
                doctorEmail,
                "Appointment " + appointment.getStatus(),
                message,
                notificationType,
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
