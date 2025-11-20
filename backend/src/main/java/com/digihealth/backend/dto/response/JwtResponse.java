package com.digihealth.backend.dto.response;

import lombok.*;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JwtResponse {
    
    private String token;
    
    @Builder.Default
    private String type = "Bearer";
    
    private UUID userId;
    
    private String email;
    
    private String firstName;
    
    private String lastName;
    
    private String role;
    
    private String message;
}
