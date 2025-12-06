import { useState, useEffect } from 'react';
import { PatientMobileLayout } from './PatientMobileLayout';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar, Clock, User, Heart, Activity, FileText, Plus, ChevronRight, CheckCircle, ArrowRight, BookOpen, Stethoscope } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { toast } from 'sonner';

interface PatientDashboardProps {
  patient: any;
  onNavigate: (screen: string, data?: any) => void;
  onLogout: () => void;
}

interface Appointment {
  id: string;
  doctorName: string;
  specialization: string;
  date: string;
  time: string;
  type: string;
  doctorImage: string;
  status?: string;
}

export function PatientDashboard({ patient, onNavigate, onLogout }: PatientDashboardProps) {
  const [currentScreen, setCurrentScreen] = useState<'dashboard' | 'appointments' | 'records' | 'search' | 'profile'>('dashboard');
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWelcomeGuide, setShowWelcomeGuide] = useState(true);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [hoveredStep, setHoveredStep] = useState<string | null>(null);
  const [guideVisible, setGuideVisible] = useState(false);

  const API_BASE = (import.meta as any).env.VITE_API_BASE_URL || `http://${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}:8080`;

  useEffect(() => {
    fetchUpcomingAppointments();
    fetchRecentActivities();
    // Check if user is new (no appointments yet)
    const isNewUser = localStorage.getItem('isNewUser') === 'true';
    if (isNewUser) {
      setShowWelcomeGuide(true);
      // Animate guide in after mount
      setTimeout(() => setGuideVisible(true), 300);
    } else {
      setGuideVisible(true);
    }
  }, []);

  const fetchRecentActivities = async () => {
    // For now, return empty array since backend endpoint doesn't exist
    // This can be implemented later when backend adds the endpoint
    setRecentActivities([]);
    
    // Optional: If you want to show demo data for testing, uncomment below:
    /*
    if (upcomingAppointments.length > 0) {
      // Only show demo activities for users with appointments (not new users)
      const demoActivities = [
        {
          id: '1',
          title: 'Appointment Completed',
          description: 'Dr. Sarah Johnson - General Checkup',
          type: 'appointment',
          timestamp: '2 days ago'
        },
        {
          id: '2', 
          title: 'Medical Records Updated',
          description: 'Lab results added by Dr. Michael Chen',
          type: 'record',
          timestamp: '5 days ago'
        }
      ];
      setRecentActivities(demoActivities);
    }
    */
  };

  const fetchUpcomingAppointments = async () => {
    setLoading(true);
    const token = localStorage.getItem('accessToken');
    try {
      const res = await fetch(`${API_BASE}/api/appointments/patient/my`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        throw new Error((payload && (payload.message || payload.error)) || 'Failed to load appointments');
      }
      const data = await res.json();
      
      // Filter for upcoming appointments (status not 'COMPLETED' or 'CANCELLED')
      const upcoming = (data || [])
        .filter((a: any) => a.status !== 'COMPLETED' && a.status !== 'CANCELLED')
        .slice(0, 3) // Show only next 3 appointments
        .map((a: any) => ({
          id: a.id,
          doctorName: a.doctor?.user?.fullName || 'Dr. Unknown',
          specialization: a.doctor?.specialization || 'General Physician',
          date: a.appointmentDate,
          time: a.appointmentTime,
          type: a.reason || 'Consultation',
          doctorImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${a.doctor?.user?.fullName || 'Doctor'}`,
          status: a.status,
        }));
      
      setUpcomingAppointments(upcoming);
      
      // If user has appointments, they're not new anymore
      if (upcoming.length > 0) {
        localStorage.setItem('isNewUser', 'false');
        setShowWelcomeGuide(false);
      }
    } catch (error: any) {
      console.error('Error fetching appointments:', error);
      toast.error(error.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const welcomeSteps = [
    { id: 'profile', label: 'Complete your profile', icon: User, description: 'Add your medical history and emergency contacts' },
    { id: 'book', label: 'Book your first appointment', icon: Calendar, description: 'Find a doctor and schedule a consultation' },
    { id: 'records', label: 'View medical records', icon: FileText, description: 'Access your consultation history and prescriptions' },
    { id: 'doctors', label: 'Find trusted doctors', icon: Stethoscope, description: 'Browse specialists and read patient reviews' },
  ];

  const quickActions = [
    { id: 'book', label: 'Book Appointment', icon: Plus, color: 'from-blue-500 to-cyan-500' },
    { id: 'appointments', label: 'My Appointments', icon: Calendar, color: 'from-purple-500 to-pink-500' },
    { id: 'records', label: 'Medical Records', icon: FileText, color: 'from-green-500 to-emerald-500' },
    { id: 'search', label: 'Find Doctors', icon: User, color: 'from-orange-500 to-red-500' },
  ];

  const handleCompleteStep = (stepId: string) => {
    setCompletedSteps([...completedSteps, stepId]);
    if (stepId === 'book') {
      onNavigate('search');
    } else if (stepId === 'profile') {
      onNavigate('patient-profile');
    } else if (stepId === 'records') {
      onNavigate('patient-records');
    } else if (stepId === 'doctors') {
      onNavigate('search');
    }
  };

  const handleDismissWelcome = () => {
    setShowWelcomeGuide(false);
    localStorage.setItem('isNewUser', 'false');
  };

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
      onNavigate('search');
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
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
      <div className="p-4 space-y-6">
        {/* Welcome Guide for New Users - Horizontal Compact */}
        {showWelcomeGuide && (
          <Card 
            className={`shadow-lg border-blue-100 transition-all duration-500 ${
              guideVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{
              background: 'linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%)',
              borderLeft: '4px solid #3b82f6'
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                    <span className="text-white">👋</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-blue-900">Get Started</h3>
                    <p className="text-xs text-blue-700">Complete onboarding steps</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismissWelcome}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Dismiss
                </Button>
              </div>
              
              <div className="flex overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
                {welcomeSteps.map((step) => {
                  const Icon = step.icon;
                  const isCompleted = completedSteps.includes(step.id);
                  return (
                    <button
                      key={step.id}
                      onClick={() => handleCompleteStep(step.id)}
                      onMouseEnter={() => setHoveredStep(step.id)}
                      onMouseLeave={() => setHoveredStep(null)}
                      className={`flex-shrink-0 w-32 mx-1 flex flex-col items-center p-3 rounded-lg transition-all duration-200 ${
                        isCompleted 
                          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200' 
                          : 'bg-white hover:shadow border border-gray-100'
                      } ${hoveredStep === step.id && !isCompleted ? 'ring-1 ring-blue-200 scale-105' : ''}`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                        isCompleted 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                          : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5 text-white" />
                        ) : (
                          <Icon className="h-5 w-5 text-white" />
                        )}
                      </div>
                      <p className={`text-xs font-medium text-center leading-tight ${
                        isCompleted ? 'text-green-700' : 'text-gray-800'
                      }`}>
                        {step.label}
                      </p>
                      {isCompleted && (
                        <span className="text-[10px] text-green-600 mt-1">✓ Completed</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Health Summary Card - Only show for users with health data */}
        {upcomingAppointments.length > 0 && (
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
                  <p className="text-xl font-semibold">120/80</p>
                </div>
                
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Heart className="h-4 w-4" />
                    <span className="text-xs opacity-90">Heart Rate</span>
                  </div>
                  <p className="text-xl font-semibold">72 bpm</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div>
          <h3 className="font-semibold mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => handleQuickAction(action.id)}
                  className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 bg-gradient-to-r ${action.color}`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <span className="text-sm font-medium">{action.label}</span>
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
          
          {loading ? (
            <Card className="shadow-sm">
              <CardContent className="p-8 text-center">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                </div>
              </CardContent>
            </Card>
          ) : upcomingAppointments.length > 0 ? (
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
                  onClick={() => onNavigate('search')}
                  style={{
                    background: 'linear-gradient(135deg, #0093E9 0%, #80D0C7 100%)'
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Book Your First Appointment
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="font-semibold mb-3">Recent Activity</h3>
          {recentActivities.length > 0 ? (
            <Card className="shadow-sm animate-fadeIn">
              <CardContent className="p-4">
                <div className="space-y-3">
                  {recentActivities.slice(0, 3).map((activity, index) => (
                    <div 
                      key={activity.id || index}
                      className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0"
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animation: 'slideIn 0.3s ease-out both'
                      }}
                    >
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === 'appointment' ? 'bg-green-500' :
                        activity.type === 'record' ? 'bg-blue-500' :
                        activity.type === 'prescription' ? 'bg-orange-500' :
                        'bg-purple-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">{activity.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {activity.timestamp || activity.date || 'Recently'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-sm">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-muted-foreground mb-2">No recent activity</p>
                <p className="text-xs text-gray-500 mb-4">
                  Your activity will appear here after you start using DigiHealth
                </p>
                <Button 
                  variant="outline"
                  onClick={() => onNavigate('search')}
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  Start Exploring
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PatientMobileLayout>
  );
}
