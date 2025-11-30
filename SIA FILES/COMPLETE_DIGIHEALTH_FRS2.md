# DigiHealth – Complete System Documentation (MVP Normalized)

This document aligns functional requirements to the current repository implementation and replaces aspirational `.tsx` references with actual file paths. Statuses reflect the real codebase.

---

## Table of Contents
- FR-1: Patient Registration (Mobile)
- FR-2: Patient Login (Mobile)
- FR-3: Doctor Registration (Web)
- FR-4: Doctor Login and Schedule Management (Web)
- FR-5: Appointment Booking (Mobile)
- FR-6: Appointment Management (Doctor Web)
- FR-7: Patient Record Management (Doctor Web)
- FR-8: Role-Based Access Control
- FR-9: Administrator Management
- FR-10: System Reports and Analytics
- FR-11: Reserved (Not Defined)
- FR-12: Admin System Monitoring
- Admin Web Portal
- Patient Mobile FR-P1 to FR-P5
- Real-Time Updates & Notifications
- Security & Compliance

## FR-1: Patient Registration (Mobile)
**Status:** 🔴 NOT IMPLEMENTED (UI) / ✅ IMPLEMENTED (API)

**Features:**
- Email/password registration API | ✅ IMPLEMENTED
- Google OAuth 2.0 registration | NOT IMPLEMENTED
- Capture medical profile (age, gender, allergies, conditions) | NOT IMPLEMENTED
- Registration confirmation email | NOT IMPLEMENTED

**References:**
- `DigiHealth_Postman_Collection.json: Register Patient`
- `backend` auth service and DTOs

---

## FR-2: Patient Login (Mobile)
**Status:** 🔴 NOT IMPLEMENTED (UI) / ✅ IMPLEMENTED (API)

**Features:**
- Email/password login API | NOT IMPLEMENTED
- Google OAuth 2.0 login | NOT IMPLEMENTED
- JWT-based secure session | NOT IMPLEMENTED
- Redirect to patient dashboard (mobile UI) | NOT IMPLEMENTED

**References:**
- `DigiHealth_Postman_Collection.json: Patient Login`
- `backend/src/main/java/com/digihealth/backend/security/JwtAuthenticationFilter.java`

---

## FR-3: Doctor Registration (Web)
**Status:** ✅ IMPLEMENTED

**Features:**
- Doctor registration form | ✅ IMPLEMENTED
- Admin approval required | ✅ IMPLEMENTED
- Schedule availability capture during registration | NOT IMPLEMENTED

**References:**
- `web/src/components/DoctorRegistration.js`
- `backend` admin approval endpoints

---

## FR-4: Doctor Login and Schedule Management
**Status:** ⚠️ PARTIALLY IMPLEMENTED

**Description:** Doctors log in and manage schedules.

**Acceptance Criteria:**
- Secure login with credentials | ✅ IMPLEMENTED
- Dashboard with appointments and patients | ✅ IMPLEMENTED
- Schedule management tools for working hours | ✅ IMPLEMENTED
- Adjust availability and booking slots | ❌ NOT IMPLEMENTED
- Real-time counters and today list updates | ✅ IMPLEMENTED

**Implementation:**
- Frontend:
  - `web/src/components/LoginScreen.js` (doctor login)
  - `web/src/components/Dashboard.js` (doctor dashboard)
  - `web/src/components/Patients.js` (assigned patients list)
  - `web/src/components/Schedule.js` (working hours UI)
- Backend:
  - `backend/src/main/java/com/digihealth/backend/controller/DoctorDashboardController.java` (working hours & dashboard)
  - `backend/src/main/java/com/digihealth/backend/config/WebSocketConfig.java:9–23`
  - `backend/src/main/java/com/digihealth/backend/service/AppointmentNotificationService.java:15–24`
  - `backend/src/main/java/com/digihealth/backend/security/CustomUserDetailsService.java`

**Code References:**
- Login: `web/src/components/LoginScreen.js:6–15, 23–31`
- Dashboard refresh on updates: `web/src/components/Dashboard.js:54–59`
- Working hours integration: `web/src/components/Schedule.js:25–57, 118–157, 320–331`
- Controller endpoints: `backend/src/main/java/com/digihealth/backend/controller/DoctorDashboardController.java:46–56`

**Gaps to MVP:**
- Google OAuth 2.0 login | ❌ NOT IMPLEMENTED
- Availability slot generation and conflict detection | ❌ NOT IMPLEMENTED
- Visual indicators for real-time updates in all doctor views | ❌ NOT IMPLEMENTED

---

