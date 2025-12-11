package com.digihealth.backend.repository;

import com.digihealth.backend.entity.MedicalNote;
import com.digihealth.backend.entity.Patient;
import com.digihealth.backend.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.UUID;

@Repository
public interface MedicalNoteRepository extends JpaRepository<MedicalNote, UUID> {
    List<MedicalNote> findByPatientAndDoctorOrderByCreatedAtDesc(Patient patient, Doctor doctor);
    Page<MedicalNote> findByPatientAndDoctor(Patient patient, Doctor doctor, Pageable pageable);
    List<MedicalNote> findByPatientOrderByCreatedAtDesc(Patient patient);
}
