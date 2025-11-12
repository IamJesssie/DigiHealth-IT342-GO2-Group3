package com.digihealth.backend.service;

import com.digihealth.backend.dto.LoginRequest;
import com.digihealth.backend.dto.RegisterDto;
import com.digihealth.backend.entity.Doctor;
import com.digihealth.backend.entity.Role;
import com.digihealth.backend.entity.User;
import com.digihealth.backend.repository.DoctorRepository;
import com.digihealth.backend.repository.UserRepository;
import com.digihealth.backend.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;

    @Autowired
    public AuthService(UserRepository userRepository, DoctorRepository doctorRepository, PasswordEncoder passwordEncoder, JwtTokenProvider tokenProvider, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.authenticationManager = authenticationManager;
    }

    public void registerUser(RegisterDto registerDto) {
        if (userRepository.existsByEmail(registerDto.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already exists");
        }

        User user = new User();
        user.setFullName(registerDto.getFullName());
        user.setEmail(registerDto.getEmail());
        user.setPasswordHash(passwordEncoder.encode(registerDto.getPassword()));
        user.setRole(Role.PATIENT); // Default role for registration

        userRepository.save(user);
    }

    public void registerDoctor(RegisterDto registerDto) {
        if (userRepository.existsByEmail(registerDto.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already exists");
        }

        System.out.println("[AuthService.registerDoctor] Creating new user...");
        
        User user = new User();
        user.setFullName(registerDto.getFullName());
        user.setEmail(registerDto.getEmail());
        user.setPasswordHash(passwordEncoder.encode(registerDto.getPassword()));
        user.setPhoneNumber(registerDto.getPhoneNumber());
        user.setRole(Role.DOCTOR); // Set role to DOCTOR

        System.out.println("[AuthService.registerDoctor] User before save - ID: " + user.getId());
        
        user = userRepository.save(user);
        
        System.out.println("[AuthService.registerDoctor] User after save - ID: " + user.getId());
        System.out.println("[AuthService.registerDoctor] User after save - Email: " + user.getEmail());

        Doctor doctor = new Doctor();
        doctor.setUser(user);
        doctor.setSpecialization(registerDto.getSpecialization());
        doctor.setLicenseNumber(registerDto.getLicenseNumber());

        doctorRepository.save(doctor);
        
        System.out.println("[AuthService.registerDoctor] Doctor saved successfully for user ID: " + user.getId());
    }

    public String login(LoginRequest loginRequest) {
        // Defensive null check to avoid 500s on malformed/missing body
        if (loginRequest == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email and password are required");
        }

        String email = loginRequest.getEmail();
        String password = loginRequest.getPassword();

        if (email == null || email.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email and password are required");
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
        } catch (Exception ex) {
            // Any authentication failure (including bad credentials) is reported as 401
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        // Critical debugging
        System.out.println("[AuthService.login] User loaded from DB:");
        System.out.println("[AuthService.login]   ID: " + user.getId());
        System.out.println("[AuthService.login]   Email: " + user.getEmail());
        System.out.println("[AuthService.login]   Role: " + user.getRole());
        
        // Ensure we never produce a token for an invalid user object
        if (user.getId() == null) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "User identifier is missing");
        }

        String token = tokenProvider.generateTokenFromUser(user);
        System.out.println("[AuthService.login] Generated JWT token (first 50 chars): " + token.substring(0, Math.min(50, token.length())));
        System.out.println("[AuthService.login] Token should contain UUID: " + user.getId());

        return token;
    }
}