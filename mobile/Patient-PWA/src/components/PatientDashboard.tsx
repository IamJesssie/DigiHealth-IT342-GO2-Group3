import { useState, useEffect } from 'react';
import type { Screen } from '../App';
import { PatientMobileLayout } from './PatientMobileLayout';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar, Clock, User, Heart, Activity, FileText, Plus, ChevronRight, CheckCircle, ArrowRight, BookOpen, Stethoscope } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { toast } from 'sonner';
import { useNotifications, Notification } from '../hooks/useNotifications';

interface PatientDashboardProps {
  patient: any;
  onNavigate: (screen: Screen, data?: any) => void;
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
  location?: string;
  reason?: string;
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

  // Real-time notifications for appointment updates on dashboard
  useNotifications((notification: Notification) => {
    console.log('Dashboard received notification:', notification);
    
    // Refresh data when appointments change
    if (notification.type?.startsWith('APPOINTMENT_')) {
      console.log('Appointment update detected on dashboard, refreshing...');
      fetchUpcomingAppointments();
      fetchRecentActivities();
      
      // Show toast notification with detailed message
      if (notification.type === 'APPOINTMENT_CANCELLED') {
        toast.error(notification.message || 'Appointment cancelled', {
          duration: 6000,
          description: 'Check your appointments for details'
        });
      } else if (notification.type === 'APPOINTMENT_CONFIRMED') {
        toast.success('Appointment confirmed!');
      } else if (notification.type === 'APPOINTMENT_RESCHEDULED') {
        toast.info(notification.message || 'Appointment rescheduled');
      } else if (notification.type === 'APPOINTMENT_COMPLETED') {
        toast.success('Appointment completed', {
          description: 'Medical records are now available'
        });
      }
    }
  });

  useEffect(() => {
    fetchUpcomingAppointments();
    fetchRecentActivities();
    fetchUnreadNotifications();
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

  const fetchUnreadNotifications = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    
    try {
      const res = await fetch(`${API_BASE}/api/notifications/unread`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const notifications = await res.json();
        // Process unread notifications (can show toast or update UI)
        if (notifications && notifications.length > 0) {
          console.log(`You have ${notifications.length} unread notification(s)`);
          // Optionally: toast.info(`You have ${notifications.length} unread notification(s)`);
        }
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchRecentActivities = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      const res = await fetch(`${API_BASE}/api/appointments/patient/my`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.ok) {
        const data = await res.json();
        const activities = (data || [])
          .sort((a: any, b: any) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime())
          .slice(0, 5)
          .map((a: any) => {
            let title = 'Appointment Update';
            let description = `Dr. ${a.doctor?.user?.fullName}`;
            let type = 'appointment';
            
            if (a.status === 'CANCELLED') {
              title = 'Appointment Cancelled';
              // Extract reason if possible, otherwise generic
               if (a.notes && a.notes.includes('Cancelled Reason:')) {
                  const parts = a.notes.split('Cancelled Reason:');
                  const reason = parts[parts.length - 1].trim();
                  description = `Reason: ${reason}`;
               } else {
                  description = `Cancelled appointment with Dr. ${a.doctor?.user?.fullName}`;
               }
            } else if (a.status === 'COMPLETED') {
              title = 'Appointment Completed';
              description = `Completed checkup with Dr. ${a.doctor?.user?.fullName}`;
            } else if (a.status === 'CONFIRMED') {
              title = 'Appointment Confirmed';
              description = `Confirmed with Dr. ${a.doctor?.user?.fullName}`;
            } else if (a.status === 'SCHEDULED') {
                title = 'Appointment Scheduled';
                description = `Scheduled with Dr. ${a.doctor?.user?.fullName}`;
            }

            return {
              id: a.appointmentId,
              title,
              description,
              type,
              timestamp: new Date(a.updatedAt || a.createdAt).toLocaleDateString()
            };
          });
        setRecentActivities(activities);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
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
          type: 'Consultation',
          doctorImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${a.doctor?.user?.fullName || 'Doctor'}`,
          status: a.status,
          location: a.doctor?.hospitalAffiliation || 'Clinic',
          reason: a.notes || a.symptoms || '',
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
    const screenMapping: Record<string, Screen> = {
      dashboard: 'dashboard',
      appointments: 'appointments',
      search: 'search',
      records: 'patient-records',
      profile: 'patient-profile',
    };

    const mappedScreen: Screen = screenMapping[screen] || (screen as Screen);
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
            className={`shadow-lg border-blue-100 dark:border-blue-900 transition-all duration-500 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/40 dark:to-cyan-950/40 ${
              guideVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{
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
                    <h3 className="text-sm font-bold text-blue-900 dark:text-blue-100">Get Started</h3>
                    <p className="text-xs text-blue-700 dark:text-blue-300">Complete onboarding steps</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismissWelcome}
                  className="text-xs text-muted-foreground hover:text-foreground"
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
                          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 dark:from-green-900/20 dark:to-emerald-900/20 dark:border-green-800' 
                          : 'bg-card hover:shadow border border-border'
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
                        isCompleted ? 'text-green-700 dark:text-green-400' : 'text-card-foreground'
                      }`}>
                        {step.label}
                      </p>
                      {isCompleted && (
                        <span className="text-[10px] text-green-600 dark:text-green-500 mt-1">✓ Completed</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* DigiBot AI Chat Assistant - Floating - REMOVED */}
        
        {/* Quick Actions */}
        <div>
          <h3 className="font-semibold mb-3 text-foreground">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => handleQuickAction(action.id)}
                  className="flex flex-col items-center justify-center p-4 bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow border border-border"
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 bg-gradient-to-r ${action.color}`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <span className="text-sm font-medium text-card-foreground">{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground">Upcoming Appointments</h3>
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
                  <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
                  <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
                </div>
              </CardContent>
            </Card>
          ) : upcomingAppointments.length > 0 ? (
            <div className="space-y-3">
              {upcomingAppointments.map((appointment) => (
                <Card 
                  key={appointment.id} 
                  className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onNavigate('appointments', appointment)}
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
                            <p className="font-semibold text-foreground">{appointment.doctorName}</p>
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
                            <span>{formatTime12h(appointment.time)}</span>
                          </div>
                        </div>
                        {appointment.reason && (
                          <div className="mt-2 text-xs text-muted-foreground">
                            <span className="font-medium">Reason:</span> {appointment.reason}
                          </div>
                        )}
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
          <h3 className="font-semibold mb-3 text-foreground">Recent Activity</h3>
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
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-muted-foreground mb-2">No recent activity</p>
                <p className="text-xs text-muted-foreground mb-4">
                  Your activity will appear here after you start using DigiHealth
                </p>
                <Button 
                  variant="outline"
                  onClick={() => onNavigate('search')}
                  className="text-blue-600 border-blue-200 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-950/30"
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
const formatTime12h = (time: string) => {
  try {
    const [h, m] = (time || '').split(':');
    const hh = parseInt(h || '0', 10);
    const mm = parseInt(m || '0', 10);
    const ampm = hh >= 12 ? 'PM' : 'AM';
    const h12 = hh % 12 === 0 ? 12 : hh % 12;
    return `${h12}:${String(mm).padStart(2,'0')} ${ampm}`;
  } catch { return time; }
}
