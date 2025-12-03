import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Calendar } from './ui/calendar';
import { Badge } from './ui/badge';
import { ArrowLeft, Calendar as CalendarIcon, Clock, FileText, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
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

  // Mock available time slots
  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
  ];

  const appointmentTypes = [
    { value: 'general', label: 'General Checkup' },
    { value: 'followup', label: 'Follow-up' },
    { value: 'consultation', label: 'Consultation' },
    { value: 'emergency', label: 'Emergency' },
  ];

  const handleConfirmBooking = () => {
    if (!selectedDate || !selectedTime || !appointmentType || !reason.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    // Simulate booking API call
    setTimeout(() => {
      toast.success('Appointment booked successfully!');
      setIsLoading(false);
      onComplete();
    }, 1500);
  };

  const renderProgressBar = () => (
    <div className="flex items-center justify-center gap-2 mb-6">
      <div className={`w-2 h-2 rounded-full ${step >= 1 ? 'bg-gradient-to-r from-[#0093E9] to-[#80D0C7]' : 'bg-gray-300'}`} />
      <div className={`w-8 h-1 ${step >= 2 ? 'bg-gradient-to-r from-[#0093E9] to-[#80D0C7]' : 'bg-gray-300'}`} />
      <div className={`w-2 h-2 rounded-full ${step >= 2 ? 'bg-gradient-to-r from-[#0093E9] to-[#80D0C7]' : 'bg-gray-300'}`} />
      <div className={`w-8 h-1 ${step >= 3 ? 'bg-gradient-to-r from-[#0093E9] to-[#80D0C7]' : 'bg-gray-300'}`} />
      <div className={`w-2 h-2 rounded-full ${step >= 3 ? 'bg-gradient-to-r from-[#0093E9] to-[#80D0C7]' : 'bg-gray-300'}`} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Book Appointment</h1>
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
                  disabled={(date) => date < new Date()}
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
                        {time}
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
                    <p className="font-medium">{selectedTime}</p>
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
