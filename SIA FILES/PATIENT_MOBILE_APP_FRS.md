# DigiHealth - Patient Mobile App
## Complete Functional Requirements & Use Cases

---

## 📱 PATIENT MOBILE APP - FUNCTIONAL REQUIREMENTS

### FR-1: Patient Registration (Mobile App)
**Priority:** HIGH  
**Description:** The system shall allow patients to register using either Google OAuth 2.0 authentication or manual form input of patient personal information such as name, contact number, email address, and require completion of a basic medical profile including age, gender, allergies, and existing medical conditions to support medical consultations.

**Acceptance Criteria:**
- ✅ System provides two registration options: Google OAuth 2.0 or Manual Form
- ✅ Google OAuth 2.0 flow captures user's Google profile (name, email, profile picture)
- ✅ Manual registration requires: Full Name, Email, Password, Phone Number, Emergency Contact
- ✅ Medical profile includes: Date of Birth, Gender, Blood Type, Allergies, Existing Medical Conditions, Current Medications
- ✅ All required fields must be validated before submission
- ✅ Email format validation
- ✅ Phone number format validation
- ✅ Password strength requirements (minimum 8 characters, 1 uppercase, 1 number)
- ✅ System creates unique patient ID upon successful registration
- ✅ Confirmation email sent to patient
- ✅ Patient account is immediately active (no admin approval needed)

---

### FR-2: Patient Login (Mobile App)
**Priority:** HIGH  
**Description:** The system shall allow registered patients to log in using Google OAuth 2.0 or their registered email and password, validate user credentials securely, and provide authenticated access to patient functionalities such as appointment booking and profile management.

**Acceptance Criteria:**
- ✅ Login screen provides two options: Google Sign-In or Email/Password
- ✅ Google OAuth 2.0 login flow redirects to Google authentication
- ✅ Email/Password login validates credentials against database
- ✅ Password is masked during input
- ✅ "Remember Me" option to persist login session
- ✅ "Forgot Password" link for password recovery
- ✅ Maximum 5 failed login attempts before temporary lockout (15 minutes)
- ✅ Successful login redirects to patient dashboard/home screen
- ✅ Session token stored securely for authenticated requests
- ✅ Biometric login option (fingerprint/face ID) after initial login

---

### FR-5: Appointment Booking (Mobile App)
**Priority:** HIGH  
**Description:** The system shall allow patients to browse available doctors by name or specialization, view open time slots, and select a preferred appointment date and time. The system shall confirm bookings and notify both the patient and doctor of appointment details.

**Acceptance Criteria:**
- ✅ Browse doctors screen displays list of approved doctors with:
  - Doctor photo/avatar
  - Full name
  - Specialization
  - Rating (average from previous patients)
  - Years of experience
  - Available status indicator
- ✅ Search functionality by doctor name
- ✅ Filter by specialization (Cardiology, Pediatrics, Dermatology, etc.)
- ✅ Sort options: Name (A-Z), Rating (High to Low), Availability
- ✅ Doctor detail page shows:
  - Full bio/description
  - Education and credentials
  - Available time slots for next 30 days
  - Patient reviews
- ✅ Calendar view shows available dates (color-coded)
- ✅ Time slot selection shows available slots for selected date
- ✅ Booked slots are greyed out/disabled
- ✅ Appointment type selection (General Consultation, Follow-up, Emergency)
- ✅ Optional: Add reason for visit
- ✅ Appointment summary before confirmation
- ✅ Confirmation dialog with appointment details
- ✅ Push notification sent to patient upon successful booking
- ✅ Email confirmation sent to patient
- ✅ Doctor receives notification of new appointment
- ✅ Appointment appears in patient's "My Appointments" list

---

### FR-P1: Patient Dashboard (Mobile App)
**Priority:** HIGH  
**Description:** The system shall provide patients with a personalized dashboard displaying upcoming appointments, quick actions, health summary, and recent activity.

**Acceptance Criteria:**
- ✅ Welcome message with patient name
- ✅ Profile picture/avatar display
- ✅ Upcoming appointments section (next 3 appointments)
- ✅ Quick action buttons:
  - Book Appointment
  - View Medical Records
  - Browse Doctors
  - Emergency Contact
- ✅ Health summary card:
  - Last visit date
  - Next scheduled appointment
  - Pending prescriptions
- ✅ Recent activity/notifications
- ✅ Navigation menu access
- ✅ Settings/profile access

---

### FR-P2: My Appointments (Mobile App)
**Priority:** HIGH  
**Description:** The system shall allow patients to view all their appointments (upcoming, past, cancelled), view appointment details, and cancel upcoming appointments.

**Acceptance Criteria:**
- ✅ Tabs for: Upcoming, Past, Cancelled
- ✅ Each appointment card displays:
  - Doctor name and photo
  - Specialization
  - Date and time
  - Appointment type
  - Status badge (Confirmed, Pending, Completed, Cancelled)
  - Location/clinic name
- ✅ Tap appointment to view full details
- ✅ Appointment detail page shows:
  - Complete appointment information
  - Doctor contact information
  - Directions to clinic (map integration)
  - Appointment notes/instructions
  - Cancel button (for upcoming only)
  - Reschedule button (for upcoming only)
- ✅ Cancel appointment feature:
  - Confirmation dialog before cancellation
  - Reason for cancellation (optional)
  - Notification sent to doctor
  - Appointment moves to "Cancelled" tab
