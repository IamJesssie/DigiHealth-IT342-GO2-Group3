package com.digihealth.backend.dto.response;

import lombok.*;
import java.math.BigDecimal;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorResponse {
    private UUID doctorId;
    private String firstName;
    private String lastName;
    private String email;
    private String specialization;
    private String approvalStatus;
    private BigDecimal consultationFee;
    private String bio;
    private Integer experienceYears;
    private String hospitalAffiliation;
}
