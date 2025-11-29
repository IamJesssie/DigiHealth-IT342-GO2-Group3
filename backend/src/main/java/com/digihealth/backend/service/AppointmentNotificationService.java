package com.digihealth.backend.service;

import com.digihealth.backend.entity.Appointment;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AppointmentNotificationService {

    private final SimpMessagingTemplate messagingTemplate;
    private final EmailService emailService;

    public void notifyAppointmentStatusChange(Appointment appointment) {
        // Broadcast to all clients subscribed to appointments topic
        messagingTemplate.convertAndSend("/topic/appointments", appointment);
        
        // Send email notification to patient
        emailService.sendStatusUpdateEmail(appointment);
        
        // Also send to specific user queues if needed
        // messagingTemplate.convertAndSendToUser(appointment.getPatient().getUser().getEmail(), "/queue/appointments", appointment);
    }
}