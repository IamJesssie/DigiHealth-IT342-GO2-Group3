# DigiHealth Integration Plan & To-Do List

This document outlines the plan for merging the individual frontend and backend feature branches into a single `feature/integration` branch for end-to-end testing.

## 1. End Goal

The primary objective is to create a stable `feature/integration` branch that contains all completed frontend and backend code. This branch will serve as the environment for connecting the UI to the database, performing full-system tests, and preparing for the final pull request to the `master` branch.

## 2. Branch Merging Strategy

The `master` branch has already been merged with `feature/backend-initial-project-development`. Our strategy is to use this updated `master` as the base for our new integration branch.

### Branches to be Merged:
- `feature/basic-backend-implementation`
- `feature/api-security`
- `feature/react-frontend`

### Branch to be Skipped (Already in `master`):
- `feature/backend-initial-project-development`

---

## 3. Execution Plan (To-Do List)

- [x] **Step 1: Prepare Local `master` Branch**
  - [x] `git checkout master`
  - [x] `git pull origin master` (Ensures we have the absolute latest version)

- [x] **Step 2: Create Local `feature/integration` Branch**
  - [x] `git checkout -b feature/integration` (Creates the new branch from the up-to-date `master`)

- [ ] **Step 3: Merge Feature Branches into `feature/integration`**
  - [x] `git merge feature/basic-backend-implementation` (Initial merge attempt resulted in staged changes, which were committed)
  - [x] `git merge feature/api-security`
    - [x] Resolved conflict in `backend/src/main/java/com/digihealth/backend/config/SecurityConfig.java`
    - [x] Resolved conflict in `backend/src/main/java/com/digihealth/backend/controller/AuthController.java`
    - [x] Resolved conflict in `backend/src/main/java/com/digihealth/backend/security/JwtTokenProvider.java`
    - [x] Resolved conflict in `backend/src/main/java/com/digihealth/backend/service/AuthService.java`
  - [ ] `git merge feature/react-frontend`
  - [ ] **If Conflicts Occur:** Manually resolve conflicts in the code to ensure both frontend and backend changes are preserved correctly.

- [ ] **Step 4: Push the `feature/integration` Branch to Remote**
  - [ ] `git push --set-upstream origin feature/integration` (Shares the combined branch with the team)

- [ ] **Step 5: Push Individual Feature Branches to Remote**
  - *This step is for visibility and to ensure individual progress is logged correctly.*
  - [ ] `git checkout feature/react-frontend`
  - [ ] `git push`
  - [ ] `git checkout feature/api-security`
  - [ ] `git push`
  - [ ] `git checkout feature/basic-backend-implementation`
  - [ ] `git push`
  - [ ] `git checkout feature/integration` (Return to the main working branch)

---

## 4. Post-Integration Tasks (High-Level)

- [ ] **Connect UI to APIs:**
  - [ ] Doctor Registration
  - [ ] Doctor Login
  - [ ] Dashboard data (Appointments, Patient count)
  - [ ] Patient list
  - [ ] Appointment list
  - [ ] Profile Settings data

- [ ] **End-to-End Testing:**
  - [ ] Test user registration flow.
  - [ ] Test login/logout flow.
  - [ ] Verify data displayed on the dashboard is accurate.
  - [ ] Test creation, viewing, and updating of all relevant data.

- [ ] **Final Pull Request:**
  - [ ] Once testing is complete and all features are stable, create a pull request to merge `feature/integration` into `master`.
