package com.digihealth.backend.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Type(type = "uuid-char")
    @Column(columnDefinition = "VARCHAR(36)")
    private UUID notificationId;

    @Column(nullable = false)
    private String recipientEmail;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(nullable = false)
    private String type; // e.g., APPOINTMENT_NEW, APPOINTMENT_RESCHEDULED, PATIENT_NEW

    @Column(nullable = false)
    private Boolean isRead = false;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "related_entity_id")
    private String relatedEntityId; // e.g., Appointment UUID

    @Column(name = "related_entity_date")
    private String relatedEntityDate; // e.g., 2025-12-10

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
