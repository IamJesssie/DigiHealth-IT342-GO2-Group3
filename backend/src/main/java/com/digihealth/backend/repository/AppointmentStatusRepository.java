package com.digihealth.backend.repository;

import com.digihealth.backend.entity.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AppointmentStatusRepository extends JpaRepository<AppointmentStatus, UUID> {
}