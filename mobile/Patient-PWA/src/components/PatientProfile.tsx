import { useState } from 'react';
import { PatientMobileLayout } from './PatientMobileLayout';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { User, Mail, Phone, Calendar, Heart, Shield, Bell, ChevronRight, LogOut, Camera, Edit2, Save } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Switch } from './ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';

interface PatientProfileProps {
  patient: any;
  onNavigate: (screen: string) => void;
  onLogout: () => void;
}

export function PatientProfile({ patient, onNavigate, onLogout }: PatientProfileProps) {
  const [currentScreen] = useState<'dashboard' | 'appointments' | 'records' | 'search' | 'profile'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState<'personal' | 'medical' | 'settings' | null>(null);

  const handleNavigation = (screen: string) => {
    // Map bottom nav IDs to actual screen names
    const screenMapping: { [key: string]: string } = {
      'dashboard': 'dashboard',
      'appointments': 'appointments',
      'search': 'search',
      'records': 'patient-records',
      'profile': 'patient-profile',
    };
    
    const mappedScreen = screenMapping[screen] || screen;
    onNavigate(mappedScreen);
  };

  // Personal Information State
  const [fullName, setFullName] = useState(patient?.name || 'John Doe');
  const [email, setEmail] = useState(patient?.email || 'john.doe@example.com');
  const [phone, setPhone] = useState(patient?.phone || '+1 (555) 000-0000');
  const [dateOfBirth, setDateOfBirth] = useState('1990-01-15');
  const [gender, setGender] = useState('male');
  const [address, setAddress] = useState('123 Main St, New York, NY 10001');

  // Medical Information State
  const [bloodType, setBloodType] = useState('O+');
  const [allergies, setAllergies] = useState('Penicillin, Peanuts');
  const [conditions, setConditions] = useState('Hypertension');
  const [medications, setMedications] = useState('Lisinopril 10mg daily');
  const [emergencyName, setEmergencyName] = useState('Jane Doe');
  const [emergencyPhone, setEmergencyPhone] = useState('+1 (555) 000-0001');

  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [appointmentReminders, setAppointmentReminders] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  const handleSave = () => {
    toast.success('Profile updated successfully');
    setIsEditing(false);
    setActiveSection(null);
  };

  const handleLogoutConfirm = () => {
    toast.success('Logged out successfully');
    onLogout();
  };

  const renderPersonalInfo = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={!isEditing}
          className="h-12"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={!isEditing}
          className="h-12"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={!isEditing}
          className="h-12"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dob">Date of Birth</Label>
        <Input
          id="dob"
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          disabled={!isEditing}
          className="h-12"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="gender">Gender</Label>
        <Select value={gender} onValueChange={setGender} disabled={!isEditing}>
          <SelectTrigger className="h-12">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          disabled={!isEditing}
          className="min-h-[80px]"
        />
      </div>
    </div>
  );

  const renderMedicalInfo = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="bloodType">Blood Type</Label>
        <Select value={bloodType} onValueChange={setBloodType} disabled={!isEditing}>
          <SelectTrigger className="h-12">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="A+">A+</SelectItem>
            <SelectItem value="A-">A-</SelectItem>
            <SelectItem value="B+">B+</SelectItem>
            <SelectItem value="B-">B-</SelectItem>
            <SelectItem value="AB+">AB+</SelectItem>
            <SelectItem value="AB-">AB-</SelectItem>
            <SelectItem value="O+">O+</SelectItem>
            <SelectItem value="O-">O-</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="allergies">Allergies</Label>
        <Textarea
          id="allergies"
          placeholder="E.g., Penicillin, Peanuts..."
          value={allergies}
          onChange={(e) => setAllergies(e.target.value)}
          disabled={!isEditing}
          className="min-h-[80px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="conditions">Medical Conditions</Label>
        <Textarea
          id="conditions"
          placeholder="E.g., Diabetes, Hypertension..."
          value={conditions}
          onChange={(e) => setConditions(e.target.value)}
          disabled={!isEditing}
          className="min-h-[80px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="medications">Current Medications</Label>
        <Textarea
          id="medications"
          placeholder="E.g., Aspirin 81mg daily..."
          value={medications}
          onChange={(e) => setMedications(e.target.value)}
          disabled={!isEditing}
          className="min-h-[80px]"
        />
      </div>

      <div className="border-t pt-4 space-y-4">
        <h4 className="font-medium flex items-center">
          <Heart className="h-4 w-4 mr-2 text-red-500" />
          Emergency Contact
        </h4>
        
        <div className="space-y-2">
          <Label htmlFor="emergencyName">Contact Name</Label>
          <Input
            id="emergencyName"
            value={emergencyName}
            onChange={(e) => setEmergencyName(e.target.value)}
            disabled={!isEditing}
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="emergencyPhone">Contact Phone</Label>
          <Input
            id="emergencyPhone"
            type="tel"
            value={emergencyPhone}
            onChange={(e) => setEmergencyPhone(e.target.value)}
            disabled={!isEditing}
            className="h-12"
          />
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      {/* Notification Settings */}
      <div>
        <h4 className="font-medium mb-4 flex items-center">
          <Bell className="h-4 w-4 mr-2" />
          Notifications
        </h4>
        
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive updates via email</p>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">SMS Notifications</p>
                <p className="text-sm text-muted-foreground">Receive updates via SMS</p>
              </div>
              <Switch
                checked={smsNotifications}
                onCheckedChange={setSmsNotifications}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Appointment Reminders</p>
                <p className="text-sm text-muted-foreground">24h before appointment</p>
              </div>
              <Switch
                checked={appointmentReminders}
                onCheckedChange={setAppointmentReminders}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Marketing Emails</p>
                <p className="text-sm text-muted-foreground">Health tips and offers</p>
              </div>
              <Switch
                checked={marketingEmails}
                onCheckedChange={setMarketingEmails}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Privacy Settings */}
      <div>
        <h4 className="font-medium mb-4 flex items-center">
          <Shield className="h-4 w-4 mr-2" />
          Privacy & Security
        </h4>
        
        <Card>
          <CardContent className="p-4 space-y-3">
            <button className="w-full flex items-center justify-between py-2">
              <span className="font-medium">Change Password</span>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
            
            <button className="w-full flex items-center justify-between py-2">
              <span className="font-medium">Privacy Policy</span>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
            
            <button className="w-full flex items-center justify-between py-2">
              <span className="font-medium">Terms of Service</span>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Danger Zone */}
      <div>
        <Card className="border-red-200">
          <CardContent className="p-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Account?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                    Yes, Delete My Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  if (activeSection) {
    return (
      <PatientMobileLayout
        currentScreen={currentScreen}
        onNavigate={handleNavigation}
        patient={patient}
        notificationCount={2}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setActiveSection(null);
                setIsEditing(false);
              }}
            >
              ← Back
            </Button>
            
            {activeSection !== 'settings' && (
              isEditing ? (
                <Button
                  size="sm"
                  onClick={handleSave}
                  style={{
                    background: 'linear-gradient(135deg, #0093E9 0%, #80D0C7 100%)'
                  }}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )
            )}
          </div>

          <h1 className="text-2xl font-bold mb-6">
            {activeSection === 'personal' && 'Personal Information'}
            {activeSection === 'medical' && 'Medical Information'}
            {activeSection === 'settings' && 'Settings & Privacy'}
          </h1>

          {activeSection === 'personal' && renderPersonalInfo()}
          {activeSection === 'medical' && renderMedicalInfo()}
          {activeSection === 'settings' && renderSettings()}
        </div>
      </PatientMobileLayout>
    );
  }

  return (
    <PatientMobileLayout
      currentScreen={currentScreen}
      onNavigate={handleNavigation}
      patient={patient}
      notificationCount={2}
    >
      <div className="p-4">
        {/* Profile Header */}
        <Card className="shadow-md mb-6" style={{
          background: 'linear-gradient(135deg, #0093E9 0%, #80D0C7 100%)'
        }}>
          <CardContent className="p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-20 w-20 border-4 border-white">
                  <AvatarImage src={patient?.profilePicture} alt={fullName} />
                  <AvatarFallback>{fullName.charAt(0)}</AvatarFallback>
                </Avatar>
                <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white text-gray-700 flex items-center justify-center shadow-lg">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{fullName}</h2>
                <p className="text-sm opacity-90">{email}</p>
                <p className="text-sm opacity-90">{phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Menu Sections */}
        <div className="space-y-4">
          <Card className="shadow-sm">
            <CardContent className="p-4 space-y-2">
              <button
                onClick={() => setActiveSection('personal')}
                className="w-full flex items-center justify-between py-3 hover:bg-gray-50 rounded-lg px-2"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Personal Information</p>
                    <p className="text-sm text-muted-foreground">Name, email, phone, address</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>

              <button
                onClick={() => setActiveSection('medical')}
                className="w-full flex items-center justify-between py-3 hover:bg-gray-50 rounded-lg px-2"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <Heart className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Medical Information</p>
                    <p className="text-sm text-muted-foreground">Allergies, conditions, medications</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>

              <button
                onClick={() => setActiveSection('settings')}
                className="w-full flex items-center justify-between py-3 hover:bg-gray-50 rounded-lg px-2"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Settings & Privacy</p>
                    <p className="text-sm text-muted-foreground">Notifications, security, preferences</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
            </CardContent>
          </Card>

          {/* Logout */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full h-12 text-red-600 hover:text-red-700 hover:bg-red-50">
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Logout</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to logout? You'll need to sign in again to access your account.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogoutConfirm}>
                  Logout
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* App Version */}
        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>DigiHealth Patient App</p>
          <p>Version 1.0.0 (MVP)</p>
        </div>
      </div>
    </PatientMobileLayout>
  );
}
