# DigiHealth Integration Plan & To-Do List

This document outlines the plan for merging the individual frontend and backend feature branches into a single `feature/integration` branch for end-to-end testing, and records the concrete integration work completed.

## 1. End Goal

The primary objective is to create a stable `feature/integration` branch that contains all completed frontend and backend code. This branch serves as the environment for:

- Connecting the UI to the real backend and database
- Performing full-system tests across auth, dashboard, patients, appointments, and profile flows
- Preparing the final pull request into `master`

## 2. Branch Merging Strategy

The `master` branch has already been merged with `feature/backend-initial-project-development`. `feature/integration` is based on this updated `master`.

### Branches Merged into `feature/integration`:

- `feature/basic-backend-implementation`
- `feature/api-security`
- `feature/react-frontend`

### Branch Skipped (Already in `master`):

- `feature/backend-initial-project-development`

---

## 3. Execution Plan (Git Workflow)

- [x] Step 1: Prepare local `master`
  - [x] `git checkout master`
  - [x] `git pull origin master`

- [x] Step 2: Create `feature/integration` from updated `master`
  - [x] `git checkout -b feature/integration`

- [x] Step 3: Merge feature branches into `feature/integration`
  - [x] `git merge feature/basic-backend-implementation`
  - [x] `git merge feature/api-security`
  - [x] Resolve security/auth stack conflicts:
    - [`backend/src/main/java/com/digihealth/backend/config/SecurityConfig.java`](backend/src/main/java/com/digihealth/backend/config/SecurityConfig.java:1)
    - [`backend/src/main/java/com/digihealth/backend/controller/AuthController.java`](backend/src/main/java/com/digihealth/backend/controller/AuthController.java:1)
    - [`backend/src/main/java/com/digihealth/backend/security/JwtTokenProvider.java`](backend/src/main/java/com/digihealth/backend/security/JwtTokenProvider.java:1)
    - [`backend/src/main/java/com/digihealth/backend/service/AuthService.java`](backend/src/main/java/com/digihealth/backend/service/AuthService.java:1)
  - [x] `git merge feature/react-frontend`
    - [x] Resolve conflicts:
      - `.gitignore`
      - `web/public/index.html`
      - [`backend/src/main/java/com/digihealth/backend/dto/LoginRequest.java`](backend/src/main/java/com/digihealth/backend/dto/LoginRequest.java:1)
    - [x] Confirm React app under `web/` on `feature/integration`
  - [x] Preserve backend security config and React structure

- [ ] Step 4: Push `feature/integration` to remote
  - [ ] `git push --set-upstream origin feature/integration`

- [ ] Step 5: Push individual feature branches (for history/visibility)
  - [ ] `git checkout feature/react-frontend` → `git push`
  - [ ] `git checkout feature/api-security` → `git push`
  - [ ] `git checkout feature/basic-backend-implementation` → `git push`
  - [ ] `git checkout feature/integration` (return)

---

## 4. Post-Integration Implementation Status

### 4.1 Backend compile & DTO/Auth consistency

- [x] Normalize `User` entity:
  - [`backend/src/main/java/com/digihealth/backend/entity/User.java`](backend/src/main/java/com/digihealth/backend/entity/User.java:1)
  - `id` as UUID (generated)
  - `fullName`, `email`, `passwordHash`, `specialization`, `licenseNumber`, `phoneNumber`, `role`, `isActive`
- [x] Align `AuthService` and `AuthController`:
  - [`AuthController`](backend/src/main/java/com/digihealth/backend/controller/AuthController.java:1)
  - [`AuthService`](backend/src/main/java/com/digihealth/backend/service/AuthService.java:1)
  - `/api/auth/login` uses [`LoginRequest`](backend/src/main/java/com/digihealth/backend/dto/LoginRequest.java:1) (email, password)
  - `/api/auth/register` uses `RegisterDto` for doctor registration
  - JWT generated via [`JwtTokenProvider.generateTokenFromUser(user)`](backend/src/main/java/com/digihealth/backend/security/JwtTokenProvider.java:1) with subject = `user.id`