- ✅ Reschedule appointment feature:
  - Opens booking flow with pre-filled doctor
  - Shows available new time slots
  - Cancels old appointment automatically
- ✅ Add to calendar option
- ✅ Set reminder notification (1 day before, 2 hours before, etc.)

---

### FR-P3: Medical Records (Mobile App)
**Priority:** MEDIUM  
**Description:** The system shall allow patients to view their personal medical records including consultation history, prescriptions, diagnoses, and medical notes from doctors.

**Acceptance Criteria:**
- ✅ Medical records list grouped by consultation date
- ✅ Each record displays:
  - Date of consultation
  - Doctor name
  - Diagnosis
  - Prescription summary
  - View details button
- ✅ Record detail page shows:
  - Complete diagnosis
  - Detailed prescription (medication, dosage, duration)
  - Doctor's clinical notes
  - Follow-up instructions
  - Attached documents/test results (if any)
- ✅ Search records by date range
- ✅ Filter by doctor or diagnosis type
- ✅ Download/export prescription as PDF
- ✅ Share record via email/messaging
- ✅ Access restriction: Only patient can view their own records

---

### FR-P4: Doctor Profiles & Search (Mobile App)
**Priority:** MEDIUM  
**Description:** The system shall provide comprehensive doctor profiles and robust search/filter capabilities for patients to find the right healthcare provider.

**Acceptance Criteria:**
- ✅ Doctor search screen with search bar
- ✅ Search by: Name, Specialization, Location
- ✅ Filter options:
  - Specialization (multi-select)
  - Availability (Today, This Week, This Month)
  - Rating (4+ stars, 3+ stars)
  - Gender (Male, Female, Any)
  - Years of experience (0-5, 5-10, 10-20, 20+)
- ✅ Sort options:
  - Relevance
  - Rating (High to Low)
  - Name (A-Z)
  - Experience (Most to Least)
  - Next Available
- ✅ Doctor card shows:
  - Profile photo
  - Name and title
  - Specialization
  - Rating with star display
  - Number of reviews
  - Next available slot
  - "Book Now" button
- ✅ Doctor profile page includes:
  - Full bio/about section
  - Education & certifications
  - Languages spoken
  - Clinic address(es)
  - Working hours
  - Patient reviews & ratings
  - Available appointment slots
  - "Book Appointment" CTA button

---

### FR-P5: Profile Management (Mobile App)
**Priority:** MEDIUM  
**Description:** The system shall allow patients to view and update their personal information, medical profile, and account settings.

**Acceptance Criteria:**
- ✅ Profile sections:
  - Personal Information (Name, Email, Phone, Emergency Contact)
  - Medical Information (DOB, Gender, Blood Type, Allergies, Conditions, Medications)
  - Account Settings (Password, Notifications, Privacy)
- ✅ Edit profile picture/avatar
- ✅ Update personal details with validation
- ✅ Update medical history
- ✅ Change password (requires current password)
- ✅ Notification preferences:
  - Push notifications toggle
  - Email notifications toggle
  - SMS notifications toggle
  - Appointment reminders
  - Marketing communications
- ✅ Privacy settings:
  - Who can see medical records
  - Data sharing preferences
- ✅ Language selection
- ✅ Delete account option (with confirmation)
- ✅ Logout button

---

### FR-P6: Notifications (Mobile App)
**Priority:** MEDIUM  
**Description:** The system shall send timely notifications to patients for appointment confirmations, reminders, cancellations, and important updates.

**Acceptance Criteria:**
- ✅ Notification types:
  - Appointment confirmed
  - Appointment reminder (24 hours before)
  - Appointment reminder (2 hours before)
  - Appointment cancelled by doctor
  - Appointment rescheduled
  - New medical record available
  - Prescription ready
  - System announcements
- ✅ Push notifications appear on lock screen
- ✅ In-app notification center shows all notifications
- ✅ Notification badges on app icon
- ✅ Tap notification to open relevant screen
- ✅ Mark as read functionality
- ✅ Clear all notifications option
- ✅ Notification settings in profile

---

### FR-P7: Emergency Contact (Mobile App)
**Priority:** HIGH  
**Description:** The system shall provide quick access to emergency contact information and urgent care options.

**Acceptance Criteria:**
- ✅ Emergency button on dashboard (prominent placement)
- ✅ Emergency contact screen displays:
  - Clinic emergency number (click to call)
  - Ambulance service number
  - Nearest hospital/clinic with map
  - Patient's emergency contact person
- ✅ Quick call buttons for each number
- ✅ Location services to find nearest facility
- ✅ "I'm in an emergency" alert option to notify clinic

---

### FR-P8: Reviews & Ratings (Mobile App)
**Priority:** LOW  
**Description:** The system shall allow patients to rate and review doctors after completed appointments.

**Acceptance Criteria:**
- ✅ Rate doctor prompt appears after completed appointment
- ✅ Star rating (1-5 stars)
- ✅ Written review (optional, max 500 characters)
- ✅ Review categories: Professionalism, Communication, Wait Time, Overall Experience
- ✅ Submit review
- ✅ View own submitted reviews
- ✅ Edit review within 48 hours of submission
- ✅ Reviews displayed on doctor profile (anonymized)

---

### FR-P9: Help & Support (Mobile App)
**Priority:** LOW  
**Description:** The system shall provide patients with help documentation, FAQs, and customer support access.

