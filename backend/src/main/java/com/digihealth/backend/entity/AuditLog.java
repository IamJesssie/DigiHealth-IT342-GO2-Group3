package com.digihealth.backend.entity;

import lombok.Data;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "audit_logs")
@Data
public class AuditLog {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Type(type = "uuid-char")
    @Column(columnDefinition = "VARCHAR(36)")
    private UUID id;

    private String operation;
    private String actorUserEmail;
    private String resourceType;
    private String resourceId;
    private LocalDateTime createdAt;
}
