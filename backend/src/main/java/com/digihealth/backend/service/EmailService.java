package com.digihealth.backend.service;

import com.digihealth.backend.entity.Appointment;
import com.digihealth.backend.entity.Patient;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {

  @Autowired(required = false)
  private JavaMailSender mailSender;

  public void sendStatusUpdateEmail(Appointment appointment) {
    try {
      if (mailSender == null) {
        log.warn("JavaMailSender not configured; skipping email for appointment {}", appointment.getAppointmentId());
        return;
      }

      Patient patient = appointment.getPatient();
      String patientEmail = patient.getUser().getEmail();

      SimpleMailMessage message = new SimpleMailMessage();
      message.setTo(patientEmail);
      message.setSubject("Appointment Status Update - DigiHealth");
      message.setText(String.format(
        "Dear %s,\n\nYour appointment (ID: %s) status has been updated to %s.\n\n" +
        "Date: %s\nTime: %s\nDoctor: %s\n\n" +
        "Thank you,\nDigiHealth Team",
        patient.getUser().getFullName(),
        appointment.getAppointmentId(),
        appointment.getStatus(),
        appointment.getAppointmentDate(),
        appointment.getAppointmentTime(),
        appointment.getDoctor().getUser().getFullName()
      ));

      mailSender.send(message);
      log.info("Status update email sent to {}", patientEmail);
    } catch (Exception e) {
      log.error("Failed to send email for appointment {}: {}", appointment.getAppointmentId(), e.getMessage());
    }
  }
}
