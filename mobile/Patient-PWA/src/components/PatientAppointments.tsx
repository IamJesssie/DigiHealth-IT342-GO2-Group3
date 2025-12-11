import { useEffect, useState } from 'react';
import type { Screen } from '../App';
import { PatientMobileLayout } from './PatientMobileLayout';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Calendar as CalendarIcon, Clock, MapPin, Phone, Video, X, RefreshCw, ChevronRight, Plus } from 'lucide-react';
import { Calendar } from './ui/calendar';
import { toast } from 'sonner';
import { useNotifications, Notification } from '../hooks/useNotifications';
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
  const [cancelReason, setCancelReason] = useState('');
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState<Date | undefined>(undefined);
  const [rescheduleTime, setRescheduleTime] = useState<string>('');
  const [rescheduleReason, setRescheduleReason] = useState('');
  const [rescheduleWorkDays, setRescheduleWorkDays] = useState<string[]>([]);
  const [rescheduleTimeSlots, setRescheduleTimeSlots] = useState<string[]>([]);
  const [rescheduleSlotsLoading, setRescheduleSlotsLoading] = useState(false);
  const [reloadFlag, setReloadFlag] = useState<number>(0);
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

  // Real-time notifications for appointment updates
  useNotifications((notification: Notification) => {
    console.log('Received notification:', notification);
    // Refresh appointments when status changes
    if (notification.type?.startsWith('APPOINTMENT_')) {
      console.log('Appointment update detected, refreshing...');
      setReloadFlag(Date.now());
      
      // Show toast notification with detailed message
      if (notification.type === 'APPOINTMENT_CONFIRMED') {
        toast.success('Appointment confirmed!');
      } else if (notification.type === 'APPOINTMENT_CANCELLED') {
        // Show detailed cancellation message
        toast.error(notification.message || 'Appointment cancelled', {
          duration: 6000,
          description: 'Please book a new appointment or contact the clinic for more information.'
        });
      } else if (notification.type === 'APPOINTMENT_RESCHEDULED') {
        toast.info(notification.message || 'Appointment rescheduled', {
          duration: 5000
        });
      } else if (notification.type === 'APPOINTMENT_COMPLETED') {
        toast.success('Appointment completed', {
          description: 'Medical records are now available'
        });
      }
    }
  });

  const fetchUnreadNotifications = async () => {
    const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    const API_BASE = (import.meta as any).env.VITE_API_BASE_URL || `http://${host}:8080`;
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
        // Process unread notifications - if appointment status changed, re-fetch
        if (notifications && notifications.length > 0) {
          const hasAppointmentUpdate = notifications.some((n: any) => 
            n.type && n.type.startsWith('APPOINTMENT_')
          );
          if (hasAppointmentUpdate) {
            console.log('Appointment status changed, refreshing...');
            setReloadFlag(Date.now());
          }
        }
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

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
        doctorId: a.doctor?.user?.id,
        doctorName: a.doctor?.user?.fullName || 'Doctor',
        specialization: a.doctor?.user?.specialization || 'General Physician',
        date: a.appointmentDate,
        time: a.appointmentTime,
        type: 'Consultation',
        status: a.status || 'Scheduled',
        location: a.doctor?.hospitalAffiliation || 'Clinic',
        reason: a.notes || a.symptoms || '',
        doctorImage: a.doctor?.user?.profileImageUrl || '/assets/default-doctor-avatar.svg',
      }));
      
      // Filter by status: CONFIRMED = Upcoming, COMPLETED = Past, CANCELLED = Cancelled
      const upcoming = mapped.filter((m: any) => 
        (m.status === 'CONFIRMED' || m.status === 'Confirmed' || m.status === 'SCHEDULED' || m.status === 'Scheduled')
      );
      const past = mapped.filter((m: any) => 
        (m.status === 'COMPLETED' || m.status === 'Completed')
      );
      const cancelled = mapped.filter((m: any) => 
        (m.status === 'CANCELLED' || m.status === 'Cancelled')
      );
      setUpcomingAppointments(upcoming);
      setPastAppointments(past);
      setCancelledAppointments(cancelled);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { 
    fetchAppointments(); 
    fetchUnreadNotifications();
  }, [reloadFlag]);

  const handleCancelAppointment = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowCancelDialog(true);
  };

  const confirmCancelAppointment = () => {
    const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    const API_BASE = (import.meta as any).env.VITE_API_BASE_URL || `http://${host}:8080`;
    const token = localStorage.getItem('accessToken');
    const id = selectedAppointment?.id || selectedAppointment?.appointmentId;
    if (!id) { setShowCancelDialog(false); return; }
    fetch(`${API_BASE}/api/appointments/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ status: 'CANCELLED', reason: cancelReason })
    }).then(async (res) => {
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error((payload && (payload.message || payload.error)) || 'Failed to cancel');
        return;
      }
      toast.success('Appointment cancelled successfully');
      setShowCancelDialog(false);
      setSelectedAppointment(null);
      setCancelReason('');
      setReloadFlag(Date.now());
    }).catch(() => {
      toast.error('Network error cancelling appointment');
    });
  };

  const handleReschedule = async (appointment: any) => {
    setSelectedAppointment(appointment);
    setRescheduleDate(undefined);
    setRescheduleTime('');
    setRescheduleReason('');
    setRescheduleTimeSlots([]);
    setShowRescheduleDialog(true);

    // Fetch doctor's work days
    const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    const API_BASE = (import.meta as any).env.VITE_API_BASE_URL || `http://${host}:8080`;
    const token = localStorage.getItem('accessToken');
    const doctorId = appointment.doctorId || appointment.doctor?.user?.id;

    if (doctorId) {
      try {
        const res = await fetch(`${API_BASE}/api/appointments/doctors/${doctorId}/work-days`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        const payload = await res.json().catch(() => null);
        if (res.ok && payload?.workDays) {
          const days: string[] = payload.workDays.map((d: string) => d.toUpperCase());
          setRescheduleWorkDays(days);
        } else {
          setRescheduleWorkDays([]);
        }
      } catch {
        setRescheduleWorkDays([]);
      }
    }
  };

  const fetchRescheduleSlots = async (date: Date) => {
    if (!selectedAppointment) return;

    setRescheduleSlotsLoading(true);
    setRescheduleTimeSlots([]);

    const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    const API_BASE = (import.meta as any).env.VITE_API_BASE_URL || `http://${host}:8080`;
    const token = localStorage.getItem('accessToken');
    const doctorId = selectedAppointment.doctorId || selectedAppointment.doctor?.user?.id;
    const currentAppointmentTime = selectedAppointment.time;
    const currentAppointmentDate = selectedAppointment.date;
    const dateStr = date.toLocaleDateString('en-CA'); // YYYY-MM-DD

    if (doctorId) {
      try {
        const res = await fetch(`${API_BASE}/api/appointments/doctors/${doctorId}/available-slots?date=${dateStr}`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        const data = await res.json().catch(() => []);
        let slots: string[] = Array.isArray(data) ? data : [];

        // If same date as current appointment, add the current time to show it as disabled
        // The backend excludes booked slots, but we want to show the patient's own slot as disabled
        if (dateStr === currentAppointmentDate && currentAppointmentTime) {
          if (!slots.includes(currentAppointmentTime)) {
            slots = [...slots, currentAppointmentTime].sort();
          }
        }

        setRescheduleTimeSlots(slots);
      } catch (e) {
        console.error('Error fetching reschedule slots:', e);
        setRescheduleTimeSlots([]);
      }
    }

    setRescheduleSlotsLoading(false);
  };

  const handleRescheduleDateSelect = (date: Date | undefined) => {
    setRescheduleDate(date);
    setRescheduleTime('');
    if (date) {
      fetchRescheduleSlots(date);
    } else {
      setRescheduleTimeSlots([]);
    }
  };

  const confirmRescheduleAppointment = () => {
    const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    const API_BASE = (import.meta as any).env.VITE_API_BASE_URL || `http://${host}:8080`;
    const token = localStorage.getItem('accessToken');
    const id = selectedAppointment?.id || selectedAppointment?.appointmentId;

    if (!id || !rescheduleDate || !rescheduleTime) {
      toast.error('Please select a date and time');
      return;
    }

    const body = {
      appointmentDate: rescheduleDate.toLocaleDateString('en-CA'),
      appointmentTime: rescheduleTime,
      reason: rescheduleReason || undefined,
    };

    fetch(`${API_BASE}/api/appointments/${id}/reschedule`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body)
    }).then(async (res) => {
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error((payload && (payload.message || payload.error)) || 'Failed to reschedule');
        return;
      }
      toast.success('Appointment rescheduled successfully');
      setShowRescheduleDialog(false);
      setSelectedAppointment(null);
      setRescheduleReason('');
      setRescheduleDate(undefined);
      setRescheduleTime('');
      setReloadFlag(Date.now());
    }).catch(() => {
      toast.error('Network error rescheduling appointment');
    });
  };

  const renderAppointmentCard = (appointment: any, showActions: boolean = true) => {
    const statusColors: Record<string, string> = {
      confirmed: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
      pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
      completed: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
      cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    };
    const statusKey = String(appointment.status || '').toLowerCase();

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
                  <p className="font-semibold text-foreground">{appointment.doctorName}</p>
                  <p className="text-sm text-muted-foreground">{appointment.specialization}</p>
                </div>
                <Badge className={statusColors[statusKey] || 'bg-muted text-muted-foreground'}>
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
              <CalendarIcon className="h-4 w-4" />
              <span>{new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{formatTime12h(appointment.time)}</span>
            </div>

            {appointment.location && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{appointment.location}</span>
              </div>
            )}
          </div>

          {showActions && (
            appointment.status === 'Confirmed' || 
            appointment.status === 'CONFIRMED' || 
            appointment.status === 'Scheduled' || 
            appointment.status === 'SCHEDULED'
          ) && (
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

          {(appointment.status === 'Completed' || appointment.status === 'COMPLETED') && (
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
            <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
              Cancelled by {appointment.cancelledBy} on {new Date(appointment.cancelledAt).toLocaleDateString()}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const formatTime12h = (time: string) => {
    try {
      const [h, m] = (time || '').split(':');
      const hh = parseInt(h || '0', 10);
      const mm = parseInt(m || '0', 10);
      const ampm = hh >= 12 ? 'PM' : 'AM';
      const h12 = hh % 12 === 0 ? 12 : hh % 12;
      return `${h12}:${String(mm).padStart(2, '0')} ${ampm}`;
    } catch { return time; }
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
                  <CalendarIcon className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
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
                  <CalendarIcon className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
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
                  <CalendarIcon className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
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
              Please provide a reason for cancellation (optional):
              <br />
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Reason for cancellation"
                className="w-full mt-2 border-input rounded p-2 bg-background text-foreground"
                rows={3}
              />
              <br /><br />
              This action cannot be undone. Please note our cancellation policy requires 24 hours notice.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmCancelAppointment}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Yes, Cancel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showRescheduleDialog} onOpenChange={setShowRescheduleDialog}>
        <AlertDialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>Reschedule Appointment</AlertDialogTitle>
            <AlertDialogDescription>
              Select a new date and time for your appointment with {selectedAppointment?.doctorName}.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4">
            {/* Calendar for date selection */}
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Select New Date
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Calendar
                  mode="single"
                  selected={rescheduleDate}
                  onSelect={handleRescheduleDateSelect}
                  disabled={(date) => {
                    const today = new Date();
                    if (date < new Date(today.getFullYear(), today.getMonth(), today.getDate())) return true;
                    const abbr = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase().slice(0, 3);
                    return rescheduleWorkDays.length > 0 && !rescheduleWorkDays.includes(abbr);
                  }}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            {/* Time slots */}
            {rescheduleDate && (
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Available Time Slots
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {rescheduleSlotsLoading ? (
                    <p className="text-sm text-muted-foreground py-4 text-center">Loading available slots...</p>
                  ) : rescheduleTimeSlots.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {rescheduleTimeSlots.map((time) => {
                        // Check if this is the patient's current appointment time on the same date
                        const isCurrentSlot = rescheduleDate &&
                          rescheduleDate.toLocaleDateString('en-CA') === selectedAppointment?.date &&
                          time === selectedAppointment?.time;

                        return (
                          <Button
                            key={time}
                            variant={rescheduleTime === time ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => !isCurrentSlot && setRescheduleTime(time)}
                            disabled={isCurrentSlot}
                            className={
                              isCurrentSlot
                                ? 'opacity-50 cursor-not-allowed bg-gray-200 text-gray-500'
                                : rescheduleTime === time
                                  ? 'bg-gradient-to-r from-[#0093E9] to-[#80D0C7]'
                                  : ''
                            }
                          >
                            {formatTime12h(time)}
                          </Button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground py-4 text-center">No available slots for this date</p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Reason */}
            <div>
              <label className="text-sm text-muted-foreground">Reason (optional)</label>
              <textarea
                value={rescheduleReason}
                onChange={(e) => setRescheduleReason(e.target.value)}
                className="w-full border rounded px-2 py-1 mt-1"
                placeholder="Provide a reason for rescheduling"
                rows={2}
              />
            </div>
          </div>

          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel onClick={() => setShowRescheduleDialog(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRescheduleAppointment}
              className="bg-gradient-to-r from-[#0093E9] to-[#80D0C7]"
              disabled={!rescheduleDate || !rescheduleTime}
            >
              Confirm Reschedule
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PatientMobileLayout>
  );
}