- [x] Align JWT validation with UUID subject:
  - [`JwtTokenProvider`](backend/src/main/java/com/digihealth/backend/security/JwtTokenProvider.java:1)
    - Derives secure HS512 key (no WeakKeyException)
  - [`CustomUserDetailsService`](backend/src/main/java/com/digihealth/backend/security/CustomUserDetailsService.java:1)
    - Adds `loadUserById(UUID id)`
  - [`JwtAuthenticationFilter`](backend/src/main/java/com/digihealth/backend/security/JwtAuthenticationFilter.java:1)
    - Parses userId from token
    - Loads user via `loadUserById`
- [ ] Configure MySQL in [`backend/src/main/resources/application.properties`](backend/src/main/resources/application.properties:1) for consistent local integration tests

### 4.2 Security rules

- [x] [`SecurityConfig`](backend/src/main/java/com/digihealth/backend/config/SecurityConfig.java:1)
  - `/api/auth/**` → `permitAll()`
  - All other `/api/**` → authenticated via JWT
  - No misordered rules blocking new integration endpoints

---

## 5. Frontend-to-Backend Integration (feature/integration)

### 5.1 Shared auth and HTTP client

- [x] Shared HTTP client:
  - [`web/src/api/client.js`](web/src/api/client.js:1)
    - `API_BASE_URL` from `REACT_APP_API_BASE_URL` or `http://localhost:8080`
    - Axios interceptor:
      - Reads `digihealth_jwt` from `localStorage`
      - Sets `Authorization: Bearer <token>`
    - Exposes:
      - `login(email, password)` → `/api/auth/login`
      - `registerDoctor(data)` → `/api/auth/register`

- [x] Auth helpers:
  - [`web/src/auth/auth.js`](web/src/auth/auth.js:1)
    - `TOKEN_KEY = 'digihealth_jwt'`
    - `setToken(token)` / `getToken()` / `clearToken()` / `isAuthenticated()`
    - Single source of truth for auth state

### 5.2 Auth UI and routing

- [x] Login:
  - [`web/src/components/LoginScreen.js`](web/src/components/LoginScreen.js:1)
    - Uses `login()` helper
    - On success:
      - Stores JWT via `setToken`
      - `navigate('/dashboard')`
- [x] Registration:
  - [`web/src/components/DoctorRegistration.js`](web/src/components/DoctorRegistration.js:1)
    - Uses `registerDoctor()` for backend-aligned doctor registration

- [x] Protected routing:
  - [`web/src/App.js`](web/src/App.js:1)
    - Uses `isAuthenticated()` to:
      - Redirect `/login` and `/register` to `/dashboard` if already logged in
      - Protect `/`, `/dashboard`, `/patients`, `/appointments`, `/profile-settings`, etc.
      - Redirect unauthenticated access to `/login`

- [x] Logout:
  - [`web/src/components/ProfileDropdown.js`](web/src/components/ProfileDropdown.js:1)
    - Imports `clearToken` and `useNavigate`
    - Logout button:
      - Calls `clearToken()`
      - `navigate('/login', { replace: true })`
    - Ensures a clean logout so new accounts (e.g. demo doctor) can be tested

### 5.3 API wiring for key screens

- [x] Dashboard:
  - [`web/src/components/Dashboard.js`](web/src/components/Dashboard.js:1)
  - Endpoints:
    - `GET /api/users/me` → current doctor profile
    - `GET /api/dashboard/summary` → summary counts
    - `GET /api/appointments/today` → today’s appointments
  - Behavior:
    - Welcome message uses `profile.fullName`
    - Stat cards use backend summary data
    - Today table uses backend appointments
    - Minimal loading/error states

- [x] Patients:
  - [`web/src/components/Patients.js`](web/src/components/Patients.js:1)
  - Endpoint:
    - `GET /api/doctors/me/patients`
  - Uses:
    - API data instead of hardcoded array
    - Handles empty list and error message

- [x] Appointments:
  - [`web/src/components/Appointments.js`](web/src/components/Appointments.js:1)
  - Endpoint:
    - `GET /api/doctors/me/appointments`
  - Renders:
    - time, patient name, type, doctor name, status
    - Status CSS classes based on backend status
    - Loading/error handling