**Acceptance Criteria:**
- ✅ Help center with searchable FAQs
- ✅ Categories: Account, Appointments, Medical Records, Billing, Technical
- ✅ Contact support options:
  - Email support
  - Phone support
  - Live chat (if available)
- ✅ Submit feedback form
- ✅ App version information
- ✅ Terms of Service link
- ✅ Privacy Policy link

---

## 📋 PATIENT MOBILE APP - USE CASES

### UC1: Patient Registration
**Actor:** Patient  
**Precondition:** Patient has the DigiHealth mobile app installed on their device.  
**Trigger:** Patient opens the app for the first time or selects "Sign Up"

**Main Flow:**
1. Patient opens the DigiHealth mobile app
2. System displays welcome screen with two options:
   - "Sign Up with Google"
   - "Sign Up with Email"
3. **Path A: Google OAuth Registration**
   - 3a. Patient taps "Sign Up with Google"
   - 3b. System redirects to Google authentication
   - 3c. Patient selects Google account and grants permissions
   - 3d. System retrieves name, email, and profile picture from Google
   - 3e. System auto-fills registration form
   - 3f. Skip to step 5
4. **Path B: Manual Registration**
   - 4a. Patient taps "Sign Up with Email"
   - 4b. System displays registration form
   - 4c. Patient enters:
     - Full Name
     - Email Address
     - Password (with confirmation)
     - Phone Number
     - Emergency Contact Name & Number
   - 4d. Patient taps "Continue"
5. System displays medical profile form
6. Patient completes medical information:
   - Date of Birth
   - Gender
   - Blood Type
   - Allergies (if any)
   - Existing Medical Conditions (if any)
   - Current Medications (if any)
7. Patient reviews and accepts Terms of Service and Privacy Policy
8. Patient taps "Create Account"
9. System validates all inputs
10. System creates patient account with unique ID
11. System sends confirmation email
12. System displays success message
13. System redirects patient to dashboard

**Alternative Flows:**
- **A1: Email Already Exists**
  - At step 9, system detects email is already registered
  - System displays error: "This email is already registered. Please sign in."
  - System provides "Sign In" button
- **A2: Validation Errors**
  - At step 9, system detects invalid input (weak password, invalid email format)
  - System highlights error fields with specific messages
  - Patient corrects errors and resubmits
- **A3: Google Account Already Linked**
  - At step 3d, system detects Google account already registered
  - System displays: "This Google account is already linked. Redirecting to sign in..."
  - System navigates to login screen

**Postcondition:** A new patient account is successfully created, patient is logged in, and redirected to the dashboard.

---

### UC2: Patient Login
**Actor:** Patient  
**Precondition:** Patient has an existing registered account.  
**Trigger:** Patient opens the app or taps "Sign In"

**Main Flow:**
1. Patient opens the DigiHealth app
2. System displays login screen with options:
   - "Sign In with Google"
   - Email input field
   - Password input field
   - "Forgot Password?" link
   - "Sign In" button
   - "Don't have an account? Sign Up" link
3. **Path A: Google OAuth Login**
   - 3a. Patient taps "Sign In with Google"
   - 3b. System redirects to Google authentication
   - 3c. Patient selects Google account
   - 3d. System validates Google token
   - 3e. Skip to step 7
4. **Path B: Email/Password Login**
   - 4a. Patient enters email address
   - 4b. Patient enters password
   - 4c. Patient optionally checks "Remember Me"
   - 4d. Patient taps "Sign In"
5. System validates credentials
6. System checks if account is active
7. System generates session token
8. System stores token securely
9. System displays success message
10. System redirects patient to dashboard/home screen

**Alternative Flows:**
- **A1: Invalid Credentials**
  - At step 5, credentials don't match
  - System displays error: "Invalid email or password"
  - System increments failed login counter
  - Patient can retry
- **A2: Too Many Failed Attempts**
  - After 5 failed login attempts
  - System locks account for 15 minutes
  - System displays: "Too many failed attempts. Please try again in 15 minutes or reset your password."
- **A3: Forgot Password**
  - Patient taps "Forgot Password?" link
  - System displays password reset screen
  - Patient enters email address
  - System sends password reset link via email
  - Patient receives email and clicks reset link
  - System displays new password entry screen
  - Patient enters and confirms new password
  - System updates password
  - System redirects to login screen
- **A4: Biometric Login**
  - If biometric is enabled and device supports it
  - System prompts for fingerprint/face ID
  - Patient authenticates with biometric
  - System validates and logs in patient

**Postcondition:** Patient is successfully logged in and can access appointment booking and profile management features.

---

### UC5: Browse Doctors and Book Appointment
**Actor:** Patient  
**Precondition:** Patient is logged in to the system.  
**Trigger:** Patient taps "Book Appointment" or navigates to "Find Doctors"

**Main Flow:**
1. Patient taps "Book Appointment" from dashboard
2. System displays doctor browsing screen with:
   - Search bar
   - Filter button
   - Sort dropdown
   - List of approved doctors
3. System shows all approved doctors with:
   - Profile picture
   - Name and specialization
   - Rating (stars)
   - Next available slot
4. Patient can optionally:
   - **Search by name:** Enter doctor name in search bar
   - **Filter by specialization:** Tap filter, select specialization(s)
   - **Sort results:** Select sort option (Name, Rating, Availability)
