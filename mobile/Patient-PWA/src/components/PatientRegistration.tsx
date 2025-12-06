import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Eye, EyeOff, ArrowLeft, Smartphone, User, Mail, Phone, Lock, Calendar, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { Checkbox } from './ui/checkbox';

interface PatientRegistrationProps {
  onBackToLogin: () => void;
  onRegister: (patient: any) => void;
}

export function PatientRegistration({ onBackToLogin, onRegister }: PatientRegistrationProps) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Step 1: Account Information
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Step 2: Medical Profile
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [allergies, setAllergies] = useState('');
  const [conditions, setConditions] = useState('');
  const [medications, setMedications] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');

  const handleGoogleRegister = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const mockPatient = {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@gmail.com',
        phone: '+1234567890',
        profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
      };
      
      onRegister(mockPatient);
      toast.success('Account created successfully!');
      setIsLoading(false);
    }, 1000);
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !email || !phone || !password || !confirmPassword) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!isPHPhoneValid(phone)) {
      toast.error('Please enter a valid PH mobile number (+63 9xx xxx xxxx)');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    if (!acceptTerms) {
      toast.error('Please accept the terms and privacy policy');
      return;
    }

    setStep(2);
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dateOfBirth || !gender || !emergencyName || !emergencyPhone) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (!isPHPhoneValid(emergencyPhone)) {
      toast.error('Please enter a valid emergency contact number (+63 9xx xxx xxxx)');
      return;
    }
    setIsLoading(true);
    const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    const API_BASE = import.meta.env.VITE_API_BASE_URL || `http://${host}:8080`;
    try {
      const registerRes = await fetch(`${API_BASE}/api/auth/register-patient`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          password,
          phoneNumber: phone,
          birthDate: dateOfBirth,
          age: typeof age === 'number' ? age : undefined,
          gender,
          bloodType,
          allergies,
          medicalConditions: conditions,
          medications,
          emergencyContactName: emergencyName,
          emergencyContactPhone: emergencyPhone,
          street,
          city,
          state,
          postalCode,
          country
        }),
      });
      if (!registerRes.ok) {
        const err = await registerRes.json().catch(() => null);
        toast.error((err && (err.message || err.error)) || 'Registration failed');
        setIsLoading(false);
        return;
      }

      const loginRes = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const payload = await loginRes.json().catch(() => null);
      if (!loginRes.ok) {
        toast.error((payload && (payload.message || payload.error)) || 'Login failed');
        setIsLoading(false);
        return;
      }

      localStorage.setItem('accessToken', payload.accessToken);
      const name = payload?.user?.fullName || payload?.user?.name || fullName || 'Patient';
      const patient = {
        id: String(payload?.user?.id || ''),
        name,
        email: payload?.user?.email || email,
        phone: payload?.user?.phoneNumber || phone,
        dateOfBirth,
        age: typeof age === 'number' ? age : undefined,
        address: '',
        street,
        city,
        state,
        postalCode,
        country,
        emergencyContact: emergencyName,
        medicalHistory: conditions,
        currentMedications: medications,
        profilePicture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      };
      localStorage.setItem('currentUser', JSON.stringify(patient));
      // Mark user as new for welcome guide
      localStorage.setItem('isNewUser', 'true');
      onRegister(patient);
      toast.success('Account created successfully!');
    } catch (err) {
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onDobChange = (val: string) => {
    setDateOfBirth(val);
    try {
      const parts = val.split('-');
      if (parts.length === 3) {
        const dob = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        const today = new Date();
        let computed = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) computed--;
        setAge(computed >= 0 ? computed : 0);
      }
    } catch {}
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{
      background: 'linear-gradient(135deg, #0093E9 0%, #80D0C7 100%)'
    }}>
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-1 pb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={step === 1 ? onBackToLogin : () => setStep(1)}
            className="w-fit -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-2" style={{
            background: 'linear-gradient(135deg, #0093E9 0%, #80D0C7 100%)'
          }}>
            <Smartphone className="h-8 w-8 text-white" />
          </div>
          
          <CardTitle className="text-2xl text-center">Create Account</CardTitle>
          <CardDescription className="text-center">
            Step {step} of 2: {step === 1 ? 'Account Information' : 'Medical Profile'}
          </CardDescription>

          {/* Progress Indicator */}
          <div className="flex gap-2 pt-4">
            <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-gradient-to-r from-[#0093E9] to-[#80D0C7]' : 'bg-gray-200'}`} />
            <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-gradient-to-r from-[#0093E9] to-[#80D0C7]' : 'bg-gray-200'}`} />
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {step === 1 ? (
            <>
              {/* Google Sign Up */}
              <Button
                type="button"
                variant="outline"
                className="w-full h-12"
                onClick={handleGoogleRegister}
                disabled={isLoading}
              >
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign up with Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or sign up with email</span>
                </div>
              </div>

              <form onSubmit={handleStep1Submit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="fullName"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-10 h-12"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="juan.delacruz@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+63 912 345 6789"
                    value={phone}
                    onChange={(e) => setPhone(formatPHPhone(e.target.value))}
                    className="pl-10 h-12"
                    required
                  />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min. 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10 h-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm leading-tight cursor-pointer">
                    I accept the{' '}
                    <Button variant="link" className="px-0 h-auto text-sm" type="button">
                      Terms & Conditions
                    </Button>
                    {' '}and{' '}
                    <Button variant="link" className="px-0 h-auto text-sm" type="button">
                      Privacy Policy
                    </Button>
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12"
                  style={{
                    background: 'linear-gradient(135deg, #0093E9 0%, #80D0C7 100%)'
                  }}
                >
                  Continue to Medical Profile
                </Button>
              </form>
            </>
          ) : (
            <form onSubmit={handleStep2Submit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => onDobChange(e.target.value)}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select value={gender} onValueChange={setGender} required>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bloodType">Blood Type (Optional)</Label>
                <Select value={bloodType} onValueChange={setBloodType}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select blood type" />
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
                <Label htmlFor="allergies">Allergies (Optional)</Label>
                <Textarea
                  id="allergies"
                  placeholder="E.g., Penicillin, Peanuts..."
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  className="min-h-[60px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="conditions">Medical Conditions (Optional)</Label>
                <Textarea
                  id="conditions"
                  placeholder="E.g., Diabetes, Hypertension..."
                  value={conditions}
                  onChange={(e) => setConditions(e.target.value)}
                  className="min-h-[60px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medications">Current Medications (Optional)</Label>
                <Textarea
                  id="medications"
                  placeholder="E.g., Paracetamol 500mg as needed..."
                  value={medications}
                  onChange={(e) => setMedications(e.target.value)}
                  className="min-h-[60px]"
                />
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-4">Address (Optional)</h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="street">Street</Label>
                    <Input
                      id="street"
                      placeholder="123 Ayala Ave"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="h-12"
                    />
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="h-12"
                      />
                    </div>
                    <div className="w-28 space-y-2">
                      <Label htmlFor="state">Region/Province</Label>
                      <Input
                        id="state"
                        placeholder="NCR"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        placeholder="1200"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="h-12"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        placeholder="Philippines"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="h-12"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-4 flex items-center">
                  <Heart className="h-4 w-4 mr-2 text-red-500" />
                  Emergency Contact
                </h3>
                
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyName">Contact Name *</Label>
                    <Input
                      id="emergencyName"
                      placeholder="Jane Doe"
                      value={emergencyName}
                      onChange={(e) => setEmergencyName(e.target.value)}
                      className="h-12"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Contact Phone *</Label>
                      <Input
                        id="emergencyPhone"
                        type="tel"
                        placeholder="+63 912 345 6789"
                        value={emergencyPhone}
                        onChange={(e) => setEmergencyPhone(formatPHPhone(e.target.value))}
                        className="h-12"
                        required
                      />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12"
                disabled={isLoading}
                style={{
                  background: 'linear-gradient(135deg, #0093E9 0%, #80D0C7 100%)'
                }}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
  const normalizePHDigits = (value: string) => {
    const digits = (value || '').replace(/\D/g, '');
    if (!digits) return '';
    if (digits.startsWith('09')) {
      return digits.slice(1); // drop leading 0 -> 9xxxxxxxxx
    }
    if (digits.startsWith('63')) {
      return digits.slice(2); // drop country code -> 9xxxxxxxxx
    }
    return digits; // possibly starts with 9 already
  };

  const formatPHPhone = (value: string) => {
    let d = normalizePHDigits(value);
    if (!d.startsWith('9')) d = '9' + d.replace(/^[^9]*/, '');
    d = d.slice(0, 10);
    const part1 = d.slice(0, 3); // 9xx
    const part2 = d.slice(3, 6); // xxx
    const part3 = d.slice(6, 10); // xxxx
    return `+63${part1 ? ' ' + part1 : ''}${part2 ? ' ' + part2 : ''}${part3 ? ' ' + part3 : ''}`.trim();
  };

  const isPHPhoneValid = (value: string) => {
    const d = normalizePHDigits(value);
    return /^9\d{9}$/.test(d);
  };
