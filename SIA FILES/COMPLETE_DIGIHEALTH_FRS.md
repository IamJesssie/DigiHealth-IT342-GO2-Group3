# DigiHealth - Complete System Documentation
## Functional Requirements & Use Cases for All User Roles

**Version:** 1.0  
**Date:** November 26, 2025  
**System:** DigiHealth Healthcare Appointment Management System

---

## 📋 TABLE OF CONTENTS

1. [System Overview](#system-overview)
2. [User Roles](#user-roles)
3. [Patient Mobile App](#patient-mobile-app)
4. [Doctor Web Portal](#doctor-web-portal)
5. [Admin Web Portal](#admin-web-portal)
6. [Integration Points](#integration-points)
7. [Data Model](#data-model)
8. [Security & Compliance](#security--compliance)

---

## 🏥 SYSTEM OVERVIEW

**DigiHealth** is a comprehensive healthcare appointment management system that connects patients, doctors, and system administrators through a multi-platform solution:

- **Patient Mobile App** (iOS/Android) - For patients to book appointments, view medical records, and manage their healthcare
- **Doctor Web Portal** (Web Application) - For doctors to manage schedules, appointments, and patient records
- **Admin Web Portal** (Web Application) - For system administrators to manage users, configure settings, and monitor system health

### System Architecture
```
┌─────────────────┐
│  Patient Mobile │
│   (iOS/Android) │
└────────┬────────┘
         │
         │   HTTPS/REST API
         │
    ┌────▼─────────────────┐
    │   Backend Server     │
    │   (API Gateway)      │
    │   Authentication     │
    │   Business Logic     │
    └────┬─────────┬───────┘
         │         │
         │         │
┌────────▼───┐ ┌──▼────────┐
│   Doctor   │ │   Admin   │
│ Web Portal │ │Web Portal │
└────────────┘ └───────────┘
         │         │
         └────┬────┘
              │
         ┌────▼─────┐
         │ Database │
         │(Supabase)│
         └──────────┘
```

---

## 👥 USER ROLES

### 1. Patient
- **Platform:** Mobile App (iOS/Android)
- **Access Level:** Own data only
- **Primary Functions:**
  - Register and login
  - Browse and search doctors
  - Book, view, cancel, reschedule appointments
  - View medical records
  - Update profile and settings
  - Rate and review doctors
  - Emergency contact access

### 2. Doctor
- **Platform:** Web Application
- **Access Level:** Assigned patients only
- **Primary Functions:**
  - Register and login (requires admin approval)
  - Manage weekly schedule and availability
  - View and manage appointments
  - Add consultation notes and prescriptions
  - View assigned patient records
  - Update profile settings

### 3. System Administrator
- **Platform:** Web Application
- **Access Level:** System-wide
- **Primary Functions:**
  - Approve/reject doctor registrations
  - View all patients and appointments
  - Configure clinic settings
  - Set appointment policies
  - Manage notification settings
  - Monitor system health
  - View error logs and analytics

---

## 📱 PATIENT MOBILE APP

### Functional Requirements

#### FR-1: Patient Registration
**Status:** 🔴 NOT IMPLEMENTED (Mobile App)

**Description:** The system shall allow patients to register using either Google OAuth 2.0 authentication or manual form input.

**Acceptance Criteria:**
- Two registration methods: Google OAuth 2.0 or Manual Form
- Required fields: Name, Email, Password, Phone, Emergency Contact
- Medical profile: DOB, Gender, Blood Type, Allergies, Conditions, Medications
- Email validation and password strength requirements
- Unique patient ID generation
- Confirmation email sent
- Account immediately active

---

#### FR-2: Patient Login
**Status:** 🔴 NOT IMPLEMENTED (Mobile App)

**Description:** The system shall allow registered patients to log in using Google OAuth 2.0 or email/password.

**Acceptance Criteria:**
- Two login methods: Google Sign-In or Email/Password
- Password masking
- "Remember Me" option
- "Forgot Password" functionality
- Failed login attempt limit (5 attempts, 15 min lockout)
- Biometric login support (fingerprint/face ID)
- Session token management

---

#### FR-5: Appointment Booking
**Status:** 🔴 NOT IMPLEMENTED (Mobile App)

**Description:** The system shall allow patients to browse available doctors, view time slots, and book appointments.

**Acceptance Criteria:**
- Browse all approved doctors with photos, specialization, rating
- Search by doctor name
- Filter by specialization
- View doctor profiles and bios
- Calendar view of available slots
- Select appointment type (General, Follow-up, Emergency)
- Add reason for visit
- Appointment confirmation
- Notifications to patient and doctor
- Appointment appears in both dashboards

---

#### FR-P1: Patient Dashboard
**Status:** 🔴 NOT IMPLEMENTED (Mobile App)

**Description:** Personalized dashboard with upcoming appointments, quick actions, and health summary.

**Features:**
- Welcome message
- Upcoming appointments (next 3)
- Quick action buttons
- Health summary card
- Recent notifications
- Easy navigation

---

#### FR-P2: My Appointments
**Status:** 🔴 NOT IMPLEMENTED (Mobile App)

**Description:** View and manage appointments.

**Features:**
- Tabs: Upcoming, Past, Cancelled
- Appointment cards with all details
- Cancel appointment
- Reschedule appointment
- Add to calendar
- Set reminders

---

#### FR-P3: Medical Records
**Status:** 🔴 NOT IMPLEMENTED (Mobile App)

**Description:** View consultation history and medical notes.

**Features:**
- Records grouped by date
- View diagnosis, prescriptions, notes
- Search and filter records
- Download as PDF
- Share via email/messaging

---

#### FR-P4: Doctor Profiles & Search
**Status:** 🔴 NOT IMPLEMENTED (Mobile App)

**Description:** Comprehensive doctor search and profiles.

**Features:**
- Advanced search and filters
- Doctor cards with ratings
- Full doctor profiles
- Patient reviews
- Available time slots

---

#### FR-P5: Profile Management
**Status:** 🔴 NOT IMPLEMENTED (Mobile App)

**Description:** Update personal and medical information.

**Features:**
- Edit personal info
- Update medical profile
- Change password
- Notification preferences
- Privacy settings
- Delete account

---

### Use Cases

#### UC1: Patient Registration
**Main Flow:**
1. Open DigiHealth app
2. Choose registration method (Google/Email)
3. Enter personal information
4. Complete medical profile
5. Accept terms and privacy policy
6. System creates account
7. Confirmation email sent
8. Redirect to dashboard

---

#### UC2: Patient Login
**Main Flow:**
1. Open app
2. Choose login method (Google/Email)
3. Enter credentials
4. System validates
5. Session token generated
6. Redirect to dashboard

---

#### UC5: Browse Doctors and Book Appointment
**Main Flow:**
1. Tap "Book Appointment"
2. Browse/search doctors
3. Apply filters (specialization, rating, availability)
4. View doctor profile
5. Select date from calendar
6. Choose time slot
7. Select appointment type
8. Add reason for visit
9. Review summary
10. Confirm booking
11. Receive confirmation notification
12. Doctor receives notification
13. Appointment appears in both dashboards

---

#### UC-P1: View and Manage Appointments
**Main Flow:**
1. Navigate to "My Appointments"
2. View appointments by tab (Upcoming/Past/Cancelled)
3. Tap appointment for details
4. Options:
   - Cancel (with confirmation)
   - Reschedule (opens booking flow)
   - Add to calendar

---

#### UC-P2: View Medical Records
**Main Flow:**
1. Navigate to "Medical Records"
2. View records list
3. Tap record to view details
4. View diagnosis, prescriptions, notes
5. Options:
   - Download PDF
   - Share record
   - Print

---

#### UC-P3: Update Profile and Settings
**Main Flow:**
1. Navigate to Profile/Settings
2. Select section to update:
   - Personal Information
   - Medical Information
   - Account Settings
   - Notification Preferences
3. Make changes
4. Save
5. System validates and updates

---

## 💻 DOCTOR WEB PORTAL

### Functional Requirements

#### FR-3: Doctor Registration
**Status:** ✅ FULLY IMPLEMENTED

**Description:** Doctors register with credentials for admin approval.

**Acceptance Criteria:**
- Registration form with name, specialization, license, contact
- Admin approval required before activation
- Status tracking (pending/approved/rejected)
- Email notifications on approval/rejection

**Implementation:** `DoctorRegistration.tsx`

---

#### FR-4: Doctor Login and Schedule Management
**Status:** ✅ FULLY IMPLEMENTED

**Description:** Doctors login and manage schedules.

**Acceptance Criteria:**
- Secure login with credentials
- Dashboard with appointments and patients
- Schedule management tools
- Adjust availability and booking slots

**Implementation:** `DoctorLogin.tsx`, `DoctorScheduleManagement.tsx`

---

#### FR-6: Appointment Management
**Status:** ✅ FULLY IMPLEMENTED

**Description:** View and manage appointments.

**Acceptance Criteria:**
- View all scheduled appointments
- Mark as completed with notes
- Mark as cancelled
- Real-time status updates
- Filter by status

**Implementation:** `AppointmentManagement.tsx`, `AppointmentDetailsModal.tsx`

---

#### FR-7: Patient Record Management
**Status:** ✅ FULLY IMPLEMENTED

**Description:** View and update patient records.

**Acceptance Criteria:**
- View patient records (assigned only)
- Add/edit consultation notes
- Add prescriptions and observations
- View appointment history
- Search patients by name/ID

**Implementation:** `PatientManagement.tsx`, `MedicalNotesModal.tsx`

---

### Use Cases

#### UC3: Doctor Registration
**Status:** ✅ FULLY IMPLEMENTED

**Main Flow:**
1. Access DigiHealth web portal
2. Select "Register"
3. Provide credentials (name, specialization, license, contact, availability)
4. Submit registration
5. System forwards to administrator
6. Admin reviews and approves/rejects
7. System activates account
8. Doctor receives approval email

---

#### UC4: Doctor Login and Dashboard Access
**Status:** ✅ FULLY IMPLEMENTED

**Main Flow:**
1. Access DigiHealth web dashboard
2. Enter login credentials
3. System validates credentials
4. Display personalized dashboard
5. View upcoming appointments and patients
6. Manage schedule and availability

---

#### UC6: Manage Appointments
**Status:** ✅ FULLY IMPLEMENTED

**Main Flow:**
1. Access appointment management section
2. View list of appointments
3. Select appointment
4. Options:
   - Mark as completed (with consultation notes)
   - Mark as cancelled
5. System updates status
6. Notifications sent to patient

---

#### UC7: Patient Record Management
**Status:** ✅ FULLY IMPLEMENTED

**Main Flow:**
1. Select patient from dashboard
2. View patient information
3. View previous consultation notes
4. Add new medical notes:
   - Diagnosis
   - Prescriptions
   - Clinical observations
   - Follow-up instructions
5. Save and update record
6. Access restricted to assigned doctor only

---

## 🛡️ ADMIN WEB PORTAL

### Functional Requirements

#### FR-8: Role-Based Access Control
**Status:** ✅ FULLY IMPLEMENTED

**Description:** Three user types with specific permissions.

**Acceptance Criteria:**
- Patient, Doctor, Admin roles
- Separate dashboards
- Permission-based access
- Data visibility restrictions

**Implementation:** `RoleSelector.tsx`, `AdminLogin.tsx`, `DoctorLogin.tsx`

---

#### FR-9: Administrator Management
**Status:** ⚠️ MOSTLY IMPLEMENTED (90%)

**Description:** Manage users and system configuration.

**Acceptance Criteria:**
- ✅ Approve doctor accounts
- ✅ Reject doctor accounts
- ✅ Configure clinic details
- ✅ Define appointment policies
- ✅ Notification settings
- ✅ System settings
- ❌ Deactivate user accounts (UI ready, needs backend)

**Implementation:** `AdminDashboard.tsx`, `AdminSettings.tsx`

---

#### FR-10: System Reports and Analytics
**Status:** ⚠️ PARTIALLY IMPLEMENTED (70%)

**Description:** Generate summary reports and statistics.

**Acceptance Criteria:**
- ✅ Appointment statistics (counts)
- ✅ Patient registration counts
- ✅ Doctor activity metrics
- ❌ Visual charts/graphs (numbers only)
- ❌ Export reports (CSV/PDF)
- ❌ Date range filtering

**Implementation:** `AdminDashboard.tsx` (Analytics tab)

---

#### FR-12: Admin System Monitoring
**Status:** ✅ FULLY IMPLEMENTED

**Description:** System status dashboard and health monitoring.

**Acceptance Criteria:**
- ✅ System uptime, CPU, memory, disk usage
- ✅ Component status (database, API, services)
- ✅ Database connection status
- ✅ API health checks
- ✅ Error logs viewing

**Implementation:** `SystemMonitoring.tsx`

---

### Use Cases

#### UC8: User and System Management
**Status:** ⚠️ MOSTLY IMPLEMENTED (95%)

**Main Flow:**
1. Admin logs in to web dashboard
2. Review pending doctor registrations
3. Approve or reject accounts
4. Update clinic settings:
   - Clinic information
   - Booking policies
   - System hours
   - Notification preferences
5. System saves all changes

**Missing:** Deactivate existing user accounts

---

#### UC9: Generate Reports and Analytics
**Status:** ⚠️ PARTIALLY IMPLEMENTED (70%)

**Main Flow:**
1. Access reporting and analytics module
2. System retrieves data
3. Display statistics:
   - Total patients
   - Total appointments
   - Doctor activity metrics
4. View reports

**Missing:** Visual charts, export functionality, audit logging

---

## 🔗 INTEGRATION POINTS

### Patient ↔ Doctor
- **Appointment Booking:** Patient books → Doctor receives notification
- **Appointment Status:** Doctor updates → Patient sees real-time change
- **Medical Notes:** Doctor adds notes → Patient can view in medical records
- **Reviews:** Patient submits review → Appears on doctor profile

### Patient ↔ Admin
- **Patient Registration:** Auto-approved, no admin intervention
- **Appointments:** Admin can view all patient appointments system-wide

### Doctor ↔ Admin
- **Doctor Registration:** Doctor submits → Admin approves/rejects
- **Account Status:** Admin can deactivate doctor accounts
- **Settings:** Admin configures policies that affect doctor schedules

### All Roles ↔ Notifications
- **Email Notifications:** Confirmation, reminders, updates
- **Push Notifications:** Mobile app (patients)
- **In-App Notifications:** Web portals (doctors, admins)

---

## 💾 DATA MODEL

### User Tables

#### **patients**
```sql
id: UUID (Primary Key)
full_name: VARCHAR
email: VARCHAR (Unique)
phone: VARCHAR
password_hash: VARCHAR
google_id: VARCHAR (Nullable)
profile_picture: VARCHAR
emergency_contact_name: VARCHAR
emergency_contact_phone: VARCHAR
date_of_birth: DATE
gender: ENUM('Male', 'Female', 'Other')
blood_type: VARCHAR
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

#### **doctors**
```sql
id: UUID (Primary Key)
full_name: VARCHAR
email: VARCHAR (Unique)
phone: VARCHAR
password_hash: VARCHAR
specialization: VARCHAR
license_number: VARCHAR (Unique)
status: ENUM('pending', 'approved', 'rejected', 'inactive')
bio: TEXT
education: TEXT
experience_years: INTEGER
profile_picture: VARCHAR
created_at: TIMESTAMP
approved_at: TIMESTAMP
approved_by: UUID (FK: admins)
```

#### **admins**
```sql
id: UUID (Primary Key)
full_name: VARCHAR
email: VARCHAR (Unique)
password_hash: VARCHAR
role: ENUM('super_admin', 'admin')
created_at: TIMESTAMP
```

### Medical Tables

#### **medical_profiles**
```sql
id: UUID (Primary Key)
patient_id: UUID (FK: patients)
allergies: TEXT[]
medical_conditions: TEXT[]
current_medications: TEXT[]
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

#### **medical_records**
```sql
id: UUID (Primary Key)
patient_id: UUID (FK: patients)
doctor_id: UUID (FK: doctors)
appointment_id: UUID (FK: appointments)
diagnosis: TEXT
prescription: TEXT
clinical_notes: TEXT
follow_up_instructions: TEXT
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

### Appointment Tables

#### **appointments**
```sql
id: UUID (Primary Key)
patient_id: UUID (FK: patients)
doctor_id: UUID (FK: doctors)
appointment_date: DATE
appointment_time: TIME
type: ENUM('General', 'Follow-up', 'Emergency')
status: ENUM('Pending', 'Confirmed', 'Completed', 'Cancelled')
reason: TEXT
cancellation_reason: TEXT (Nullable)
created_at: TIMESTAMP
updated_at: TIMESTAMP
cancelled_at: TIMESTAMP (Nullable)
```

#### **doctor_schedules**
```sql
id: UUID (Primary Key)
doctor_id: UUID (FK: doctors)
day_of_week: ENUM('Monday', 'Tuesday', ..., 'Sunday')
is_available: BOOLEAN
created_at: TIMESTAMP
```

#### **time_slots**
```sql
id: UUID (Primary Key)
schedule_id: UUID (FK: doctor_schedules)
start_time: TIME
end_time: TIME
is_available: BOOLEAN
```

### Review Tables

#### **reviews**
```sql
id: UUID (Primary Key)
patient_id: UUID (FK: patients)
doctor_id: UUID (FK: doctors)
appointment_id: UUID (FK: appointments)
overall_rating: INTEGER (1-5)
professionalism_rating: INTEGER (1-5)
communication_rating: INTEGER (1-5)
wait_time_rating: INTEGER (1-5)
review_text: TEXT (Nullable)
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

### System Tables

#### **notifications**
```sql
id: UUID (Primary Key)
user_id: UUID
user_type: ENUM('patient', 'doctor', 'admin')
type: VARCHAR
title: VARCHAR
message: TEXT
is_read: BOOLEAN
created_at: TIMESTAMP
```

#### **system_settings**
```sql
id: UUID (Primary Key)
setting_key: VARCHAR (Unique)
setting_value: TEXT
updated_at: TIMESTAMP
updated_by: UUID (FK: admins)
```

---

## 🔒 SECURITY & COMPLIANCE

### Authentication
- **JWT Tokens:** For session management
- **OAuth 2.0:** Google Sign-In integration
- **Password Hashing:** bcrypt (minimum cost factor 10)
- **Biometric:** Support for Touch ID/Face ID (mobile)
- **Session Timeout:** 60 minutes of inactivity
- **Max Login Attempts:** 5 attempts, 15-minute lockout

### Authorization
- **Role-Based Access Control (RBAC):**
  - Patients: Own data only
  - Doctors: Assigned patients only
  - Admins: System-wide access
- **API Endpoint Protection:** JWT middleware
- **Data Filtering:** Server-side enforcement

### Data Protection
- **Encryption in Transit:** TLS 1.3, HTTPS only
- **Encryption at Rest:** Database encryption
- **Sensitive Data:** Masked in logs
- **PII Handling:** Minimal collection, clear purpose
- **Data Retention:** Configurable retention policies

### Compliance
- **HIPAA Compliance:**
  - Patient consent for data sharing
  - Audit trails for data access
  - Secure messaging
  - Data breach notification procedures
- **GDPR Compliance:**
  - Right to access data
  - Right to delete account
  - Data portability
  - Clear privacy policy
- **Mobile App:**
  - Privacy-focused permissions
  - Opt-in for notifications
  - Clear data usage disclosure

### Audit Logging
- **User Actions Logged:**
  - Login/logout
  - Appointment creation/cancellation
  - Medical record access
  - Settings changes (admin)
- **Log Retention:** 90 days minimum
- **Access Logs:** Who accessed what data, when

---

## 📊 IMPLEMENTATION STATUS

### Overall System Completion

| Component | Completion | Notes |
|-----------|------------|-------|
| **Patient Mobile App** | 0% 🔴 | Not started - needs Figma design first |
| **Doctor Web Portal** | 95% ✅ | Fully functional, missing OAuth |
| **Admin Web Portal** | 90% ✅ | Fully functional, missing user deactivation |
| **Backend API** | 0% 🔴 | Using mock data, needs implementation |
| **Database** | 0% 🔴 | Schema designed, needs setup |
| **Authentication** | 50% ⚠️ | Email/password works, OAuth pending |
| **Notifications** | 20% ⚠️ | Basic toasts, no push/email yet |

### Feature Checklist

#### Must-Have (MVP)
- ✅ Doctor registration & login
- ✅ Doctor schedule management
- ✅ Appointment management (doctor-side)
- ✅ Medical notes & prescriptions
- ✅ Admin login
- ✅ Doctor approval workflow
- ✅ System monitoring
- ✅ Clinic settings
- 🔴 Patient registration & login
- 🔴 Patient appointment booking
- 🔴 Patient medical records view
- 🔴 Backend API implementation
- 🔴 Database setup

#### Nice-to-Have (V2)
- ⚠️ Google OAuth 2.0
- ⚠️ Visual charts/graphs
- ⚠️ Export reports (CSV/PDF)
- ⚠️ Real-time notifications
- ⚠️ User deactivation
- 🔴 Telemedicine (video calls)
- 🔴 Chat messaging
- 🔴 Payment processing
- 🔴 Insurance integration

---

## 🚀 DEVELOPMENT ROADMAP

### Phase 1: Design (Current - Week 1-2)
- ✅ Complete FRS documentation
- 🔄 Design patient mobile app in Figma
- 🔄 Create UI component library
- 🔄 Design prototype and flows

### Phase 2: Backend Development (Week 3-6)
- 🔄 Set up Supabase database
- 🔄 Create database tables and relationships
- 🔄 Implement RESTful API endpoints
- 🔄 Set up authentication (JWT + OAuth)
- 🔄 Implement authorization middleware
- 🔄 Set up email service (SendGrid/Mailgun)
- 🔄 Set up push notification service (FCM/APNs)

### Phase 3: Patient Mobile App (Week 7-14)
- 🔄 Set up React Native/Flutter project
- 🔄 Implement authentication screens
- 🔄 Build dashboard and navigation
- 🔄 Implement doctor search and profiles
- 🔄 Build appointment booking flow
- 🔄 Implement appointment management
- 🔄 Build medical records view
- 🔄 Implement profile and settings
- 🔄 Add notifications
- 🔄 Add emergency features
- 🔄 Testing and bug fixes

### Phase 4: Web Portal Integration (Week 15-16)
- 🔄 Connect doctor portal to real backend
- 🔄 Connect admin portal to real backend
- 🔄 Remove mock data
- 🔄 Test end-to-end workflows
- 🔄 Add Google OAuth to web portals
- 🔄 Implement real-time updates

### Phase 5: Testing & QA (Week 17-18)
- 🔄 Unit testing
- 🔄 Integration testing
- 🔄 Security audit
- 🔄 Performance testing
- 🔄 User acceptance testing (UAT)
- 🔄 Bug fixing

### Phase 6: Launch Preparation (Week 19-20)
- 🔄 App Store submission (iOS)
- 🔄 Google Play submission (Android)
- 🔄 Web hosting setup (Vercel/Netlify)
- 🔄 Domain configuration
- 🔄 SSL certificates
- 🔄 Monitoring setup (Sentry, Analytics)
- 🔄 Documentation and training materials
- 🔄 Marketing materials

### Phase 7: Launch! (Week 21)
- 🔄 Soft launch (beta users)
- 🔄 Monitor and fix critical bugs
- 🔄 Public launch
- 🔄 User support
- 🔄 Gather feedback

### Phase 8: Post-Launch (Ongoing)
- 🔄 Feature enhancements
- 🔄 Performance optimization
- 🔄 User feedback implementation
- 🔄 Security updates
- 🔄 Scale infrastructure as needed

---

## 📞 SUPPORT & MAINTENANCE

### Support Channels
- **Email:** support@digihealth.com
- **Phone:** +1-555-DIGI-HEALTH
- **Live Chat:** Available in app/web portal
- **Help Center:** https://help.digihealth.com
- **Status Page:** https://status.digihealth.com

### SLA (Service Level Agreement)
- **Uptime:** 99.9% guaranteed
- **Response Time:**
  - Critical issues: 1 hour
  - High priority: 4 hours
  - Medium priority: 24 hours
  - Low priority: 72 hours
- **Maintenance Windows:** Sundays 2-4 AM EST

---

## 📄 APPENDIX

### Glossary
- **Appointment:** A scheduled meeting between a patient and a doctor
- **Medical Record:** Documentation of patient's medical history and consultations
- **Consultation Notes:** Doctor's notes from an appointment
- **Time Slot:** A specific date and time available for booking
- **Specialization:** Doctor's area of medical expertise
- **OAuth 2.0:** Open authorization standard for secure login
- **JWT:** JSON Web Token for authentication
- **HIPAA:** Health Insurance Portability and Accountability Act
- **GDPR:** General Data Protection Regulation

### References
- [HIPAA Compliance Guidelines](https://www.hhs.gov/hipaa)
- [GDPR Information](https://gdpr.eu)
- [OAuth 2.0 Specification](https://oauth.net/2/)
- [React Native Documentation](https://reactnative.dev)
- [Supabase Documentation](https://supabase.com/docs)

---

## ✅ APPROVAL

### Document Version History
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Nov 26, 2025 | DigiHealth Team | Initial comprehensive FRS |

### Sign-Off
- **Product Owner:** _________________ Date: _______
- **Technical Lead:** _________________ Date: _______
- **Design Lead:** _________________ Date: _______

---

**END OF DOCUMENT**

*This comprehensive FRS document serves as the single source of truth for the DigiHealth healthcare appointment management system, covering all three user roles (Patient, Doctor, Admin) and their respective platforms.*