5. Patient browses the filtered/sorted list
6. Patient taps on a doctor card to view details
7. System displays doctor profile page with:
   - Full bio and credentials
   - Education and experience
   - Patient reviews
   - Available time slots calendar
8. Patient reviews doctor information
9. Patient taps "Book Appointment"
10. System displays appointment booking form with:
    - Selected doctor (pre-filled)
    - Date picker (calendar view)
    - Available time slots for selected date
    - Appointment type dropdown (General, Follow-up, Emergency)
    - Reason for visit (text field)
11. Patient selects preferred date
12. System displays available time slots for that date
13. Patient selects preferred time slot
14. Patient selects appointment type
15. Patient optionally enters reason for visit
16. System displays appointment summary:
    - Doctor name and specialization
    - Date and time
    - Appointment type
    - Estimated duration
    - Clinic address
17. Patient reviews summary
18. Patient taps "Confirm Booking"
19. System validates slot availability (not double-booked)
20. System creates appointment record
21. System sends push notification to patient: "Appointment confirmed!"
22. System sends email confirmation to patient with appointment details
23. System sends notification to doctor about new appointment
24. System displays success screen with:
    - "Appointment Booked!" message
    - Appointment details
    - "Add to Calendar" button
    - "View My Appointments" button
25. Appointment appears in patient's "My Appointments" list
26. Appointment appears in doctor's dashboard

**Alternative Flows:**
- **A1: No Available Slots**
  - At step 12, selected date has no available slots
  - System displays: "No available slots for this date. Please choose another date."
  - Patient selects different date
- **A2: Slot Becomes Unavailable**
  - At step 19, another patient booked the same slot
  - System displays error: "Sorry, this slot was just booked by another patient. Please select a different time."
  - System returns to step 12 with refreshed availability
- **A3: Doctor Not Available**
  - At step 7, doctor has no available slots in next 30 days
  - System displays message: "This doctor has no available slots in the next 30 days."
  - System suggests: "Try another doctor" or "Check back later"
- **A4: Network Error**
  - At step 19, network connection fails
  - System displays: "Connection error. Please check your internet and try again."
  - Patient taps "Retry"

**Postcondition:** Appointment is successfully booked and visible in both patient and doctor dashboards. Notifications are sent to both parties.

---

### UC-P1: View and Manage My Appointments
**Actor:** Patient  
**Precondition:** Patient is logged in and has at least one appointment.  
**Trigger:** Patient taps "My Appointments" from navigation menu

**Main Flow:**
1. Patient navigates to "My Appointments" screen
2. System displays appointment list with tabs:
   - Upcoming (default)
   - Past
   - Cancelled
3. System shows appointments in selected tab
4. Each appointment card displays:
   - Doctor photo and name
   - Date and time
   - Specialization
   - Status badge
   - Appointment type
5. Patient taps on an appointment card
6. System displays appointment detail screen:
   - Complete appointment information
   - Doctor contact details
   - Clinic location with map
   - Appointment notes
   - Action buttons (Cancel, Reschedule, Add to Calendar)
7. **Path A: Cancel Appointment**
   - 7a. Patient taps "Cancel Appointment"
   - 7b. System displays confirmation dialog: "Are you sure you want to cancel?"
   - 7c. System shows optional reason field
   - 7d. Patient confirms cancellation
   - 7e. System updates appointment status to "Cancelled"
   - 7f. System sends notification to doctor
   - 7g. System sends confirmation to patient
   - 7h. Appointment moves to "Cancelled" tab
8. **Path B: Reschedule Appointment**
   - 8a. Patient taps "Reschedule"
   - 8b. System opens booking flow with doctor pre-selected
   - 8c. Patient selects new date and time
   - 8d. System confirms new appointment
   - 8e. System cancels old appointment
   - 8f. System creates new appointment record
   - 8g. System notifies doctor of change
9. **Path C: Add to Calendar**
   - 9a. Patient taps "Add to Calendar"
   - 9b. System exports appointment to device calendar
   - 9c. System displays success message

**Alternative Flows:**
- **A1: Cancel Too Late**
  - At step 7a, appointment is within cancellation deadline (e.g., 24 hours)
  - System displays: "Cancellation deadline has passed. Please contact clinic directly."
  - Cancel button is disabled
- **A2: Past Appointment**
  - Patient viewing past appointment
  - Only "View Details" available
  - Cancel and Reschedule buttons not shown

**Postcondition:** Patient can view, cancel, or reschedule appointments. System updates all records and sends notifications.

---

### UC-P2: View Medical Records
**Actor:** Patient  
**Precondition:** Patient is logged in and has completed at least one appointment with medical notes.  
**Trigger:** Patient taps "Medical Records" from navigation menu

**Main Flow:**
1. Patient navigates to "Medical Records" screen
2. System retrieves all medical records for the patient
3. System displays records list grouped by consultation date (most recent first)
4. Each record card shows:
   - Consultation date
   - Doctor name and photo
   - Diagnosis summary
   - "View Details" button
5. Patient taps on a record to view details
6. System displays full medical record:
   - Date of consultation
   - Doctor name and specialization
   - Complete diagnosis
   - Prescribed medications with dosage and duration
   - Doctor's clinical notes
   - Follow-up instructions
   - Attached documents/test results (if any)
7. Patient can:
   - **Download prescription:** Tap "Download PDF"
   - **Share record:** Tap "Share" and select method (email, messaging)
   - **Print record:** Tap "Print" (if printer available)
