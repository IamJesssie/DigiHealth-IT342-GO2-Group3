package com.digihealth.backend.repository;

import com.digihealth.backend.entity.Appointment;
import com.digihealth.backend.entity.Doctor;
import com.digihealth.backend.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {
    List<Appointment> findByDoctorAndAppointmentDate(Doctor doctor, LocalDate date);
    List<Appointment> findByDoctor(Doctor doctor);
    List<Appointment> findByPatient(Patient patient);
}