## FR-5: Appointment Booking (Mobile)
**Status:** 🔴 NOT IMPLEMENTED (UI) / ✅ IMPLEMENTED (API)

**Features:**
- Browse doctors by name/specialization | NOT IMPLEMENTED
- View open time slots | NOT IMPLEMENTED
- Book appointment (API) | ✅ IMPLEMENTED
- Notifications on booking (email/SMS) | NOT IMPLEMENTED

**References:**
- `DigiHealth_Postman_Collection.json: Patient Booking (POST /api/appointments/book)`

---

## FR-6: Appointment Management
**Status:** ✅ FULLY IMPLEMENTED (Core flows + rescheduling)

**Description:** View and manage appointments.

**Acceptance Criteria:**
- View scheduled appointments with filters | ✅ IMPLEMENTED
- Mark as completed | ✅ IMPLEMENTED
- Mark as cancelled | ✅ IMPLEMENTED
- Real-time status updates | ✅ IMPLEMENTED
- Filter by status | ✅ IMPLEMENTED
- Reschedule date/time | ✅ IMPLEMENTED

**Implementation:**
- Frontend:
  - `web/src/components/Appointments.js` (list, filters)
  - `web/src/components/DoctorAppointmentDetails.js` (complete)
  - `web/src/components/DoctorEditAppointment.js` (edit date/time, cancel)
  - `web/src/components/NewAppointmentModal.js` (create appointment)
  - `web/src/api/client.js` (status update API, doctor create/update helpers)
- Backend:
  - `backend/src/main/java/com/digihealth/backend/controller/AppointmentController.java:136–153` (status update)
  - `backend/src/main/java/com/digihealth/backend/service/AppointmentNotificationService.java:15–24` (broadcast)
  - `backend/src/main/java/com/digihealth/backend/config/WebSocketConfig.java:9–23`
  - `backend/src/main/java/com/digihealth/backend/controller/DoctorDashboardController.java:114–140` (doctor creates appointment)
  - `backend/src/main/java/com/digihealth/backend/controller/DoctorDashboardController.java:142–178` (doctor updates appointment)

**Code References:**
- List and refresh: `web/src/components/Appointments.js:17–29, 133–149`
- Complete action: `web/src/components/DoctorAppointmentDetails.js:8–16`
- Edit/reschedule action: `web/src/components/DoctorEditAppointment.js:83–137`
- Create appointment: `web/src/components/NewAppointmentModal.js:39–63`
- API methods: `web/src/api/client.js:72–88`
- Admin subscriptions: `web/src/components/AdminAppointments.js:66–71`

**Gaps to MVP:**
- Auto prompt to capture notes when marking appointment completed | ❌ NOT IMPLEMENTED
- Centralized error handling (frontend interceptor) | ❌ NOT IMPLEMENTED
- Real-time visual indicators in doctor Appointments view | ❌ NOT IMPLEMENTED

---

## FR-7: Patient Record Management
**Status:** ✅ FULLY IMPLEMENTED (Core records)

**Description:** Allows doctors to view and update patient records (consultation notes, diagnosis, prescriptions, observations), search patients by name/ID, and view patient appointment history. Access is restricted to patients assigned to the doctor via appointments.

**Acceptance Criteria:**
- View patient records (assigned only) | ✅ IMPLEMENTED
- Add/edit consultation notes | ✅ IMPLEMENTED
- Prescriptions and observations | ✅ IMPLEMENTED
- View appointment history | ✅ IMPLEMENTED
- Search patients by name/ID | ✅ IMPLEMENTED

**Implementation:**
- Frontend:
  - `web/src/components/Patients.js` (list, search, notes CRUD UI, rich text editor, pagination)
  - Backend:
  - `backend/src/main/java/com/digihealth/backend/controller/MedicalNotesController.java` (notes CRUD)
  - `backend/src/main/java/com/digihealth/backend/entity/MedicalNote.java` (entity)
  - `backend/src/main/java/com/digihealth/backend/repository/MedicalNoteRepository.java` (repo)
  - `backend/src/main/java/com/digihealth/backend/dto/CreateUpdateMedicalNoteRequest.java`, `MedicalNoteDto.java` (DTOs)
  - Search: `backend/src/main/java/com/digihealth/backend/controller/DoctorDashboardController.java:34–44, +search method`
  - Enforce doctor-only access via appointment relationship checks in controller

