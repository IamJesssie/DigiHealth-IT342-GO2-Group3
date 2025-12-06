import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Eye, EyeOff, Mail, Lock, Smartphone } from 'lucide-react';
import { toast } from 'sonner';
import { Checkbox } from './ui/checkbox';

interface PatientLoginProps {
  onLogin: (patient: any) => void;
  onRegister: () => void;
}

export function PatientLogin({ onLogin, onRegister }: PatientLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter your email and password');
      return;
    }
    setIsLoading(true);
    const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    const API_BASE = import.meta.env.VITE_API_BASE_URL || `http://${host}:8080`;
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error((payload && (payload.message || payload.error)) || 'Login failed');
        setIsLoading(false);
        return;
      }
      // Role-based boundary: only allow PATIENT to access Patient PWA
      const role = payload?.user?.role;
      if (role !== 'PATIENT') {
        toast.error('Access denied: This app is for patients. Please use the correct portal.');
        try { localStorage.removeItem('accessToken'); } catch {}
        setIsLoading(false);
        return;
      }
      localStorage.setItem('accessToken', payload.accessToken);
      const name = payload?.user?.fullName || payload?.user?.name || 'Patient';
      const patient = {
        id: String(payload?.user?.id || ''),
        name,
        email: payload?.user?.email || '',
        phone: payload?.user?.phoneNumber || '',
        dateOfBirth: '',
        address: '',
        emergencyContact: '',
        medicalHistory: '',
        profilePicture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      };
      localStorage.setItem('currentUser', JSON.stringify(patient));
      // Existing users logging in are not new
      localStorage.setItem('isNewUser', 'false');
      onLogin(patient);
      toast.success('Welcome back!');
    } catch (err) {
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    
    // Simulate Google OAuth
    setTimeout(() => {
      const mockPatient = {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@gmail.com',
        phone: '+1234567890',
        profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
      };
      
      onLogin(mockPatient);
      toast.success('Signed in with Google');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{
      background: 'linear-gradient(135deg, #0093E9 0%, #80D0C7 100%)'
    }}>
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-1 text-center pb-8">
          <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{
            background: 'linear-gradient(135deg, #0093E9 0%, #80D0C7 100%)'
          }}>
            <Smartphone className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-2xl">Welcome to DigiHealth</CardTitle>
          <CardDescription>Sign in to your DigiHealth account</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Google Sign In */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-12"
            onClick={handleGoogleLogin}
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
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="juan.delacruz@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12"
                  disabled={isLoading}
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

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember" className="text-sm cursor-pointer">
                  Remember me
                </Label>
              </div>
              <Button variant="link" className="px-0 text-sm" type="button">
                Forgot password?
              </Button>
            </div>

            <Button
              type="submit"
              className="w-full h-12"
              disabled={isLoading}
              style={{
                background: 'linear-gradient(135deg, #0093E9 0%, #80D0C7 100%)'
              }}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-muted-foreground">
            Don't have an account?{' '}
            <Button
              variant="link"
              className="px-1"
              onClick={onRegister}
            >
              Create account
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