- [x] Profile Settings:
  - [`web/src/components/ProfileSettings.js`](web/src/components/ProfileSettings.js:1)
  - Endpoints:
    - `GET /api/users/me` → populate fields
    - `PUT /api/users/me` → update current user/doctor profile
  - All fields now driven by API data
  - Simple success/error messaging

---

## 6. Backend endpoints supporting the UI

- [x] Doctor dashboard + scoped data:
  - [`backend/src/main/java/com/digihealth/backend/controller/DoctorDashboardController.java`](backend/src/main/java/com/digihealth/backend/controller/DoctorDashboardController.java:1)
  - Endpoints:
    - `GET /api/dashboard/summary` → `DashboardSummaryDto`
    - `GET /api/appointments/today` → `List<TodayAppointmentDto>`
    - `GET /api/doctors/me/patients` → `List<DoctorPatientDto>`
    - `GET /api/doctors/me/appointments` → `List<DoctorAppointmentDto>`
  - All resolve current doctor from JWT-authenticated user

- [x] Current user profile:
  - [`backend/src/main/java/com/digihealth/backend/controller/UserProfileController.java`](backend/src/main/java/com/digihealth/backend/controller/UserProfileController.java:1)
  - [`backend/src/main/java/com/digihealth/backend/service/UserProfileService.java`](backend/src/main/java/com/digihealth/backend/service/UserProfileService.java:1)
  - Endpoints:
    - `GET /api/users/me` → `CurrentUserProfileDto`
    - `PUT /api/users/me` → `CurrentUserProfileUpdateRequest` → updated `CurrentUserProfileDto`

---

## 7. Seed Data for Integration Testing (Doctor + Patients + Appointments)

- [x] Implemented local/dev seed initializer:
  - [`backend/src/main/java/com/digihealth/backend/config/DataInitializer.java`](backend/src/main/java/com/digihealth/backend/config/DataInitializer.java:1)
  - Active when:
    - Spring profile `local` or `dev` is active
    - `digihealth.seed.demo-doctor.enabled` is true (default)

Seeded entities:

- Demo doctor user:
  - Email: `demo.doctor@digihealth.com`
  - Password: `DemoPass123!` (BCrypt)
  - Role: `DOCTOR`
  - Full Name: `Dr. Demo Integration`
  - Specialization: `Internal Medicine`
  - License Number: `MD-DEMO-001`
  - Phone Number: `+65 8000 0001`
  - isActive: true

- Linked `Doctor`:
  - Uses the above `User`
  - Same specialization/license

- Patients and appointments:
  - Minimal `Patient` records created for demo purposes
  - Appointments for today created for the seeded doctor and patients:
    - One `CONFIRMED` (09:00)
    - One `SCHEDULED` (10:30)
    - One `COMPLETED` (14:00)

Usage:

- Run backend with:
  - `SPRING_PROFILES_ACTIVE=local` (or `dev`)
- On startup:
  - If `demo.doctor@digihealth.com` does not exist, DataInitializer seeds it and related data.
- Login via web:
  - Email: `demo.doctor@digihealth.com`
  - Password: `DemoPass123!`
- Flows to verify:
  - Redirect to `/dashboard` after login
  - Dashboard shows:
    - "Welcome back, Dr. Demo Integration"
    - Non-zero summary and today’s appointments from seed data
  - Patients:
    - Loads from `/api/doctors/me/patients`
  - Appointments:
    - Loads from `/api/doctors/me/appointments`
  - Profile Settings:
    - Loads/updates via `/api/users/me`
  - Logout:
    - Via Profile dropdown:
      - Clears `digihealth_jwt`
      - Navigates to `/login`

---

## 8. Remaining Tasks

- [ ] Configure MySQL for consistent local/integration DB (if not already)
- [ ] Validate end-to-end with seeded doctor on a clean environment:
  - [ ] Login/logout with JWT
  - [ ] Dashboard data loads without 403 for valid doctor
  - [ ] Patients and Appointments pages show scoped data
  - [ ] Profile Settings reflects and updates demo doctor data
- [ ] Push `feature/integration` and feature branches to remote
- [ ] Final PR:
  - [ ] Once tests pass and flows are stable, create PR to merge `feature/integration` into `master`.