**Gaps to MVP:**
- Rich text editor for notes | ✅ IMPLEMENTED
- Role annotations (`@PreAuthorize`) and audit logging | ✅ IMPLEMENTED
- Attach notes directly within appointment completion flow | ✅ IMPLEMENTED
- Timeline view and filtering | ✅ IMPLEMENTED
- Export notes as PDF and print-friendly layout | ✅ IMPLEMENTED
- Edit/delete note actions with undo | ✅ IMPLEMENTED
- Paginate patient lists and notes; server-side search | ✅ IMPLEMENTED
 - Patient ID readability in UI (short UUID) | ✅ IMPLEMENTED

**Next Suggested Tasks:**
- Enhance RTE with formatting shortcuts and link support.
- Add note versioning and compare diffs.
- Server-side pagination for patients (DB-level) and notes (Pageable).
- PDF export improvements with headers/footers and clinic branding.
- Role-based UI gating and breadcrumbs for patients/notes.

---

## FR-8: Role-Based Access Control
**Status:** ✅ FULLY IMPLEMENTED (Core RBAC)

**Features:**
- Roles: Patient, Doctor, Admin | ✅ IMPLEMENTED
- Data visibility restrictions (assigned patients only) | ✅ IMPLEMENTED
- Permission checks for admin endpoints | ✅ IMPLEMENTED

**References:**
- `backend/src/main/java/com/digihealth/backend/config/SecurityConfig.java:65–72`
- `backend/src/main/java/com/digihealth/backend/security/CustomUserDetailsService.java:32–37, 53–58`

**Acceptance Criteria:**
- All non-auth endpoints require a valid JWT | ✅ IMPLEMENTED
- `/api/admin/**` requires `ROLE_ADMIN` | ✅ IMPLEMENTED
- JWT subject resolves to user ID and loads role authorities | ✅ IMPLEMENTED
- Inactive users are blocked; unapproved doctors cannot log in | ✅ IMPLEMENTED

**Gaps to MVP (Next Tasks):**
- Add method-level authorization (`@PreAuthorize`) for doctor/patient actions | NOT IMPLEMENTED
- Enforce object-level checks (doctor can access only assigned patient data) | NOT IMPLEMENTED
- Frontend route/menu gating based on role | NOT IMPLEMENTED
- RBAC integration tests across roles and endpoints | NOT IMPLEMENTED
- Audit logging for sensitive actions | NOT IMPLEMENTED

---

## FR-9: Administrator Management
**Status:** ⚠️ PARTIALLY IMPLEMENTED

**Features:**
- Approve doctor accounts | ✅IMPLEMENTED
- Deactivate/reactivate accounts | IMPLEMENTED
- Configure clinic details | ✅ IMPLEMENTED
- Enforce appointment policies in booking | NOT IMPLEMENTED
- System status monitoring | NOT IMPLEMENTED

**References:**
- `backend/src/main/java/com/digihealth/backend/controller/AdminController.java:166–221`
- `web/src/components/AdminDashboardSettings.js`

---

## FR-10: System Reports and Analytics
**Status:** ⚠️ PARTIALLY IMPLEMENTED

**Features:**
- Appointment statistics counts | ✅ IMPLEMENTED
- Patient registration counts | ✅ IMPLEMENTED
- Visual charts for analytics | NOT IMPLEMENTED
- Export reports (CSV/PDF) | NOT IMPLEMENTED

**References:**
- `web/src/components/AdminAnalytics.js`

---

## FR-11: Reserved (Not Defined)
**Status:** N/A

**Features:**
- Reserved for future scope | NOT IMPLEMENTED

---

## FR-12: Admin System Monitoring
**Status:** 🔴 NOT IMPLEMENTED

**Features:**
- System status dashboard | NOT IMPLEMENTED
- Database connection status | NOT IMPLEMENTED
- API health checks | NOT IMPLEMENTED
- Error logs viewing | NOT IMPLEMENTED

**References:**
- Planned per `First FRSv2.txt`

---

## Admin Web Portal
**Status:** ⚠️ PARTIALLY IMPLEMENTED

**Features:**
- Admin login and dashboard | ✅ IMPLEMENTED
- Approve/reject doctors | ✅ IMPLEMENTED
- Deactivate/reactivate users with cascades | ✅ IMPLEMENTED
- Configure clinic settings and appointment policies | ✅ IMPLEMENTED
- Analytics and basic reports | ✅ IMPLEMENTED

**Implementation:**
- Frontend:
  - `web/src/components/AdminLogin.js`
  - `web/src/components/AdminDashboard.js`
  - `web/src/components/AdminPatients.js`
  - `web/src/components/AdminAppointments.js` (binds to `/api/admin/appointments`)
  - `web/src/components/AdminDashboardSettings.js`
  - `web/src/components/AdminAnalytics.js`
