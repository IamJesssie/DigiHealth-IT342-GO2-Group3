package com.digihealth.backend.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "doctor_work_days")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorWorkDay {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Type(type = "uuid-char")
    @Column(columnDefinition = "VARCHAR(36)")
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "doctor_id", referencedColumnName = "doctorId")
    private Doctor doctor;

    @Enumerated(EnumType.STRING)
    @Column(name = "work_day")
    private DayOfWeek workDay;

    @Column(name = "available_start_time", length = 10)
    private String availableStartTime;

    @Column(name = "available_end_time", length = 10)
    private String availableEndTime;
}
