package com.digihealth.backend.service;

import com.digihealth.backend.dto.WorkingHoursDto;
import com.digihealth.backend.entity.DayOfWeek;
import com.digihealth.backend.entity.Doctor;
import com.digihealth.backend.entity.DoctorWorkDay;
import com.digihealth.backend.entity.User;
import com.digihealth.backend.repository.DoctorRepository;
import com.digihealth.backend.repository.DoctorWorkDayRepository;
import com.digihealth.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;


@Service
public class DoctorService {

    private static final Logger log = LoggerFactory.getLogger(DoctorService.class);

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private DoctorWorkDayRepository doctorWorkDayRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public void updateWorkingHours(WorkingHoursDto workingHoursDto) {
        log.debug("updateWorkingHours called: {}", workingHoursDto);
        if (workingHoursDto == null) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "Body is required");
        }
        if (workingHoursDto.getWorkDays() == null || workingHoursDto.getWorkDays().isEmpty()) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "workDays cannot be empty");
        }
        if (workingHoursDto.getWorkHours() == null) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "workHours is required");
        }

        User currentUser = getCurrentAuthenticatedUser();
        log.debug("Current user email: {}", currentUser.getEmail());

        Doctor doctor = doctorRepository.findByUser(currentUser)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND, "Doctor not found for current user"));
        log.debug("Updating working hours for doctorId: {}", doctor.getDoctorId());

        doctorWorkDayRepository.deleteByDoctor(doctor);
        log.debug("Existing work days deleted for doctorId: {}", doctor.getDoctorId());

        java.util.List<DoctorWorkDay> toSave = new java.util.ArrayList<>();
        for (String dayString : workingHoursDto.getWorkDays()) {
            DayOfWeek day = convertToDayOfWeek(dayString);
            WorkingHoursDto.TimeRange timeRange = workingHoursDto.getWorkHours().get(dayString);

            DoctorWorkDay workDay = new DoctorWorkDay();
            workDay.setDoctor(doctor);
            workDay.setWorkDay(day);
            if (timeRange != null) {
                workDay.setAvailableStartTime(timeRange.getStartTime());
                workDay.setAvailableEndTime(timeRange.getEndTime());
            } else {
                workDay.setAvailableStartTime("09:00");
                workDay.setAvailableEndTime("17:00");
            }
            toSave.add(workDay);
        }
        doctorWorkDayRepository.saveAll(toSave);
        log.debug("Saved {} work day entries for doctorId: {}", toSave.size(), doctor.getDoctorId());
    }

    public WorkingHoursDto getWorkingHours() {
        // Get current authenticated user
        User currentUser = getCurrentAuthenticatedUser();

        // Find doctor by user
        Doctor doctor = doctorRepository.findByUser(currentUser)
                .orElseThrow(() -> new RuntimeException("Doctor not found for current user"));

        WorkingHoursDto workingHoursDto = new WorkingHoursDto();

        // Get all work days for the doctor
        List<DoctorWorkDay> doctorWorkDays = doctorWorkDayRepository.findByDoctor(doctor);

        // Convert to workDays list and workHours map
        List<String> workDays = new ArrayList<>();
        Map<String, WorkingHoursDto.TimeRange> workHours = new HashMap<>();

        for (DoctorWorkDay workDay : doctorWorkDays) {
            String dayString = convertToStringDay(workDay.getWorkDay());
            workDays.add(dayString);

            WorkingHoursDto.TimeRange timeRange = new WorkingHoursDto.TimeRange();
            timeRange.setStartTime(workDay.getAvailableStartTime() != null ?
                workDay.getAvailableStartTime() : "09:00");
            timeRange.setEndTime(workDay.getAvailableEndTime() != null ?
                workDay.getAvailableEndTime() : "17:00");

            workHours.put(dayString, timeRange);
        }

        workingHoursDto.setWorkDays(workDays);
        workingHoursDto.setWorkHours(workHours);

        return workingHoursDto;
    }

    private DayOfWeek convertToDayOfWeek(String day) {
        try {
            // Convert full day name to enum abbreviation
            String dayAbbr = day.substring(0, 3).toUpperCase();
            return DayOfWeek.valueOf(dayAbbr);
        } catch (Exception e) {
            // Default to MON if conversion fails
            return DayOfWeek.MON;
        }
    }

    private String convertToStringDay(DayOfWeek day) {
        // Convert enum to full day name
        switch (day) {
            case MON: return "Monday";
            case TUE: return "Tuesday";
            case WED: return "Wednesday";
            case THU: return "Thursday";
            case FRI: return "Friday";
            case SAT: return "Saturday";
            case SUN: return "Sunday";
            default: return "Monday";
        }
    }

    private User getCurrentAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("No authenticated user found");
        }

        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
