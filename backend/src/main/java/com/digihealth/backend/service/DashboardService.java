package com.digihealth.backend.service;

import com.digihealth.backend.dto.*;
import com.digihealth.backend.entity.*;
import com.digihealth.backend.repository.AppointmentRepository;
import com.digihealth.backend.repository.DoctorRepository;

import com.digihealth.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    private Doctor getCurrentDoctorOrNull() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Return the associated Doctor if present; otherwise null.
        return doctorRepository.findByUser(user).orElse(null);
    }

    public DashboardSummaryDto getDashboardSummaryForCurrentDoctor() {
        Doctor doctor = getCurrentDoctorOrNull();
        LocalDate today = LocalDate.now();

        if (doctor == null) {
            DashboardSummaryDto empty = new DashboardSummaryDto();
            empty.setTotalPatients(0L);
            empty.setTodayConfirmed(0L);
            empty.setTodayPending(0L);
            empty.setTodayCompleted(0L);
            return empty;
        }

        List<Appointment> todayAppointments = appointmentRepository.findByDoctorAndAppointmentDate(doctor, today);

        long totalPatients = appointmentRepository.findByDoctor(doctor).stream()
                .map(appointment -> appointment.getPatient().getPatientId())
                .distinct()
                .count();

        long todayConfirmed = todayAppointments.stream()
                .filter(app -> app.getStatus() == AppointmentStatus.CONFIRMED)
                .count();

        long todayPending = todayAppointments.stream()
                .filter(app -> app.getStatus() == AppointmentStatus.SCHEDULED)
                .count();

        long todayCompleted = todayAppointments.stream()
                .filter(app -> app.getStatus() == AppointmentStatus.COMPLETED)
                .count();

        DashboardSummaryDto dto = new DashboardSummaryDto();
        dto.setTotalPatients(totalPatients);
        dto.setTodayConfirmed(todayConfirmed);
        dto.setTodayPending(todayPending);
        dto.setTodayCompleted(todayCompleted);
        return dto;
    }

    public List<TodayAppointmentDto> getTodayAppointmentsForCurrentDoctor() {
        Doctor doctor = getCurrentDoctorOrNull();
        LocalDate today = LocalDate.now();

        if (doctor == null) {
            return List.of();
        }

        return appointmentRepository.findByDoctorAndAppointmentDate(doctor, today).stream()
                .map(this::toTodayAppointmentDto)
                .collect(Collectors.toList());
    }

    public List<TodayAppointmentDto> getUpcomingAppointmentsForCurrentDoctor() {
        Doctor doctor = getCurrentDoctorOrNull();
        LocalDate today = LocalDate.now();

        if (doctor == null) {
            return List.of();
        }

        return appointmentRepository.findByDoctor(doctor).stream()
                .filter(app -> !app.getAppointmentDate().isBefore(today))
                .sorted((a1, a2) -> {
                    int dateComparison = a1.getAppointmentDate().compareTo(a2.getAppointmentDate());
                    if (dateComparison != 0) {
                        return dateComparison;
                    }
                    return a1.getAppointmentTime().compareTo(a2.getAppointmentTime());
                })
                .map(this::toTodayAppointmentDto)
                .collect(Collectors.toList());
    }

    private TodayAppointmentDto toTodayAppointmentDto(Appointment appointment) {
        TodayAppointmentDto dto = new TodayAppointmentDto();
        dto.setId(appointment.getAppointmentId().toString());
        dto.setTime(appointment.getAppointmentTime().format(DateTimeFormatter.ofPattern("HH:mm")));
        User pUser = appointment.getPatient() != null ? appointment.getPatient().getUser() : null;
        String pName = pUser != null ? pUser.getFullName() : ("Patient " + appointment.getPatient().getPatientId().toString().substring(0,8));
        dto.setPatientName(pName);
        dto.setType(appointment.getAppointmentType() != null ? appointment.getAppointmentType() : "Consultation");
        dto.setStatus(appointment.getStatus().name());
        dto.setAppointmentDate(appointment.getAppointmentDate().toString());
        return dto;
    }

    public List<DoctorPatientDto> getPatientsForCurrentDoctor() {
        Doctor doctor = getCurrentDoctorOrNull();

        if (doctor == null) {
            return List.of();
        }

        return appointmentRepository.findByDoctor(doctor).stream()
                .collect(Collectors.groupingBy(app -> app.getPatient()))
                .entrySet().stream()
                .map(entry -> {
                    Patient patient = entry.getKey();
                    Optional<LocalDate> lastVisit = entry.getValue().stream()
                            .map(app -> app.getAppointmentDate())
                            .max(LocalDate::compareTo);

                    DoctorPatientDto dto = new DoctorPatientDto();
                    dto.setId(patient.getPatientId().toString());
                    User pUser = patient.getUser();
                    dto.setName(pUser != null ? pUser.getFullName() : ("Patient " + patient.getPatientId().toString().substring(0,8)));
                    dto.setPhone(pUser != null ? pUser.getPhoneNumber() : null);
                    dto.setEmail(pUser != null ? pUser.getEmail() : null);
                    dto.setLastVisit(lastVisit.map(date -> date.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"))).orElse(null));
                    return dto;
                })
                .distinct()
                .collect(Collectors.toList());
    }

    public List<DoctorAppointmentDto> getAppointmentsForCurrentDoctor() {
        Doctor doctor = getCurrentDoctorOrNull();

        if (doctor == null) {
            return List.of();
        }

        return appointmentRepository.findByDoctor(doctor).stream()
                .map(this::toDoctorAppointmentDto)
                .collect(Collectors.toList());
    }

    private DoctorAppointmentDto toDoctorAppointmentDto(Appointment appointment) {
        DoctorAppointmentDto dto = new DoctorAppointmentDto();
        dto.setId(appointment.getAppointmentId().toString());
        dto.setStartDateTime(appointment.getAppointmentDate().atTime(appointment.getAppointmentTime()).format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
        User pUser = appointment.getPatient() != null ? appointment.getPatient().getUser() : null;
        dto.setPatientName(pUser != null ? pUser.getFullName() : ("Patient " + appointment.getPatient().getPatientId().toString().substring(0,8)));
        dto.setPatientId(appointment.getPatient().getPatientId().toString());
        dto.setDoctorName(appointment.getDoctor().getUser().getFullName());
        dto.setType("Consultation");
        dto.setStatus(appointment.getStatus().name());
        return dto;
    }
}