- Backend:
  - `backend/src/main/java/com/digihealth/backend/controller/AdminController.java:166–221` (deactivation, cascades, safety)
  - `backend/src/main/java/com/digihealth/backend/security/SecurityConfig.java:65–72` (authentication)

**Code References:**
- Deactivation UI: `web/src/components/AdminPatients.js:99–107, 110–114`
- Settings UI: `web/src/components/AdminDashboardSettings.js:12–40`

**Gaps to MVP:**
- Permission checks for `/api/admin/**` by role | ✅ IMPLEMENTED
- Success toast notifications across admin actions | ❌ NOT IMPLEMENTED
- Audit logging for admin actions | ❌ NOT IMPLEMENTED
- Enforce appointment policy settings in booking | ❌ NOT IMPLEMENTED

---

## Patient Mobile FR-P1 to FR-P5
**Status:** 🔴 NOT IMPLEMENTED (Planned)

- FR-P1: Patient Dashboard — welcome, upcoming appointments, quick actions, notifications
- FR-P2: My Appointments — upcoming/past/cancelled tabs, cancel/reschedule, reminders, calendar
- FR-P3: Medical Records — grouped records, diagnosis/prescriptions/notes, search/filter, PDF export, sharing
- FR-P4: Doctor Profiles & Search — advanced filters, ratings, full profiles, reviews, available slots
- FR-P5: Profile Management — personal/medical info edits, password, notification preferences, privacy, delete account

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

Source content: `SIA FILES/COMPLETE_DIGIHEALTH_FRS.md:157–227`

---

## Real-Time Updates & Notifications
**Status:** ⚠️ PARTIALLY IMPLEMENTED

**Implementation:**
- Backend config: `backend/src/main/java/com/digihealth/backend/config/WebSocketConfig.java:9–23`
- Broadcast on status changes: `backend/src/main/java/com/digihealth/backend/service/AppointmentNotificationService.java:15–24`
- Frontend subscriptions: `web/src/hooks/useAppointmentUpdates.js:10–21`
- Dashboard auto-refresh: `web/src/components/Dashboard.js:54–59`

**Gaps to MVP:**
- In-app notification UI and visual indicators | ❌ NOT IMPLEMENTED
- Event triggers for new appointments and account deactivations | ❌ NOT IMPLEMENTED
- Integrate doctor Appointments view with live topic updates | ❌ NOT IMPLEMENTED

---

## Security & Compliance
**Status:** ⚠️ PARTIALLY IMPLEMENTED

**Current:**
- JWT-based auth with role checks at login: `backend/src/main/java/com/digihealth/backend/security/CustomUserDetailsService.java`
- Basic route protection in security config: `backend/src/main/java/com/digihealth/backend/config/SecurityConfig.java:65–72`

**Gaps:**
- Role-based restriction for `/api/admin/**` | ✅ IMPLEMENTED
- Google OAuth 2.0 integration | ❌ NOT IMPLEMENTED
- Audit logging for sensitive actions | ❌ NOT IMPLEMENTED
- Consistent error handling and input validation across endpoints | ❌ NOT IMPLEMENTED

---

## Compliance Roadmap
- Implement Google OAuth
  - Spring Security OAuth2 client + Google; map tokens to existing `User` entities and roles; add `/oauth2/authorization/google` and custom success handler.
- Add OpenAPI/Swagger
  - Include `springdoc-openapi-ui` in `pom.xml`; annotate controllers; expose `/swagger-ui/index.html`.
- Enforce admin role gating — ✅ IMPLEMENTED
  - `backend/src/main/java/com/digihealth/backend/config/SecurityConfig.java:65–72` and `backend/src/main/java/com/digihealth/backend/security/CustomUserDetailsService.java:32–37,53–58`.
- Add pagination
  - Use `Pageable` in repository methods; accept `page`/`size` in controllers; return `Page<T>` for lists (patients/doctors/appointments).
- Add audit logging
  - Create `AuditLog` entity (operation, actorId, resourceId, timestamp) and write audit entries in admin/doctor actions.
- Deliver minimal Android app
  - 5+ screens: Login, Appointments List, Appointment Detail, Create/Cancel, Profile; reuse backend endpoints; store JWT using `EncryptedSharedPreferences`; basic offline cache with Room or simple file cache.
- Standardize error schema
  - Implement a `@ControllerAdvice` with a unified error contract `{ code, message, details }`.

## Implementation Notes
- Postman flows available in `DigiHealth_Postman_Collection.json` for registration, login, admin approvals, appointments.
- Real component paths and backend endpoints are referenced for traceability.