8. **Path A: Download PDF**
   - 8a. Patient taps "Download PDF"
   - 8b. System generates PDF of medical record
   - 8c. System saves to device downloads folder
   - 8d. System displays: "Downloaded successfully"
9. **Path B: Share Record**
   - 9a. Patient taps "Share"
   - 9b. System displays share options (Email, Messages, WhatsApp, etc.)
   - 9c. Patient selects sharing method
   - 9d. System prepares record for sharing
   - 9e. Patient sends to recipient

**Alternative Flows:**
- **A1: No Records Available**
  - At step 2, patient has no medical records
  - System displays: "No medical records available yet. Your records will appear here after doctor consultations."
- **A2: Search Records**
  - Patient uses search bar
  - Enter doctor name or diagnosis keyword
  - System filters records by search term
- **A3: Filter by Date Range**
  - Patient taps filter icon
  - Selects date range
  - System shows only records within range

**Postcondition:** Patient can view, download, and share their medical records securely.

---

### UC-P3: Update Profile and Settings
**Actor:** Patient  
**Precondition:** Patient is logged in.  
**Trigger:** Patient taps "Profile" or "Settings" from navigation menu

**Main Flow:**
1. Patient navigates to Profile/Settings screen
2. System displays profile sections:
   - Profile Picture
   - Personal Information
   - Medical Information
   - Account Settings
   - Notification Preferences
   - Privacy Settings
   - Help & Support
3. **Path A: Update Personal Information**
   - 3a. Patient taps "Personal Information"
   - 3b. System displays editable form with current data
   - 3c. Patient updates fields (Name, Email, Phone, Emergency Contact)
   - 3d. Patient taps "Save Changes"
   - 3e. System validates inputs
   - 3f. System updates database
   - 3g. System displays success message
4. **Path B: Update Medical Information**
   - 4a. Patient taps "Medical Information"
   - 4b. System displays medical profile form
   - 4c. Patient updates: Allergies, Conditions, Medications, Blood Type
   - 4d. Patient taps "Save Changes"
   - 4e. System updates medical profile
   - 4f. System displays confirmation
5. **Path C: Change Password**
   - 5a. Patient taps "Change Password"
   - 5b. System displays password change form
   - 5c. Patient enters current password
   - 5d. Patient enters new password (twice)
   - 5e. System validates current password
   - 5f. System checks new password strength
   - 5g. System updates password
   - 5h. System logs out user
   - 5i. System redirects to login screen
6. **Path D: Notification Preferences**
   - 6a. Patient taps "Notification Preferences"
   - 6b. System displays notification toggles:
     - Push Notifications
     - Email Notifications
     - SMS Notifications
     - Appointment Reminders
     - Marketing Communications
   - 6c. Patient toggles preferences
   - 6d. System auto-saves changes
7. **Path E: Delete Account**
   - 7a. Patient taps "Delete Account"
   - 7b. System displays warning: "This action cannot be undone. All data will be permanently deleted."
   - 7c. Patient confirms deletion
   - 7d. System asks for password confirmation
   - 7e. Patient enters password
   - 7f. System deletes patient account and all associated data
   - 7g. System displays farewell message
   - 7h. System redirects to welcome screen

**Alternative Flows:**
- **A1: Validation Error**
  - At step 3e or 4e, invalid input detected
  - System highlights error fields
  - Patient corrects and resubmits
- **A2: Wrong Current Password**
  - At step 5e, current password doesn't match
  - System displays error: "Current password is incorrect"
  - Patient re-enters

**Postcondition:** Patient profile and settings are updated successfully. Changes are reflected throughout the app.

---

### UC-P4: Rate and Review Doctor
**Actor:** Patient  
**Precondition:** Patient has completed an appointment with a doctor.  
**Trigger:** System prompts patient to rate doctor 24 hours after completed appointment, or patient manually navigates to review screen

**Main Flow:**
1. System sends notification: "How was your appointment with Dr. [Name]?"
2. Patient taps notification or navigates to appointment history
3. Patient taps "Write Review" on completed appointment
4. System displays review screen:
   - Doctor name and photo
   - Star rating selector (1-5 stars)
   - Review text area (max 500 characters)
   - Category ratings:
     - Professionalism (1-5 stars)
     - Communication (1-5 stars)
     - Wait Time (1-5 stars)
     - Overall Experience (1-5 stars)
5. Patient selects overall star rating
6. Patient optionally rates individual categories
7. Patient writes review text (optional)
8. Patient taps "Submit Review"
9. System validates review (at least overall rating required)
10. System saves review to database
11. System links review to doctor profile
12. System updates doctor's average rating
13. System displays thank you message: "Thank you for your feedback!"
14. Review appears on doctor's profile page (anonymized - shows only first name)

**Alternative Flows:**
- **A1: No Rating Selected**
  - At step 9, patient didn't select rating
  - System displays: "Please select a star rating before submitting"
- **A2: Edit Previous Review**
  - Patient wants to edit existing review
  - Patient taps "Edit Review" on appointment
  - System loads previous review data
  - Patient modifies review
  - System updates review (allowed within 48 hours)
- **A3: Review Already Submitted**
  - At step 3, review already exists
  - System shows "Edit Review" instead of "Write Review"
  - After 48 hours, editing is disabled

**Postcondition:** Patient review is submitted and displayed on doctor profile. Doctor's rating is updated.

