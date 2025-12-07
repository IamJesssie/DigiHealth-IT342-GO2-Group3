import { useEffect, useState } from 'react';
import type { Screen } from '../App';
import { PatientMobileLayout } from './PatientMobileLayout';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Calendar, Clock, MapPin, Phone, Video, X, RefreshCw, ChevronRight, Plus } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

interface PatientAppointmentsProps {
  patient: any;
  onNavigate: (screen: Screen, data?: any) => void;
  onLogout: () => void;
}

export function PatientAppointments({ patient, onNavigate, onLogout }: PatientAppointmentsProps) {
  const [currentScreen] = useState<'dashboard' | 'appointments' | 'records' | 'search' | 'profile'>('appointments');
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [pastAppointments, setPastAppointments] = useState<any[]>([]);
  const [cancelledAppointments, setCancelledAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNavigation = (screen: string) => {
    const screenMapping: Record<string, Screen> = {
      dashboard: 'dashboard',
      appointments: 'appointments',
      search: 'search',
      records: 'patient-records',
      profile: 'patient-profile',
    };

    const mappedScreen: Screen = screenMapping[screen] || (screen as Screen);
    onNavigate(mappedScreen);
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      setError(null);
      const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
      const API_BASE = (import.meta as any).env.VITE_API_BASE_URL || `http://${host}:8080`;
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
        const mapped = (data || []).map((a: any) => ({
          id: a.appointmentId,
          doctorName: a.doctor?.user?.fullName || 'Doctor',
          specialization: a.doctor?.user?.specialization || 'General Physician',
          date: a.appointmentDate,
          time: a.appointmentTime,
          type: 'Consultation',
          status: a.status || 'Scheduled',
          location: 'Clinic',
          doctorImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(a.doctor?.user?.fullName || 'Doctor')}`,
        }));
        const now = new Date();
        const upcoming = mapped.filter((m: any) => new Date(m.date) >= new Date(now.toISOString().slice(0,10)) && m.status !== 'Cancelled');
        const past = mapped.filter((m: any) => new Date(m.date) < new Date(now.toISOString().slice(0,10)) && m.status === 'Completed');
        const cancelled = mapped.filter((m: any) => m.status === 'Cancelled');
        setUpcomingAppointments(upcoming);
        setPastAppointments(past);
        setCancelledAppointments(cancelled);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const handleCancelAppointment = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowCancelDialog(true);
  };

  const confirmCancelAppointment = () => {
    // Simulate cancellation
    toast.success('Appointment cancelled successfully');
    setShowCancelDialog(false);
    setSelectedAppointment(null);
  };

  const handleReschedule = (appointment: any) => {
    toast.info('Reschedule feature - Coming soon!');
    // onNavigate('reschedule-appointment', appointment);
  };

  const renderAppointmentCard = (appointment: any, showActions: boolean = true) => {
    const statusColors = {
      Confirmed: 'bg-green-100 text-green-700',
      Pending: 'bg-yellow-100 text-yellow-700',
      Completed: 'bg-blue-100 text-blue-700',
      Cancelled: 'bg-red-100 text-red-700',
    };

    return (
      <Card key={appointment.id} className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex gap-3 mb-4">
            <Avatar className="h-14 w-14">
              <AvatarImage src={appointment.doctorImage} alt={appointment.doctorName} />
              <AvatarFallback>{appointment.doctorName.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <p className="font-semibold">{appointment.doctorName}</p>
                  <p className="text-sm text-muted-foreground">{appointment.specialization}</p>
                </div>
                <Badge className={statusColors[appointment.status as keyof typeof statusColors]}>
                  {appointment.status}
                </Badge>
              </div>
              
              <div className="flex items-center gap-1 mt-2 text-sm">
                <Badge variant="outline" className="text-xs">
                  {appointment.type}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-sm mb-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{appointment.time}</span>
            </div>
            
            {appointment.location && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{appointment.location}</span>
              </div>
            )}
          </div>

          {showActions && appointment.status === 'Confirmed' && (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => handleCancelAppointment(appointment)}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => handleReschedule(appointment)}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reschedule
              </Button>
            </div>
          )}

          {appointment.status === 'Completed' && (
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => onNavigate('patient-records', appointment)}
            >
              View Medical Notes
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}

          {appointment.status === 'Cancelled' && appointment.cancelledBy && (
            <div className="text-xs text-muted-foreground bg-gray-50 p-2 rounded">
              Cancelled by {appointment.cancelledBy} on {new Date(appointment.cancelledAt).toLocaleDateString()}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <PatientMobileLayout
      currentScreen={currentScreen}
      onNavigate={handleNavigation}
      patient={patient}
      notificationCount={2}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">My Appointments</h1>
          <Button
            onClick={() => onNavigate('search')}
            size="sm"
            style={{
              background: 'linear-gradient(135deg, #0093E9 0%, #80D0C7 100%)'
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Book
          </Button>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingAppointments.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past ({pastAppointments.length})
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Cancelled ({cancelledAppointments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {error && (
              <Card className="shadow-sm"><CardContent className="p-4 text-red-600">{error}</CardContent></Card>
            )}
            {loading && (
              <Card className="shadow-sm"><CardContent className="p-4">Loading appointments...</CardContent></Card>
            )}
            {!loading && upcomingAppointments.length > 0 ? (
              upcomingAppointments.map(appointment => renderAppointmentCard(appointment, true))
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
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {!loading && pastAppointments.length > 0 ? (
              pastAppointments.map(appointment => renderAppointmentCard(appointment, false))
            ) : (
              <Card className="shadow-sm">
                <CardContent className="p-8 text-center">
                  <Calendar className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground">No past appointments</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-4">
            {!loading && cancelledAppointments.length > 0 ? (
              cancelledAppointments.map(appointment => renderAppointmentCard(appointment, false))
            ) : (
              <Card className="shadow-sm">
                <CardContent className="p-8 text-center">
                  <Calendar className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground">No cancelled appointments</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Appointment?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel your appointment with {selectedAppointment?.doctorName} on{' '}
              {selectedAppointment && new Date(selectedAppointment.date).toLocaleDateString()}?
              <br /><br />
              This action cannot be undone. Please note our cancellation policy requires 24 hours notice.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmCancelAppointment}
              className="bg-red-600 hover:bg-red-700"
            >
              Yes, Cancel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PatientMobileLayout>
  );
}
