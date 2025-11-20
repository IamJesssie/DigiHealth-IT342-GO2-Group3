package com.digihealth.backend.repository;

import com.digihealth.backend.entity.Patient;
import com.digihealth.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByUser(User user);
    Optional<Patient> findByUserId(Long userId);
    List<Patient> findByUserFullNameContainingIgnoreCase(String name);
}
