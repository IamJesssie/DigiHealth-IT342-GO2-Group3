package com.digihealth.backend.repository;

import com.digihealth.backend.entity.Doctor;
import com.digihealth.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;
import java.util.List;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, UUID> {
    Optional<Doctor> findByUser(User user);
    Optional<Doctor> findByUserId(UUID userId);
    Boolean existsByLicenseNumber(String licenseNumber);
    List<Doctor> findByStatus(Doctor.DoctorStatus status);
    List<Doctor> findByStatusAndIsAvailable(Doctor.DoctorStatus status, Boolean isAvailable);
    List<Doctor> findBySpecializationContainingIgnoreCaseAndStatus(String specialization, Doctor.DoctorStatus status);
}
