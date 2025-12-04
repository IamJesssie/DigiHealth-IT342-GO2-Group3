# 📋 DIGIHEALTH PATIENT PWA IMPLEMENTATION CHECKLIST

**Last Updated:** 2025-12-04
**Scope:** Patient-facing Progressive Web App (PWA) delivered via the existing `web/` codebase

---

## 🧑‍🦽 Patient PWA Overview

**Approach:** PWA + Web for rapid delivery. Mobile-first UI in React, installable via manifest + service worker. Later optional Play Store packaging via Trusted Web Activity.

---

## FR-1: Patient Registration (PWA)
**Status:** ✅ IMPLEMENTED (PWA UI) / ✅ IMPLEMENTED (API)

| Feature | Status | Notes |
|---------|--------|-------|
| Registration form (email/password) | ✅ IMPLEMENTED | Wired to `/api/auth/register-patient` |
| Medical profile fields (age, gender, allergies, conditions) | ❌ NOT IMPLEMENTED | Capture and send to backend |
| Confirmation email | ❌ NOT IMPLEMENTED | Trigger on successful registration |

---

## FR-2: Patient Login (PWA)
**Status:** ✅ IMPLEMENTED (PWA UI) / ✅ IMPLEMENTED (API)

| Feature | Status | Notes |
|---------|--------|-------|
| Login screen (email/password) | ✅ IMPLEMENTED | Stores JWT in localStorage |
| Google OAuth 2.0 login | ❌ NOT IMPLEMENTED | Optional enhancement |
| JWT session handling | ✅ IMPLEMENTED | Authorization: Bearer <token> |
| Redirect to patient dashboard | ✅ IMPLEMENTED | Navigates after login |

---

## FR-5: Appointment Booking (Patient)
**Status:** ✅ IMPLEMENTED (PWA UI + API)

| Feature | Status | Notes |
|---------|--------|-------|
| Browse doctors (name/specialization) | ✅ IMPLEMENTED | Basic list + search |
| View open time slots | ✅ IMPLEMENTED | Doctor availability integrated |
| Book appointment | ✅ IMPLEMENTED | API wired with JWT |
| Booking notifications | ❌ NOT IMPLEMENTED | Email/SMS, in-app |

---

## FR-P1: Patient Dashboard
**Status:** ❌ NOT IMPLEMENTED (PWA)

| Feature | Status | Notes |
|---------|--------|-------|
| Welcome header | ❌ NOT IMPLEMENTED | Personalized |
| Upcoming appointments (next 3) | ❌ NOT IMPLEMENTED | Cards list |
| Quick actions | ❌ NOT IMPLEMENTED | Book, reschedule |
| Notifications list | ❌ NOT IMPLEMENTED | Basic feed |

---

## FR-P2: My Appointments
**Status:** ❌ NOT IMPLEMENTED (PWA)

| Feature | Status | Notes |
|---------|--------|-------|
| Tabs: Upcoming/Past/Cancelled | ❌ NOT IMPLEMENTED | Filter client-side first |
| Cancel appointment | ❌ NOT IMPLEMENTED | Status update endpoint |
| Reschedule appointment | ❌ NOT IMPLEMENTED | Date/time picker |
| Add to calendar | ❌ NOT IMPLEMENTED | ICS download |

---

## FR-P3: Medical Records
**Status:** ❌ NOT IMPLEMENTED (PWA)

| Feature | Status | Notes |
|---------|--------|-------|
| Records list by date | ❌ NOT IMPLEMENTED | Use doctor notes structure |
| Diagnosis/prescriptions/notes | ❌ NOT IMPLEMENTED | Read-only for patient |
| Search/filter | ❌ NOT IMPLEMENTED | Client-side first |
| PDF export | ❌ NOT IMPLEMENTED | Print-friendly |

---

## FR-P4: Doctor Profiles & Search
**Status:** ❌ NOT IMPLEMENTED (PWA)

| Feature | Status | Notes |
|---------|--------|-------|
| Search with filters | ❌ NOT IMPLEMENTED | Specialization, rating |
| Doctor cards and profiles | ❌ NOT IMPLEMENTED | Basic info |
| Ratings & reviews | ❌ NOT IMPLEMENTED | Future enhancement |
| Available time slots | ❌ NOT IMPLEMENTED | Integrate with booking |

---

## FR-P5: Profile Management
**Status:** ❌ NOT IMPLEMENTED (PWA)

| Feature | Status | Notes |
|---------|--------|-------|
| Edit personal info | ❌ NOT IMPLEMENTED | Synchronize with backend |
| Update medical profile | ❌ NOT IMPLEMENTED | Allergies, conditions |
| Change password | ❌ NOT IMPLEMENTED | Reuse existing flow |
| Notification preferences | ❌ NOT IMPLEMENTED | UI toggles |
| Delete account | ❌ NOT IMPLEMENTED | Safety checks |

---

## 📱 PWA Readiness
**Status:** ❌ NOT IMPLEMENTED

| Item | Status | Notes |
|------|--------|-------|
| Web manifest tuning | ❌ NOT IMPLEMENTED | Name, colors, icons |
| Service worker registration | ❌ NOT IMPLEMENTED | Cache shell + assets |
| Install prompt UX | ❌ NOT IMPLEMENTED | Detect and present |
| Offline fallback | ❌ NOT IMPLEMENTED | Basic offline page |

---

## 🎯 Roadmap (1-week)

1. Create patient routes and skeleton pages under `web/src/components`.
2. Implement login/registration UI and role gating.
3. Wire appointments list and booking flow to existing APIs.
4. Enable PWA install: manifest + service worker + install prompt.
5. Add print-friendly medical records and basic CSV export.
