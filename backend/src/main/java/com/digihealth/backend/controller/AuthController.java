package com.digihealth.backend.controller;

import com.digihealth.backend.dto.LoginRequest;
import com.digihealth.backend.dto.LoginResponse;
import com.digihealth.backend.dto.RegisterDto;
import com.digihealth.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        LoginResponse response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterDto registerDto) {
        authService.registerDoctor(registerDto);
        return ResponseEntity.ok("Doctor registered successfully!");
    }

    @PostMapping("/register-patient")
    public ResponseEntity<?> registerPatient(@RequestBody RegisterDto registerDto) {
        authService.registerUser(registerDto);
        return ResponseEntity.ok("Patient registered successfully!");
    }
}
