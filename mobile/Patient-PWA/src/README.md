# DigiHealth - Patient Mobile PWA

A Progressive Web Application (PWA) for patients to manage their healthcare appointments, medical records, and doctor interactions.

## 🎯 Overview

DigiHealth Patient PWA is a mobile-first healthcare platform that allows patients to:
- View their health dashboard
- Book and manage appointments
- Access medical records
- Search and find doctors
- Manage their profile and settings

## 🎨 Design System

**Brand Colors:**
- Primary Gradient: `#0093E9 → #80D0C7`
- Mobile-first design optimized for iOS and Android devices

## 📱 Features

### FR-P1: Patient Dashboard (UC1)
- Health summary cards (Blood Pressure, Heart Rate, Last Checkup, Pending Reports)
- Upcoming appointments overview
- Quick actions (Book Appointment, View Records, Find Doctors, Emergency Contact)
- Personalized welcome message

### FR-P2: Appointment Management (UC2, UC3, UC8)
- View upcoming, past, and cancelled appointments
- Book new appointments with doctors
- Cancel appointments
- Appointment reminders and notifications
- Filter by status (Upcoming, Past, Cancelled)

### FR-P3: Medical Records Access (UC4)
- View all medical records
- Search records by diagnosis, doctor, or complaint
- Detailed record view with:
  - Doctor information
  - Diagnosis and chief complaint
  - Prescription details
  - Clinical notes
  - Lab results
  - Follow-up instructions
- Download and share records

### FR-P4: Doctor Search & Discovery (UC5, UC6)
- Search doctors by name
- Filter by specialization
- View doctor profiles:
  - Qualifications and experience
  - Specializations
  - Availability
  - Patient ratings
  - Consultation fees
- Book appointments directly from doctor profile

### FR-P5: Profile Management (UC7, UC9)
- Personal information management
- Medical history tracking
- Emergency contact details
- Account settings:
  - Notification preferences
  - Privacy settings
  - Language selection
  - Theme preference
- Logout functionality

## 🚀 Getting Started

The application starts with the **Patient Login** screen. Users can:

1. **Login** with existing credentials
2. **Register** as a new patient with Google OAuth 2.0
3. Navigate through the app using the bottom navigation bar

## 📂 Project Structure

```
/components
  ├── PatientLogin.tsx              # Login screen
  ├── PatientRegistration.tsx       # Registration with Google OAuth
  ├── PatientDashboard.tsx          # Main dashboard (FR-P1)
  ├── PatientAppointments.tsx       # Appointments list (FR-P2)
  ├── PatientBookAppointment.tsx    # Book appointment flow (FR-P2)
  ├── PatientMedicalRecords.tsx     # Medical records (FR-P3)
  ├── PatientDoctorSearch.tsx       # Doctor search (FR-P4)
  ├── PatientProfile.tsx            # Profile & settings (FR-P5)
  ├── PatientMobileLayout.tsx       # Mobile navigation layout
  └── ui/                           # Reusable UI components

/App.tsx                            # Main app router
```

## 🧭 Navigation

The app uses a bottom navigation bar with 5 main sections:

1. **Home** - Dashboard with health summary
2. **Appointments** - View and manage appointments
3. **Find Doctors** - Search and discover doctors
4. **Records** - Access medical records
5. **Profile** - Manage profile and settings

## 🎓 Use Cases Implemented

- **UC1**: Patient views dashboard
- **UC2**: Patient books appointment
- **UC3**: Patient views appointment history
- **UC4**: Patient accesses medical records
- **UC5**: Patient searches for doctors
- **UC6**: Patient views doctor profile
- **UC7**: Patient updates profile
- **UC8**: Patient cancels appointment
- **UC9**: Patient manages account settings

## 🔐 Authentication

- Google OAuth 2.0 integration for secure login
- Mock authentication for development/demo purposes
- Session management with logout functionality

## 📊 Demo Data

The application includes comprehensive mock data for demonstration:
- Sample patient profile
- Upcoming and past appointments
- Medical records with prescriptions and lab results
- Doctor profiles with specializations
- Health metrics and summaries

## 🎯 MVP Scope

This is the **MVP (Minimum Viable Product)** focused on core patient functionality:
- ✅ Patient registration and login
- ✅ Dashboard with health overview
- ✅ Appointment booking and management
- ✅ Medical records access
- ✅ Doctor search and discovery
- ✅ Profile and settings management

## 🚀 Future Enhancements

- Real-time notifications
- Video consultation integration
- Prescription refill requests
- Health tracking and analytics
- Family member management
- Integration with wearable devices

## 📱 PWA Features

- Mobile-first responsive design
- Optimized for touchscreen interaction
- Works offline (when implemented with service workers)
- Installable on mobile devices
- Fast loading and smooth animations

---

**Built for:** Final Year Project Presentation  
**Technology:** React + TypeScript + Tailwind CSS  
**Design Pattern:** Mobile PWA with Component-based Architecture