---

### UC-P5: Emergency Contact Access
**Actor:** Patient  
**Precondition:** Patient has the app installed and opened (login not required for emergency features).  
**Trigger:** Patient taps "Emergency" button or needs urgent medical assistance

**Main Flow:**
1. Patient taps prominent "Emergency" button (visible on all screens)
2. System immediately displays emergency screen with large, clear buttons:
   - "Call Clinic Emergency Line" with phone number
   - "Call Ambulance" with emergency services number
   - "Find Nearest Hospital" with map icon
   - "Alert My Emergency Contact"
3. **Path A: Call Clinic**
   - 3a. Patient taps "Call Clinic Emergency Line"
   - 3b. System initiates phone call to clinic emergency number
   - 3c. Patient speaks with clinic emergency staff
4. **Path B: Call Ambulance**
   - 4a. Patient taps "Call Ambulance"
   - 4b. System displays confirmation: "You are about to call 911 (or local emergency number)"
   - 4c. Patient confirms
   - 4d. System initiates emergency call
5. **Path C: Find Nearest Hospital**
   - 5a. Patient taps "Find Nearest Hospital"
   - 5b. System requests location permission (if not granted)
   - 5c. System detects patient's current location
   - 5d. System searches for nearby hospitals/clinics
   - 5e. System displays map with nearest facilities
   - 5f. System shows distance and estimated travel time
   - 5g. Patient can tap facility for directions
   - 5h. System opens maps app with navigation
6. **Path D: Alert Emergency Contact**
   - 6a. Patient taps "Alert My Emergency Contact"
   - 6b. System retrieves patient's emergency contact from profile
   - 6c. System sends SMS to emergency contact: "Emergency alert from [Patient Name] via DigiHealth app. Location: [GPS coordinates/address]"
   - 6d. System calls emergency contact automatically
   - 6e. System displays confirmation

**Alternative Flows:**
- **A1: No Emergency Contact Set**
  - At step 6b, no emergency contact in profile
  - System displays: "No emergency contact set. Please add one in your profile."
  - System provides option to add now or skip
- **A2: Location Services Disabled**
  - At step 5c, location services are off
  - System displays: "Location services required to find nearest hospital"
  - System provides button to open settings
- **A3: No Network Connection**
  - System displays cached emergency numbers
  - Phone call functions still work
  - Map features unavailable

**Postcondition:** Patient can quickly access emergency services or locate nearest medical facility. Emergency contact is notified if needed.

---

## 📱 PATIENT MOBILE APP - SCREEN FLOW DIAGRAM

```
┌─────────────────┐
│  Welcome/Login  │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼──────┐
│ Login │ │ Sign Up │
└───┬───┘ └────┬────┘
    │          │
    └────┬─────┘
         │
    ┌────▼────────┐
    │  Dashboard  │◄──────────────┐
    │   (Home)    │               │
    └─┬─┬─┬─┬─┬───┘               │
      │ │ │ │ │                   │
  ┌───┘ │ │ │ └───┐               │
  │     │ │ │     │               │
┌─▼──┐┌─▼┐│┌▼─┐ ┌─▼────────┐     │
│Book││My││Med││ Profile   │     │
│Appt││Appt│Rec││ Settings  │     │
└─┬──┘└─┬┘│└┬─┘ └────┬─────┘     │
  │     │ │ │        │           │
  │  ┌──▼─▼─▼──┐     │           │
  │  │Emergency│     │           │
  │  │ Contact │     │           │
  │  └─────────┘     │           │
  │                  │           │
┌─▼────────────┐  ┌──▼──────────┐│
│Find Doctors  │  │Edit Profile ││
│& Search      │  │& Settings   ││
└──┬───────────┘  └─────────────┘│
   │                             │
┌──▼──────────┐                  │
│Doctor       │                  │
│Profile      │                  │
└──┬──────────┘                  │
   │                             │
┌──▼──────────┐                  │
│Book         │                  │
│Appointment  │                  │
│Form         │                  │
└──┬──────────┘                  │
   │                             │
┌──▼──────────┐                  │
│Confirmation │──────────────────┘
│Success      │
└─────────────┘
```

---

## 🎨 PATIENT MOBILE APP - DESIGN REQUIREMENTS

