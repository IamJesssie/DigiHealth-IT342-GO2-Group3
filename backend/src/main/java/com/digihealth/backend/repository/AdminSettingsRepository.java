package com.digihealth.backend.repository;

import com.digihealth.backend.entity.AdminSettings;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminSettingsRepository extends JpaRepository<AdminSettings, Long> {
}
