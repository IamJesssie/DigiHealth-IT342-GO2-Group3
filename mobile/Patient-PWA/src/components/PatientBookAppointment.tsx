import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Calendar } from './ui/calendar';
import { Badge } from './ui/badge';
import { ArrowLeft, Calendar as CalendarIcon, Clock, FileText, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface PatientBookAppointmentProps {
  doctor?: any;
  patient: any;
  onBack: () => void;
  onComplete: () => void;
}

export function PatientBookAppointment({ doctor, patient, onBack, onComplete }: PatientBookAppointmentProps) {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('');
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [workDays, setWorkDays] = useState<string[]>([]);
  const [dayHours, setDayHours] = useState<Record<string, { start: string; end: string }>>({});
  const [slotMinutes, setSlotMinutes] = useState<number>(30);
  const [minAdvanceHours, setMinAdvanceHours] = useState<number>(0);
  const [allowSameDay, setAllowSameDay] = useState<boolean>(true);

  const appointmentTypes = [
    { value: 'general', label: 'General Checkup' },
    { value: 'followup', label: 'Follow-up' },
    { value: 'consultation', label: 'Consultation' },
    { value: 'emergency', label: 'Emergency' },
  ];

  useEffect(() => {
    const fetchSlots = async () => {
      if (!doctor || !selectedDate) return;
      const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
      const API_BASE = (import.meta as any).env.VITE_API_BASE_URL || `http://${host}:8080`;
      const token = localStorage.getItem('accessToken');
      setIsLoading(true);
      try {
        const dateStr = formatLocalDateYYYYMMDD(selectedDate);
        const res = await fetch(`${API_BASE}/api/appointments/doctors/${doctor.id}/available-slots?date=${dateStr}`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) {
          const payload = await res.json().catch(() => null);
          const dayAbbr = selectedDate.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase().slice(0, 3);
          const hours = dayHours[dayAbbr];
          if (hours) {
            const start = hours.start || '09:00';
            const end = hours.end || '17:00';
            const [startH, startM] = start.split(':').map((s) => parseInt(s, 10));
            const [endH, endM] = end.split(':').map((s) => parseInt(s, 10));
            const startDate = new Date(selectedDate);
            startDate.setHours(startH, startM, 0, 0);
            const endDate = new Date(selectedDate);
            endDate.setHours(endH, endM, 0, 0);
            const slots: string[] = [];
            let cur = new Date(startDate);
            const today = new Date();
            const isSameDay = selectedDate.toDateString() === new Date().toDateString();
            if (isSameDay && !allowSameDay) {
              setTimeSlots([]);
              return;
            }
            if (isSameDay) {
              const earliest = new Date(today.getTime() + Math.max(0, minAdvanceHours) * 60 * 60 * 1000);
              if (earliest > cur) {
                const remainder = (earliest.getMinutes() % slotMinutes);
                if (remainder !== 0) {
                  earliest.setMinutes(earliest.getMinutes() + (slotMinutes - remainder));
                }
                cur = earliest;
              }
            }
            const startRemainder = cur.getMinutes() % slotMinutes;
            if (startRemainder !== 0) {
              cur.setMinutes(cur.getMinutes() + (slotMinutes - startRemainder));
            }
            while (cur.getTime() <= endDate.getTime() - slotMinutes * 60 * 1000) {
              const hh = String(cur.getHours()).padStart(2, '0');
              const mm = String(cur.getMinutes()).padStart(2, '0');
              slots.push(`${hh}:${mm}`);
              cur.setMinutes(cur.getMinutes() + slotMinutes);
            }
            setTimeSlots(slots);
            return;
          }
          return;
        }
        const data = await res.json();
        const raw = Array.isArray(data) ? data : [];
        const isToday = selectedDate.toDateString() === new Date().toDateString();
        let filtered = raw;
        if (isToday) {
          if (!allowSameDay) {
            filtered = [];
          } else {
            const now = new Date();
            const earliest = new Date(now.getTime() + Math.max(0, minAdvanceHours) * 60 * 60 * 1000);
            // Round earliest up to slot boundary
            const rem = earliest.getMinutes() % slotMinutes;
            if (rem !== 0) earliest.setMinutes(earliest.getMinutes() + (slotMinutes - rem));
            const toMinutes = (hhmm: string) => {
              const [h, m] = hhmm.split(":").map((s) => parseInt(s, 10));
              return h * 60 + m;
            };
            const earliestMinutes = earliest.getHours() * 60 + earliest.getMinutes();
            filtered = raw.filter((t) => toMinutes(t) >= earliestMinutes);
          }
        }
        setTimeSlots(filtered);
      } catch (e: any) {
        toast.error(e.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSlots();
  }, [doctor, selectedDate, dayHours, slotMinutes]);

  useEffect(() => {
    const fetchWorkDays = async () => {
      if (!doctor) return;
      const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
      const API_BASE = (import.meta as any).env.VITE_API_BASE_URL || `http://${host}:8080`;
      const token = localStorage.getItem('accessToken');
      try {
        const res = await fetch(`${API_BASE}/api/appointments/doctors/${doctor.id}/work-days`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        const payload = await res.json().catch(() => null);
        if (!res.ok) {
          setWorkDays([]);
          setDayHours({});
          setSlotMinutes(30);
          return;
        }
        const days: string[] = (payload?.workDays || []).map((d: string) => d.toUpperCase());
        const hoursObj = payload?.hours || {};
        const normalizedHours: Record<string, { start: string; end: string }> = {};
        Object.keys(hoursObj).forEach((k) => {
          const v = hoursObj[k];
          normalizedHours[k.toUpperCase()] = { start: v.start, end: v.end };
        });
        setWorkDays(days);
        setDayHours(normalizedHours);
        setSlotMinutes(Number(payload?.slotMinutes || 30));
        if (typeof payload?.minAdvanceHours === 'number') {
          setMinAdvanceHours(Number(payload.minAdvanceHours));
        }
        if (typeof payload?.allowSameDayBooking === 'boolean') {
          setAllowSameDay(Boolean(payload.allowSameDayBooking));
        }
      } catch {
        setWorkDays([]);
        setDayHours({});
        setSlotMinutes(30);
      }
    };
    fetchWorkDays();
  }, [doctor]);

  const handleConfirmBooking = async () => {
    if (!selectedDate || !selectedTime || !appointmentType || !reason.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    setIsLoading(true);
    const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    const API_BASE = (import.meta as any).env.VITE_API_BASE_URL || `http://${host}:8080`;
    const token = localStorage.getItem('accessToken');
    try {
      const dateStr = formatLocalDateYYYYMMDD(selectedDate);
      const payload = {
        doctorId: doctor.id,
        appointmentDate: dateStr,
        appointmentTime: selectedTime,
        appointmentType: appointmentType, // <-- include selected type
        reason,
        symptoms: reason,
      };
      const res = await fetch(`${API_BASE}/api/appointments/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      const resp = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error((resp && (resp.message || resp.error)) || 'Failed to book appointment');
        setIsLoading(false);
        return;
      }
      toast.success('Appointment booked successfully!');
      onComplete();
    } catch (e: any) {
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderProgressBar = () => (
    <div className="flex items-center justify-center gap-2 mb-6">
      <div className={`w-2 h-2 rounded-full ${step >= 1 ? 'bg-gradient-to-r from-[#0093E9] to-[#80D0C7]' : 'bg-muted'}`} />
      <div className={`w-8 h-1 ${step >= 2 ? 'bg-gradient-to-r from-[#0093E9] to-[#80D0C7]' : 'bg-muted'}`} />
      <div className={`w-2 h-2 rounded-full ${step >= 2 ? 'bg-gradient-to-r from-[#0093E9] to-[#80D0C7]' : 'bg-muted'}`} />
      <div className={`w-8 h-1 ${step >= 3 ? 'bg-gradient-to-r from-[#0093E9] to-[#80D0C7]' : 'bg-muted'}`} />
      <div className={`w-2 h-2 rounded-full ${step >= 3 ? 'bg-gradient-to-r from-[#0093E9] to-[#80D0C7]' : 'bg-muted'}`} />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Book Appointment</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 pb-20">
        {renderProgressBar()}

        {/* Doctor Info Card */}
        {doctor && (
          <Card className="shadow-sm mb-6">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={doctor.image} alt={doctor.name} />
                  <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{doctor.name}</p>
                  <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                  <p className="text-xs text-muted-foreground mt-1">{doctor.location}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 1: Select Date & Time */}
        {step === 1 && (
          <div className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Select Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => {
                    const today = new Date();
                    if (date < new Date(today.getFullYear(), today.getMonth(), today.getDate())) return true;
                    const abbr = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase().slice(0, 3);
                    return workDays.length > 0 && !workDays.includes(abbr);
                  }}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            {selectedDate && (
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Available Time Slots
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedTime(time)}
                        className={selectedTime === time ? 'bg-gradient-to-r from-[#0093E9] to-[#80D0C7]' : ''}
                      >
                        {formatTime12h(time)}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Button
              onClick={() => setStep(2)}
              disabled={!selectedDate || !selectedTime}
              className="w-full h-12"
              style={{
                background: 'linear-gradient(135deg, #0093E9 0%, #80D0C7 100%)'
              }}
            >
              Continue
            </Button>
          </div>
        )}

        {/* Step 2: Appointment Details */}
        {step === 2 && (
          <div className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Appointment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Appointment Type *</Label>
                  <Select value={appointmentType} onValueChange={setAppointmentType}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select appointment type" />
                    </SelectTrigger>
                    <SelectContent>
                      {appointmentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Visit *</Label>
                  <Textarea
                    id="reason"
                    placeholder="Please describe your symptoms or reason for the visit..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="min-h-[120px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum 10 characters ({reason.length}/10)
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1 h-12"
              >
                Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!appointmentType || reason.length < 10}
                className="flex-1 h-12"
                style={{
                  background: 'linear-gradient(135deg, #0093E9 0%, #80D0C7 100%)'
                }}
              >
                Review
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Confirm */}
        {step === 3 && (
          <div className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  Review Your Appointment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {doctor && (
                  <div className="pb-3 border-b">
                    <p className="text-sm text-muted-foreground mb-1">Doctor</p>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={doctor.image} alt={doctor.name} />
                        <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{doctor.name}</p>
                        <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pb-3 border-b">
                  <p className="text-sm text-muted-foreground mb-1">Date & Time</p>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">
                      {selectedDate?.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">{selectedTime ? formatTime12h(selectedTime) : ''}</p>
                  </div>
                </div>

                <div className="pb-3 border-b">
                  <p className="text-sm text-muted-foreground mb-1">Appointment Type</p>
                  <Badge>
                    {appointmentTypes.find(t => t.value === appointmentType)?.label}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Reason for Visit</p>
                  <p className="text-sm">{reason}</p>
                </div>
              </CardContent>
            </Card>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>Cancellation Policy:</strong> You can cancel or reschedule this appointment up to 24 hours before the scheduled time.
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setStep(2)}
                className="flex-1 h-12"
                disabled={isLoading}
              >
                Back
              </Button>
              <Button
                onClick={handleConfirmBooking}
                disabled={isLoading}
                className="flex-1 h-12"
                style={{
                  background: 'linear-gradient(135deg, #0093E9 0%, #80D0C7 100%)'
                }}
              >
                {isLoading ? 'Booking...' : 'Confirm Booking'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
const formatLocalDateYYYYMMDD = (d: Date) => d.toLocaleDateString('en-CA');
  const formatTime12h = (hhmm: string) => {
    const [hStr, mStr] = hhmm.split(":");
    let h = parseInt(hStr || "0", 10);
    const m = parseInt(mStr || "0", 10);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 === 0 ? 12 : h % 12;
    const mm = String(m).padStart(2, "0");
    return `${h12}:${mm} ${ampm}`;
  };
