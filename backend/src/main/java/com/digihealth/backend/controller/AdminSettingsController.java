package com.digihealth.backend.controller;

import com.digihealth.backend.dto.AdminSettingsDto;
import com.digihealth.backend.entity.AdminSettings;
import com.digihealth.backend.repository.AdminSettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/settings-legacy")
@org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
public class AdminSettingsController {

    @Autowired
    private AdminSettingsRepository adminSettingsRepository;

    @GetMapping
    public ResponseEntity<AdminSettings> getSettings() {
        AdminSettings settings = adminSettingsRepository.findAll().stream().findFirst().orElseGet(() -> {
            AdminSettings s = new AdminSettings();
            s.setClinicName("DigiHealth Medical Center");
            s.setEmail("info@digihealth.com");
            s.setPhone("+1-555-0100");
            s.setAddress("123 Healthcare Avenue, Medical District");
            s.setCity("New York");
            s.setState("NY");
            s.setZip("10001");
            s.setDescription("Providing quality healthcare services with advanced technology");

            s.setAppointmentSlotMinutes(30);
            s.setMaxAdvanceDays(30);
            s.setMinAdvanceHours(2);
            s.setCancelDeadlineHours(24);
            s.setAutoConfirmAppointments(true);
            s.setAllowSameDayBooking(true);

            s.setNotifEmail(true);
            s.setNotifSms(false);
            s.setNotifDoctorOnNew(true);
            s.setNotifPatientOnConfirm(true);
            s.setNotifOnCancellation(true);
            s.setReminderHoursBefore(24);

            s.setMaintenanceMode(false);
            s.setAllowNewRegistrations(true);
            s.setRequireEmailVerification(true);
            s.setSessionTimeoutMinutes(60);
            s.setMaxLoginAttempts(5);
            return adminSettingsRepository.save(s);
        });
        return ResponseEntity.ok(settings);
    }

    @PutMapping
    public ResponseEntity<AdminSettings> updateSettings(@RequestBody AdminSettingsDto dto) {
        AdminSettings settings = adminSettingsRepository.findAll().stream().findFirst().orElseGet(AdminSettings::new);

        settings.setClinicName(dto.getClinicName());
        settings.setEmail(dto.getEmail());
        settings.setPhone(dto.getPhone());
        settings.setAddress(dto.getAddress());
        settings.setCity(dto.getCity());
        settings.setState(dto.getState());
        settings.setZip(dto.getZip());
        settings.setDescription(dto.getDescription());

        settings.setAppointmentSlotMinutes(dto.getAppointmentSlotMinutes());
        settings.setMaxAdvanceDays(dto.getMaxAdvanceDays());
        settings.setMinAdvanceHours(dto.getMinAdvanceHours());
        settings.setCancelDeadlineHours(dto.getCancelDeadlineHours());
        settings.setAutoConfirmAppointments(Boolean.TRUE.equals(dto.getAutoConfirmAppointments()));
        settings.setAllowSameDayBooking(Boolean.TRUE.equals(dto.getAllowSameDayBooking()));

        settings.setNotifEmail(Boolean.TRUE.equals(dto.getNotifEmail()));
        settings.setNotifSms(Boolean.TRUE.equals(dto.getNotifSms()));
        settings.setNotifDoctorOnNew(Boolean.TRUE.equals(dto.getNotifDoctorOnNew()));
        settings.setNotifPatientOnConfirm(Boolean.TRUE.equals(dto.getNotifPatientOnConfirm()));
        settings.setNotifOnCancellation(Boolean.TRUE.equals(dto.getNotifOnCancellation()));
        settings.setReminderHoursBefore(dto.getReminderHoursBefore());

        settings.setMaintenanceMode(Boolean.TRUE.equals(dto.getMaintenanceMode()));
        settings.setAllowNewRegistrations(Boolean.TRUE.equals(dto.getAllowNewRegistrations()));
        settings.setRequireEmailVerification(Boolean.TRUE.equals(dto.getRequireEmailVerification()));
        settings.setSessionTimeoutMinutes(dto.getSessionTimeoutMinutes());
        settings.setMaxLoginAttempts(dto.getMaxLoginAttempts());

        AdminSettings saved = adminSettingsRepository.save(settings);
        return ResponseEntity.ok(saved);
    }
}