### Visual Design System
- **Color Scheme:**
  - Primary: Blue-Green Gradient (#0093E9 → #80D0C7)
  - Success: #10B981 (Green)
  - Warning: #F59E0B (Orange)
  - Error: #EF4444 (Red)
  - Background: #F9FAFB (Light Gray)
  - Card Background: #FFFFFF (White)
  - Text Primary: #111827 (Dark Gray)
  - Text Secondary: #6B7280 (Medium Gray)

- **Typography:**
  - Headers: Bold, 24-32px
  - Subheaders: Semi-bold, 18-20px
  - Body: Regular, 14-16px
  - Captions: Regular, 12-14px

- **Components:**
  - Rounded corners: 12px for cards, 8px for buttons
  - Shadows: Subtle elevation (0 2px 8px rgba(0,0,0,0.1))
  - Icons: Use lucide-react or similar, 20-24px size
  - Avatar/Profile pics: Circular, 40-60px
  - Doctor photos: Rounded square (16px radius), 80x80px minimum

### Navigation Pattern
- **Tab Bar Navigation** (Bottom)
  - Home/Dashboard
  - Find Doctors
  - My Appointments
  - Medical Records
  - Profile

- **Top Navigation**
  - Back button (where applicable)
  - Screen title
  - Action buttons (Search, Filter, etc.)

### Key Screen Requirements

#### 1. **Login/Sign Up Screen**
- Large app logo at top
- "Sign in with Google" button (white background, Google logo)
- Divider: "OR"
- Email input field
- Password input field (with show/hide toggle)
- "Remember Me" checkbox
- "Sign In" button (gradient)
- "Forgot Password?" link
- "Don't have an account? Sign Up" link at bottom

#### 2. **Dashboard/Home Screen**
- Welcome message with user's first name
- Profile picture in top right
- Emergency button (red, prominent) in top left
- Quick stats cards:
  - Next appointment (date, doctor, time)
  - Total appointments
  - Pending prescriptions
- Quick action buttons grid (2x2):
  - Book Appointment
  - Find Doctors
  - Medical Records
  - Emergency Contact
- Upcoming appointments list (next 3)
- Recent notifications section

#### 3. **Find Doctors Screen**
- Search bar at top
- Filter button (shows filter count if active)
- Sort dropdown
- Doctor cards list:
  - Photo (left)
  - Name and specialization (top)
  - Rating stars with review count
  - Next available slot
  - "Book Now" button (right)
- Pull to refresh
- Infinite scroll/pagination

#### 4. **Doctor Profile Screen**
- Large doctor photo at top
- Name and title
- Specialization
- Rating stars with total reviews
- Tabs:
  - About (bio, education, experience)
  - Availability (calendar with available slots)
  - Reviews (patient reviews list)
- Floating "Book Appointment" button at bottom

#### 5. **Book Appointment Screen**
- Progress indicator (Step 1 of 3, etc.)
- Selected doctor summary card (top)
- Calendar date picker (highlight available dates)
- Time slot selection grid
- Appointment type dropdown
- Reason for visit text area
- "Continue" button
- Back button

#### 6. **Appointment Confirmation Screen**
- Success checkmark animation
- "Appointment Booked!" message
- Appointment summary card:
  - Doctor info
  - Date and time
  - Type
  - Location with map preview
- "Add to Calendar" button
- "View My Appointments" button
- "Back to Home" button

#### 7. **My Appointments Screen**
- Tabs: Upcoming | Past | Cancelled
- Appointment cards:
  - Doctor photo and name
  - Date and time
  - Status badge
  - Specialization
  - Tap to view details
- Empty state: "No appointments yet" with "Book Now" CTA
- Swipe actions: Cancel | Reschedule

#### 8. **Appointment Details Screen**
- Full appointment information
- Doctor contact card
- Location card with map
- "Get Directions" button
- "Cancel Appointment" button (red outline)
- "Reschedule" button (blue outline)
- "Add to Calendar" button
- "Call Doctor" button

#### 9. **Medical Records Screen**
- Search bar
- Filter by date range
- Records list (grouped by month):
  - Date
  - Doctor name
  - Diagnosis summary
  - "View Details" chevron
- Tap to expand full record
- Download PDF button
- Share button

#### 10. **Profile/Settings Screen**
- Profile picture (tap to change)
- Name and email
- Settings sections:
  - Personal Information (chevron to edit screen)
  - Medical Information (chevron to edit screen)
  - Account Settings (chevron)
  - Notification Preferences (chevron)
  - Help & Support (chevron)
  - Privacy Policy (link)
  - Terms of Service (link)
  - App Version (text)
- "Logout" button at bottom (red)

#### 11. **Emergency Contact Screen**
- Red theme/accent
- Large, finger-friendly buttons:
  - "Call Clinic Emergency" (phone icon, large)
  - "Call Ambulance" (ambulance icon, large)
  - "Find Nearest Hospital" (location icon, large)
  - "Alert Emergency Contact" (person icon, large)
- Each button shows phone number or relevant info
- Back to safety note at bottom

---

## 📲 PATIENT MOBILE APP - TECHNICAL REQUIREMENTS

### Platform
- **iOS:** Version 14.0+
- **Android:** Version 8.0+ (API Level 26+)
- **Framework:** React Native or Flutter (for cross-platform)
- **Alternative:** Native iOS (Swift) + Native Android (Kotlin)

### APIs & Integrations
- **Authentication:**
  - Google OAuth 2.0 SDK
  - JWT token-based auth for email/password
  - Biometric authentication (Face ID, Touch ID, Fingerprint)

- **Backend API:**
  - RESTful API or GraphQL
  - Base URL: `https://api.digihealth.com/v1/`
  - Endpoints:
    - `/auth/register` - Patient registration
    - `/auth/login` - Patient login
    - `/auth/google` - Google OAuth
    - `/doctors` - Get all doctors
    - `/doctors/:id` - Get doctor details
    - `/appointments` - CRUD appointments
    - `/medical-records/:patientId` - Get records
    - `/profile` - Update patient profile
    - `/notifications` - Get notifications

- **Push Notifications:**
  - Firebase Cloud Messaging (FCM) for Android
  - Apple Push Notification Service (APNs) for iOS
  - OneSignal or similar service

- **Maps & Location:**
  - Google Maps SDK (Android)
  - Apple Maps / MapKit (iOS)
  - Geolocation API

- **Calendar Integration:**
  - EventKit (iOS)
  - Calendar Provider (Android)

### Data Storage
- **Local Storage:**
  - Secure storage for auth tokens
  - AsyncStorage / SharedPreferences for user preferences
  - SQLite for offline data caching

- **Backend Database:**
  - PostgreSQL or MySQL
  - Supabase (recommended for rapid development)

### Security
- **SSL/TLS:** All API calls over HTTPS
- **Data Encryption:** Encrypt sensitive data at rest
- **Token Management:** Secure token storage (Keychain/Keystore)
- **HIPAA Compliance:** Ensure medical data handling meets regulations
- **Privacy:** Request minimal permissions, clear privacy policy

### Performance
- **Loading Times:**
  - Initial app load: < 2 seconds
  - Screen transitions: < 300ms
  - API responses: < 1 second
- **Offline Mode:**
  - Cache recent appointments
  - Cache medical records
  - Queue actions when offline, sync when online
- **Image Optimization:**
  - Lazy load images
  - Use CDN for doctor photos
  - WebP format for smaller file sizes

### Accessibility
- **WCAG 2.1 AA Compliance:**
  - Screen reader support (VoiceOver, TalkBack)
  - Minimum touch target size: 44x44dp
  - Sufficient color contrast (4.5:1)
  - Text scalability
  - Keyboard navigation support

---

## 🚀 PATIENT MOBILE APP - IMPLEMENTATION ROADMAP

### Phase 1: Core Authentication (Week 1-2)
- ✅ Patient registration (manual + Google OAuth)
- ✅ Patient login (email/password + Google)
- ✅ Password reset functionality
- ✅ Profile setup

### Phase 2: Doctor Discovery & Booking (Week 3-4)
- ✅ Browse doctors list
- ✅ Search and filter doctors
- ✅ Doctor profile view
- ✅ Book appointment flow
- ✅ Appointment confirmation

### Phase 3: Appointment Management (Week 5-6)
- ✅ View appointments (upcoming, past, cancelled)
- ✅ Appointment details
- ✅ Cancel appointment
- ✅ Reschedule appointment
- ✅ Calendar integration

### Phase 4: Medical Records (Week 7-8)
- ✅ View medical records
- ✅ Download prescriptions
- ✅ Share records
- ✅ Search and filter records

### Phase 5: Profile & Settings (Week 9)
- ✅ Update personal information
- ✅ Update medical profile
- ✅ Notification preferences
- ✅ Change password
- ✅ Account deletion

### Phase 6: Notifications & Alerts (Week 10)
- ✅ Push notifications setup
- ✅ In-app notification center
- ✅ Appointment reminders
- ✅ Email notifications

### Phase 7: Emergency Features (Week 11)
- ✅ Emergency contact screen
- ✅ Quick call functionality
- ✅ Find nearest hospital
- ✅ Alert emergency contact

### Phase 8: Reviews & Feedback (Week 12)
- ✅ Rate doctors
- ✅ Write reviews
- ✅ View own reviews
- ✅ Help & support

### Phase 9: Polish & Testing (Week 13-14)
- ✅ UI/UX refinements
- ✅ Performance optimization
- ✅ Bug fixes
- ✅ Security audit
- ✅ Beta testing

### Phase 10: Launch (Week 15)
- ✅ App Store submission (iOS)
- ✅ Google Play submission (Android)
- ✅ Marketing materials
- ✅ User onboarding
- ✅ Launch! 🚀

---

## 📝 NOTES FOR FIGMA DESIGN

### Recommended Figma Workflow
1. **Create Components:**
   - Button (Primary, Secondary, Outline, Danger)
   - Input Field (Text, Password, Dropdown, Date)
   - Card (Appointment, Doctor, Medical Record)
   - Navigation Bar (Top, Bottom Tab)
   - Avatar (Small, Medium, Large)
   - Badge/Chip (Status indicators)

2. **Design Screens:**
   - Start with low-fidelity wireframes
   - Progress to high-fidelity mockups
   - Create interactive prototype with transitions
   - Use auto-layout for responsive design

3. **Mobile Specific Considerations:**
   - Design for iOS (375x812 - iPhone 13 mini) and Android (360x800 - standard)
   - Include safe areas for notches
   - Design both light and dark modes
   - Account for keyboard visibility
   - Design loading and error states

4. **Assets to Prepare:**
   - App icon (1024x1024)
   - Splash screen
   - Empty state illustrations
   - Success/error icons
   - Doctor placeholder avatar
   - Medical icons set

5. **Interactive Prototype:**
   - Login flow
   - Appointment booking flow
   - Emergency contact flow
   - Settings/profile update flow

---

## ✅ CHECKLIST FOR COMPLETE PATIENT APP

### Must-Have Features (MVP)
- ✅ Patient registration & login
- ✅ Browse and search doctors
- ✅ Book appointments
- ✅ View appointments
- ✅ Cancel appointments
- ✅ View medical records
- ✅ Update profile
- ✅ Emergency contact

### Nice-to-Have Features (V2)
- ⭐ Telemedicine (video consultations)
- ⭐ Chat with doctor
- ⭐ Medication reminders
- ⭐ Health tracking (vitals, symptoms)
- ⭐ Insurance integration
- ⭐ Payment processing
- ⭐ Prescription refill requests
- ⭐ Health articles/blog
- ⭐ Family member profiles
- ⭐ Appointment waitlist

---

**This comprehensive FRS document provides everything needed to design and develop the DigiHealth Patient Mobile App in Figma and beyond!** 🎨📱
