package com.digihealth.backend.dto.response;

import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    private UUID userId;
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String role;
    private String profileImageUrl;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
