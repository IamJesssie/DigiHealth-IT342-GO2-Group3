package com.digihealth.backend.dto.response;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponse {
    private String message;
    private Object data;
    
    public MessageResponse(String message) {
        this.message = message;
    }
}
