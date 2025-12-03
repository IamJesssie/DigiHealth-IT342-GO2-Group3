import { useState } from 'react';
import { PatientMobileLayout } from './PatientMobileLayout';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar, Clock, User, Heart, Activity, FileText, Plus, ChevronRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface PatientDashboardProps {
  patient: any;
  onNavigate: (screen: string, data?: any) => void;
  onLogout: () => void;
}

export function PatientDashboard({ patient, onNavigate, onLogout }: PatientDashboardProps) {
  const [currentScreen, setCurrentScreen] = useState<'dashboard' | 'appointments' | 'records' | 'search' | 'profile'>('dashboard');

  // Mock data - will be replaced with real API calls
  const upcomingAppointments = [
    {
      id: '1',
      doctorName: 'Dr. Sarah Johnson',
      specialization: 'Cardiologist',
      date: '2024-12-05',
      time: '10:00 AM',
      type: 'Follow-up',
      doctorImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    },
    {
      id: '2',
      doctorName: 'Dr. Michael Chen',
      specialization: 'General Physician',
      date: '2024-12-08',
      time: '2:30 PM',
      type: 'General Checkup',
      doctorImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    },
  ];

  const healthSummary = {
    bloodPressure: '120/80',
    heartRate: '72 bpm',
    lastCheckup: '15 days ago',
    pendingReports: 2,
  };

  const quickActions = [
    { id: 'book', label: 'Book Appointment', icon: Plus, color: 'from-blue-500 to-cyan-500' },
    { id: 'appointments', label: 'My Appointments', icon: Calendar, color: 'from-purple-500 to-pink-500' },
    { id: 'records', label: 'Medical Records', icon: FileText, color: 'from-green-500 to-emerald-500' },
    { id: 'search', label: 'Find Doctors', icon: User, color: 'from-orange-500 to-red-500' },
  ];

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
    setCurrentScreen(screen as any);
    onNavigate(mappedScreen);
  };

  const handleQuickAction = (actionId: string) => {
    if (actionId === 'book') {
      onNavigate('book-appointment');
    } else {
      handleNavigation(actionId);
    }
  };

  return (
    <PatientMobileLayout
      currentScreen={currentScreen}
      onNavigate={handleNavigation}
      patient={patient}
      notificationCount={3}
    >
      <div className="p-4 space-y-6">
        {/* Health Summary Card */}
        <Card className="shadow-md" style={{
          background: 'linear-gradient(135deg, #0093E9 0%, #80D0C7 100%)'
        }}>
          <CardContent className="p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium opacity-90">Health Summary</h3>
                <p className="text-sm opacity-75">Last updated: Today</p>
              </div>
              <Heart className="h-8 w-8 opacity-80" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="h-4 w-4" />
                  <span className="text-xs opacity-90">Blood Pressure</span>
                </div>
                <p className="text-xl font-semibold">{healthSummary.bloodPressure}</p>
              </div>
              
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Heart className="h-4 w-4" />
                  <span className="text-xs opacity-90">Heart Rate</span>
                </div>
                <p className="text-xl font-semibold">{healthSummary.heartRate}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div>
          <h3 className="font-semibold mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => handleQuickAction(action.id)}
                  className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div 
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-gradient-to-br ${action.color}`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-sm font-medium text-left">{action.label}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Upcoming Appointments</h3>
            <Button 
              variant="link" 
              className="px-0 h-auto"
              onClick={() => handleNavigation('appointments')}
            >
              View All
            </Button>
          </div>
          
          {upcomingAppointments.length > 0 ? (
            <div className="space-y-3">
              {upcomingAppointments.map((appointment) => (
                <Card 
                  key={appointment.id} 
                  className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onNavigate('appointment-details', appointment)}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={appointment.doctorImage} alt={appointment.doctorName} />
                        <AvatarFallback>{appointment.doctorName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold">{appointment.doctorName}</p>
                            <p className="text-sm text-muted-foreground">{appointment.specialization}</p>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {appointment.type}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(appointment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{appointment.time}</span>
                          </div>
                        </div>
                      </div>
                      
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="shadow-sm">
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">No upcoming appointments</p>
                <Button 
                  onClick={() => onNavigate('book-appointment')}
                  style={{
                    background: 'linear-gradient(135deg, #0093E9 0%, #80D0C7 100%)'
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Book Appointment
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="font-semibold mb-3">Recent Activity</h3>
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3 pb-3 border-b last:border-0">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Appointment Completed</p>
                    <p className="text-xs text-muted-foreground">Dr. Sarah Johnson - General Checkup</p>
                    <p className="text-xs text-muted-foreground mt-1">2 days ago</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 pb-3 border-b last:border-0">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Medical Records Updated</p>
                    <p className="text-xs text-muted-foreground">Lab results added by Dr. Michael Chen</p>
                    <p className="text-xs text-muted-foreground mt-1">5 days ago</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Prescription Issued</p>
                    <p className="text-xs text-muted-foreground">View your new prescription</p>
                    <p className="text-xs text-muted-foreground mt-1">1 week ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PatientMobileLayout>
  );
}
