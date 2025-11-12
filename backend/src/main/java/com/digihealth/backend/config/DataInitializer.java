package com.digihealth.backend.config;

import com.digihealth.backend.entity.Appointment;
import com.digihealth.backend.entity.AppointmentStatus;
import com.digihealth.backend.entity.Doctor;
import com.digihealth.backend.entity.Patient;
import com.digihealth.backend.entity.Role;
import com.digihealth.backend.entity.User;
import com.digihealth.backend.repository.AppointmentRepository;
import com.digihealth.backend.repository.DoctorRepository;
import com.digihealth.backend.repository.PatientRepository;
import com.digihealth.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

/**
 * Seeds a demo doctor account with patients and appointments for local/integration testing.
 *
 * Credentials:
 *   Email: demo.doctor@digihealth.com
 *   Password: DemoPass123!
 *
 * This runs only when the `local` or `dev` profile is active, or when seeding is explicitly enabled.
 */
@Configuration
@Profile({"local", "dev"})
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Value("${digihealth.seed.demo-doctor.enabled:true}")
    private boolean seedDemoDoctorEnabled;

    public DataInitializer(
            UserRepository userRepository,
            DoctorRepository doctorRepository,
            PatientRepository patientRepository,
            AppointmentRepository appointmentRepository
    ) {
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.appointmentRepository = appointmentRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    @Override
    public void run(String... args) {
        if (!seedDemoDoctorEnabled) {
            return;
        }

        // Ensure idempotent seeding based on unique email
        final String demoEmail = "demo.doctor@digihealth.com";

        Optional<User> existing = userRepository.findByEmail(demoEmail);
        if (existing.isPresent()) {
            // Already seeded; no further action
            return;
        }

        // 1) Create demo doctor user
        User doctorUser = new User();
        doctorUser.setEmail(demoEmail);
        doctorUser.setFullName("Dr. Demo Integration");
        doctorUser.setPasswordHash(passwordEncoder.encode("DemoPass123!"));
        doctorUser.setRole(Role.DOCTOR);
        doctorUser.setIsActive(true);
        doctorUser.setSpecialization("Internal Medicine");
        doctorUser.setLicenseNumber("MD-DEMO-001");
        doctorUser.setPhoneNumber("+65 8000 0001");
        doctorUser = userRepository.save(doctorUser);

        // 2) Link Doctor entity (uses generated doctorId)
        Doctor doctor = new Doctor();
        doctor.setUser(doctorUser);
        doctor.setSpecialization("Internal Medicine");
        doctor.setLicenseNumber("MD-DEMO-001");
        doctorRepository.save(doctor);

        // 3) Seed patients for this doctor
        // Note: current Patient model is user-linked; for demo dashboard queries that are doctor-scoped,
        // we only need Patient entities referencing this doctor where used by services.
        // Create simple Patients with minimal required fields via User + Patient records if needed.
        // Here we attach basic demographics directly on Patient for demo purposes.
        Patient patient1 = new Patient();
        patient1.setAge(34);
        patient1.setGender(null);
        patient1.setBirthDate(LocalDate.of(1990, 3, 15));
        patientRepository.save(patient1);

        Patient patient2 = new Patient();
        patient2.setAge(39);
        patient2.setGender(null);
        patient2.setBirthDate(LocalDate.of(1985, 7, 22));
        patientRepository.save(patient2);

        // 4) Seed appointments for today tied to this doctor and patients
        LocalDate today = LocalDate.now();

        Appointment appt1 = new Appointment();
        appt1.setDoctor(doctor);
        appt1.setPatient(patient1);
        appt1.setAppointmentDate(today);
        appt1.setAppointmentTime(java.time.LocalTime.of(9, 0));
        appt1.setStatus(AppointmentStatus.CONFIRMED);
        appointmentRepository.save(appt1);

        Appointment appt2 = new Appointment();
        appt2.setDoctor(doctor);
        appt2.setPatient(patient2);
        appt2.setAppointmentDate(today);
        appt2.setAppointmentTime(java.time.LocalTime.of(10, 30));
        appt2.setStatus(AppointmentStatus.SCHEDULED);
        appointmentRepository.save(appt2);

        Appointment appt3 = new Appointment();
        appt3.setDoctor(doctor);
        appt3.setPatient(patient1);
        appt3.setAppointmentDate(today);
        appt3.setAppointmentTime(java.time.LocalTime.of(14, 0));
        appt3.setStatus(AppointmentStatus.COMPLETED);
        appointmentRepository.save(appt3);
    }
}