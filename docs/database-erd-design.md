# DigiHealth Database ERD Design - Increment 1

## Entity Relationship Diagram for Increment 1

### Core Entities (MVP Focus)

#### 1. User (Base Entity)
\`\`\`
User
- user_id (PK) [UUID]
- email (unique) [VARCHAR(255)]
- password_hash [VARCHAR(255)]
- role (PATIENT, DOCTOR, ADMIN) [ENUM]
- first_name [VARCHAR(100)]
- last_name [VARCHAR(100)]
- phone_number [VARCHAR(20)]
- profile_image_url [VARCHAR(500)]
- created_at [TIMESTAMP]
- updated_at [TIMESTAMP]
- is_active [BOOLEAN]
- google_oauth_id (optional) [VARCHAR(255)]
\`\`\`

#### 2. Patient (extends User)
\`\`\`
Patient
- patient_id (PK, FK to user_id) [UUID]
- age [INT]
- gender [ENUM: MALE, FEMALE, OTHER]
- allergies [TEXT]
- medical_conditions [TEXT]
- emergency_contact_name [VARCHAR(100)]
- emergency_contact_phone [VARCHAR(20)]
- blood_type [CHAR(3)]
- address_id [UUID]
- birth_date [DATE]
\`\`\`

#### 3. Doctor (extends User)
\`\`\`
Doctor
- doctor_id (PK, FK to user_id) [UUID]
- license_number (unique) [VARCHAR(50)]
- specialization [VARCHAR(100)]
- approval_status [ENUM: PENDING, APPROVED, REJECTED]
- consultation_fee [DECIMAL(10,2)]
- bio [TEXT]
- available_start_time [TIME]
- available_end_time [TIME]
- work_days [SET of days: MON, TUE, WED, THU, FRI, SAT, SUN]
- experience_years [INT]
- hospital_affiliation [VARCHAR(200)]
- address_id [UUID]
\`\`\`

#### 4. Address
\`\`\`
Address
- address_id (PK) [UUID]
- street [TEXT]
- city [VARCHAR(100)]
- state [VARCHAR(100)]
- postal_code [VARCHAR(20)]
- country [VARCHAR(100)]
\`\`\`

#### 5. Appointment
\`\`\`
Appointment
- appointment_id (PK) [UUID]
- patient_id (FK) [UUID]
- doctor_id (FK) [UUID]
- appointment_date [DATE]
- appointment_time [TIME]
- duration_minutes [INT] (default: 30)
- consultation_type [ENUM: GENERAL, CHECKUP, FOLLOW_UP]
- status [ENUM: SCHEDULED, CONFIRMED, COMPLETED, CANCELLED, NO_SHOW]
- notes [TEXT]
- symptoms [TEXT]
- follow_up_required [BOOLEAN]
- follow_up_date [DATE] (optional)
- created_at [TIMESTAMP]
- updated_at [TIMESTAMP]
\`\`\`

#### 6. MedicalRecord (for future Increment)
\`\`\`
MedicalRecord
- record_id (PK) [UUID]
- patient_id (FK) [UUID]
- doctor_id (FK) [UUID]
- appointment_id (FK) [UUID]
- diagnosis [TEXT]
- consultation_notes [TEXT]
- prescription [JSON]
- lab_results [JSON]
- vital_signs [JSON]
- treatment_plan [TEXT]
- created_at [TIMESTAMP]
- updated_at [TIMESTAMP]
\`\`\`

### Key Relationships

1.  **User to Patient**: One-to-One (User with role PATIENT has one Patient record)
2.  **User to Doctor**: One-to-One (User with role DOCTOR has one Doctor record)
3.  **Patient to Appointment**: One-to-Many (One Patient can have many Appointments)
4.  **Doctor to Appointment**: One-to-Many (One Doctor can have many Appointments)
5.  **Appointment to MedicalRecord**: One-to-One (Each completed appointment has one MedicalRecord)
6.  **Patient to Address**: One-to-One (Patient has one Address)
7.  **Doctor to Address**: One-to-One (Doctor has one Address)

### Database Indexes

\`\`\`
- idx_user_email (User.email)
- idx_user_role (User.role)
- idx_user_google_oauth (User.google_oauth_id)
- idx_patient_user_id (Patient.user_id)
- idx_doctor_user_id (Doctor.user_id)
- idx_doctor_license (Doctor.license_number)
- idx_appointment_patient (Appointment.patient_id)
- idx_appointment_doctor (Appointment.doctor_id)
- idx_appointment_date (Appointment.appointment_date)
- idx_appointment_status (Appointment.status)
\`\`\`

### Data Constraints

- Email must be unique across all users
- Phone numbers must follow Philippine format
- Doctor license number must be unique and verified
- Appointments cannot be scheduled in the past
- Patient must be at least 1 year old
- Appointment time must align with doctor's availability
- Maximum 30 patients per doctor per day (configurable)

### Enhanced ERD Diagram

\`\`\`mermaid
erDiagram
    USER {
        UUID user_id PK
        VARCHAR(255) email UNIQUE
        VARCHAR(255) password_hash
        ENUM role {
            PATIENT
            DOCTOR
            ADMIN
        }
        VARCHAR(100) first_name
        VARCHAR(100) last_name
        VARCHAR(20) phone_number
        VARCHAR(500) profile_image_url
        TIMESTAMP created_at
        TIMESTAMP updated_at
        BOOLEAN is_active
        VARCHAR(255) google_oauth_id
    }

    PATIENT {
        UUID patient_id PK
        UUID user_id FK
        INT age
        ENUM gender {
            MALE
            FEMALE
            OTHER
        }
        TEXT allergies
        TEXT medical_conditions
        VARCHAR(100) emergency_contact_name
        VARCHAR(20) emergency_contact_phone
        CHAR(3) blood_type
        UUID address_id FK
        DATE birth_date
    }

    DOCTOR {
        UUID doctor_id PK
        UUID user_id FK
        VARCHAR(50) license_number UNIQUE
        VARCHAR(100) specialization
        ENUM approval_status {
            PENDING
            APPROVED
            REJECTED
        }
        DECIMAL(10,2) consultation_fee
        TEXT bio
        TIME available_start_time
        TIME available_end_time
        SET work_days {
            MON
            TUE
            WED
            THU
            FRI
            SAT
            SUN
        }
        INT experience_years
        VARCHAR(200) hospital_affiliation
        UUID address_id FK
    }

    ADDRESS {
        UUID address_id PK
        TEXT street
        VARCHAR(100) city
        VARCHAR(100) state
        VARCHAR(20) postal_code
        VARCHAR(100) country
    }

    APPOINTMENT {
        UUID appointment_id PK
        UUID patient_id FK
        UUID doctor_id FK
        DATE appointment_date
        TIME appointment_time
        INT duration_minutes
        ENUM consultation_type
        ENUM status {
            SCHEDULED
            CONFIRMED
            COMPLETED
            CANCELLED
            NO_SHOW
        }
        TEXT notes
        TEXT symptoms
        BOOLEAN follow_up_required
        DATE follow_up_date
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    MEDICAL_RECORD {
        UUID record_id PK
        UUID patient_id FK
        UUID doctor_id FK
        UUID appointment_id FK
        TEXT diagnosis
        TEXT consultation_notes
        JSON prescription
        JSON lab_results
        JSON vital_signs
        TEXT treatment_plan
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    USER ||--o{ PATIENT : is a
    USER ||--o{ DOCTOR : is a
    PATIENT ||--o{ APPOINTMENT : books
    DOCTOR ||--o{ APPOINTMENT : schedules
    APPOINTMENT }o--|| DOCTOR : is with
    PATIENT ||--o{ MEDICAL_RECORD : has
    DOCTOR ||--o{ MEDICAL_RECORD : created
    ADDRESS ||--o{ PATIENT : lives at
    ADDRESS ||--o{ DOCTOR : works at

    %% Indexes
    %% INDEX idx_user_email (USER.email)
    %% INDEX idx_user_role (USER.role)
    %% INDEX idx_user_google_oauth (USER.google_oauth_id)
    %% INDEX idx_patient_user_id (PATIENT.user_id)
    %% INDEX idx_doctor_user_id (DOCTOR.user_id)
    %% INDEX idx_doctor_license (DOCTOR.license_number)
    %% INDEX idx_appointment_patient (APPOINTMENT.patient_id)
    %% INDEX idx_appointment_doctor (APPOINTMENT.doctor_id)
    %% INDEX idx_appointment_date (APPOINTMENT.appointment_date)
    %% INDEX idx_appointment_status (APPOINTMENT.status)
\`\`\`
