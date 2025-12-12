package com.digihealth.backend.service;

import com.digihealth.backend.dto.GoogleLoginRequest;
import com.digihealth.backend.dto.LoginRequest;
import com.digihealth.backend.dto.LoginResponse;
import com.digihealth.backend.dto.RegisterDto;
import com.digihealth.backend.dto.RegisterPatientDto;
import com.digihealth.backend.dto.UserResponse;
import com.digihealth.backend.entity.Doctor;
import com.digihealth.backend.entity.DayOfWeek;
import com.digihealth.backend.entity.DoctorWorkDay;
import com.digihealth.backend.entity.Patient;
import com.digihealth.backend.entity.Role;
import com.digihealth.backend.entity.User;
import com.digihealth.backend.repository.DoctorRepository;
import com.digihealth.backend.repository.PatientRepository;
import com.digihealth.backend.repository.UserRepository;
import com.digihealth.backend.repository.DoctorWorkDayRepository;
import com.digihealth.backend.security.JwtTokenProvider;
import com.digihealth.backend.service.NotificationService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.dao.DataIntegrityViolationException;
import java.util.Map;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;
    private final DoctorWorkDayRepository doctorWorkDayRepository;
    private final NotificationService notificationService;

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;

    public AuthService(UserRepository userRepository, DoctorRepository doctorRepository,
            PatientRepository patientRepository, PasswordEncoder passwordEncoder, JwtTokenProvider tokenProvider,
            AuthenticationManager authenticationManager, DoctorWorkDayRepository doctorWorkDayRepository, NotificationService notificationService) {
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.authenticationManager = authenticationManager;
        this.doctorWorkDayRepository = doctorWorkDayRepository;
        this.notificationService = notificationService;
    }
    public LoginResponse googleLogin(GoogleLoginRequest request) {
        // Verify Google id_token
        RestTemplate restTemplate = new RestTemplate();
        String url = "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=" + request.getIdToken();
        @SuppressWarnings("unchecked")
        Map<String, Object> tokenInfo = restTemplate.getForObject(url, Map.class);

        if (tokenInfo == null || !"true".equals(String.valueOf(tokenInfo.get("email_verified")))) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Google token");
        }

        String aud = String.valueOf(tokenInfo.get("aud"));
        String expectedClientId = googleClientId;
        if (expectedClientId == null || expectedClientId.isBlank() || !expectedClientId.equals(aud)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid client ID");
        }

        String email = normalizeEmail((String) tokenInfo.get("email"));
        String fullName = (String) tokenInfo.get("name");

        // Find existing user only (no auto-registration on login)
        var optUser = userRepository.findByEmail(email);
        User user = optUser.orElseThrow(() -> 
            new ResponseStatusException(HttpStatus.BAD_REQUEST, "Account is not registered. Please sign up."));
        
        // Role check for existing users
        if (request.getIntendedRole() != null && !request.getIntendedRole().equals(user.getRole().name())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Existing user role mismatch");
        }

        // Authorization checks
        if (!Boolean.TRUE.equals(user.getIsActive())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Account deactivated");
        }
        if (user.getRole() == Role.DOCTOR && !Boolean.TRUE.equals(user.getIsApproved())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Doctor pending approval");
        }

        String token = tokenProvider.generateTokenFromUser(user);
        UserResponse userResponse = convertToUserResponse(user);
        return new LoginResponse(token, userResponse);
    }

    public void registerUser(com.digihealth.backend.dto.RegisterPatientDto registerDto) {
        String emailNorm = normalizeEmail(registerDto.getEmail());
        if (emailNorm == null || emailNorm.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required");
        }
        if (userRepository.existsByEmail(emailNorm)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already exists");
        }

        User user = new User();
        user.setFullName(registerDto.getFullName());
        user.setEmail(emailNorm);
        user.setPhoneNumber(registerDto.getPhoneNumber());
        user.setPasswordHash(passwordEncoder.encode(registerDto.getPassword()));
        user.setRole(Role.PATIENT); // Default role for registration
        user.setIsActive(Boolean.TRUE);

        try {
            userRepository.save(user);
        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already exists");
        }

        com.digihealth.backend.entity.Patient patient = new com.digihealth.backend.entity.Patient();
        patient.setUser(user);
        patient.setEmergencyContactName(registerDto.getEmergencyContactName());
        patient.setEmergencyContactPhone(registerDto.getEmergencyContactPhone());
        patient.setBloodType(registerDto.getBloodType());
        patient.setAllergies(registerDto.getAllergies());
        patient.setMedicalConditions(registerDto.getMedicalConditions());
        patient.setCurrentMedications(registerDto.getMedications());
        if (registerDto.getBirthDate() != null) {
            patient.setBirthDate(registerDto.getBirthDate());
            try {
                java.time.LocalDate dob = registerDto.getBirthDate();
                java.time.Period period = java.time.Period.between(dob, java.time.LocalDate.now());
                int computedAge = Math.max(0, period.getYears());
                patient.setAge(computedAge);
            } catch (Exception ignored) {
            }
        } else if (registerDto.getAge() != null && registerDto.getAge() > 0) {
            // If birthDate is not provided but age is, use the provided age
            patient.setAge(registerDto.getAge());
        }
        if (registerDto.getGender() != null) {
            String g = registerDto.getGender().trim().toUpperCase();
            com.digihealth.backend.entity.Gender genderEnum;
            if ("MALE".equals(g))
                genderEnum = com.digihealth.backend.entity.Gender.MALE;
            else if ("FEMALE".equals(g))
                genderEnum = com.digihealth.backend.entity.Gender.FEMALE;
            else
                genderEnum = com.digihealth.backend.entity.Gender.OTHER;
            patient.setGender(genderEnum);
        }
        if (registerDto.getStreet() != null || registerDto.getCity() != null || registerDto.getState() != null
                || registerDto.getPostalCode() != null || registerDto.getCountry() != null) {
            com.digihealth.backend.entity.Address address = new com.digihealth.backend.entity.Address();
            address.setStreet(registerDto.getStreet());
            address.setCity(registerDto.getCity());
            address.setState(registerDto.getState());
            address.setPostalCode(registerDto.getPostalCode());
            address.setCountry(registerDto.getCountry());
            patient.setAddress(address);
        }
        patientRepository.save(patient);
        notificationService.notifyNewPatient(patient);
    }

    public void registerDoctor(RegisterDto registerDto) {
        String emailNorm = normalizeEmail(registerDto.getEmail());
        if (emailNorm == null || emailNorm.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required");
        }
        if (userRepository.existsByEmail(emailNorm)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already exists");
        }

        System.out.println("[AuthService.registerDoctor] Creating new user...");

        User user = new User();
        user.setFullName(registerDto.getFullName());
        user.setEmail(emailNorm);
        user.setPasswordHash(passwordEncoder.encode(registerDto.getPassword()));
        user.setPhoneNumber(registerDto.getPhoneNumber());
        user.setSpecialization(registerDto.getSpecialization());
        user.setLicenseNumber(registerDto.getLicenseNumber());
        user.setRole(Role.DOCTOR); // Set role to DOCTOR
        user.setIsActive(Boolean.TRUE);
        user.setIsApproved(Boolean.FALSE);

        System.out.println("[AuthService.registerDoctor] User before save - ID: " + user.getId());

        try {
            user = userRepository.save(user);
        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already exists");
        }

        System.out.println("[AuthService.registerDoctor] User after save - ID: " + user.getId());
        System.out.println("[AuthService.registerDoctor] User after save - Email: " + user.getEmail());

        Doctor doctor = new Doctor();
        doctor.setUser(user);
        doctor.setSpecialization(registerDto.getSpecialization());
        doctor.setLicenseNumber(registerDto.getLicenseNumber());
        doctor.setExperienceYears(registerDto.getExperienceYears());
        doctor.setHospitalAffiliation(registerDto.getHospitalAffiliation());
        doctor.setBio(registerDto.getBio());

        doctor = doctorRepository.save(doctor);

        System.out.println("[AuthService.registerDoctor] Doctor saved successfully for user ID: " + user.getId());

        java.util.List<DoctorWorkDay> workDays = new java.util.ArrayList<>();
        if (registerDto.getWorkDays() != null && !registerDto.getWorkDays().isEmpty()) {
            for (String dayString : registerDto.getWorkDays()) {
                DayOfWeek day;
                try {
                    day = DayOfWeek.valueOf(dayString.substring(0, 3).toUpperCase());
                } catch (Exception e) {
                    day = DayOfWeek.MON;
                }

                RegisterDto.DayAvailabilityDto avail = null;
                if (registerDto.getAvailability() != null) {
                    avail = registerDto.getAvailability().get(dayString);
                }
                String start = "09:00";
                String end = "17:00";
                if (avail != null) {
                    if (avail.getStartTime() != null) {
                        start = avail.getStartTime();
                    }
                    if (avail.getEndTime() != null) {
                        end = avail.getEndTime();
                    }
                }

                DoctorWorkDay dwd = new DoctorWorkDay();
                dwd.setDoctor(doctor);
                dwd.setWorkDay(day);
                dwd.setAvailableStartTime(start);
                dwd.setAvailableEndTime(end);
                workDays.add(dwd);
            }
        } else {
            java.util.List<DayOfWeek> defaultDays = java.util.List.of(DayOfWeek.MON, DayOfWeek.TUE, DayOfWeek.WED, DayOfWeek.THU, DayOfWeek.FRI);
            for (DayOfWeek day : defaultDays) {
                DoctorWorkDay dwd = new DoctorWorkDay();
                dwd.setDoctor(doctor);
                dwd.setWorkDay(day);
                dwd.setAvailableStartTime("09:00");
                dwd.setAvailableEndTime("17:00");
                workDays.add(dwd);
            }
        }
        doctorWorkDayRepository.saveAll(workDays);
    }

    public LoginResponse login(LoginRequest loginRequest) {
        // Defensive null check to avoid 500s on malformed/missing body
        if (loginRequest == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email and password are required");
        }

        String email = normalizeEmail(loginRequest.getEmail());
        String password = loginRequest.getPassword();

        if (email == null || email.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email and password are required");
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password));
            SecurityContextHolder.getContext().setAuthentication(authentication);
        } catch (Exception ex) {
            // Any authentication failure (including bad credentials) is reported as 401
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        // Check if doctor is approved (only for DOCTOR role)
        if (user.getRole() == Role.DOCTOR && !Boolean.TRUE.equals(user.getIsApproved())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Doctor account is pending approval. Please contact administrator.");
        }

        if (!Boolean.TRUE.equals(user.getIsActive())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Account is deactivated. Contact administrator to reactivate.");
        }

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
        System.out.println("[AuthService.login] Generated JWT token (first 50 chars): "
                + token.substring(0, Math.min(50, token.length())));
        System.out.println("[AuthService.login] Token should contain UUID: " + user.getId());

        UserResponse userResponse = convertToUserResponse(user);
        return new LoginResponse(token, userResponse);
    }

    private String normalizeEmail(String email) {
        if (email == null) return null;
        return email.trim().toLowerCase();
    }

    /**
     * Convert User entity to UserResponse DTO, excluding sensitive fields like password.
     */
    private UserResponse convertToUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getProfileImageUrl(),
                user.getSpecialization(),
                user.getLicenseNumber(),
                user.getRole() != null ? user.getRole().toString() : null,
                user.getIsActive(),
                user.getIsApproved()
        );
    }
}
