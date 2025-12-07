import { useEffect, useState } from 'react';
import type { Screen } from '../App';
import { PatientMobileLayout } from './PatientMobileLayout';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Search, Star, MapPin, Clock, ChevronRight, Filter, Calendar as CalendarIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface PatientDoctorSearchProps {
  patient: any;
  onNavigate: (screen: Screen, data?: any) => void;
  onLogout: () => void;
}

export function PatientDoctorSearch({ patient, onNavigate, onLogout }: PatientDoctorSearchProps) {
  const [currentScreen] = useState<'dashboard' | 'appointments' | 'records' | 'search' | 'profile'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [doctors, setDoctors] = useState<any[]>([]);
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
    const fetchDoctors = async () => {
      setLoading(true);
      setError(null);
      const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
      const API_BASE = (import.meta as any).env.VITE_API_BASE_URL || `http://${host}:8080`;
      const token = localStorage.getItem('accessToken');
      try {
        const res = await fetch(`${API_BASE}/api/appointments/doctors`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) {
          const payload = await res.json().catch(() => null);
          throw new Error((payload && (payload.message || payload.error)) || 'Failed to load doctors');
        }
        const data = await res.json();
        const mapped = (data || []).map((u: any) => ({
          id: u.id,
          name: u.fullName || 'Doctor',
          specialization: u.specialization || 'General Physician',
          rating: 4.8,
          reviewCount: 0,
          experience: '10 years',
          location: 'Clinic',
          nextAvailable: new Date().toISOString().slice(0, 10),
          image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.fullName || 'Doctor')}`,
        }));
        setDoctors(mapped);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const specializations = ['All', 'Cardiologist', 'General Physician', 'Dermatologist', 'Orthopedic', 'Pediatrician'];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialization = selectedSpecialization === 'all' || 
                                 doctor.specialization.toLowerCase() === selectedSpecialization.toLowerCase();
    return matchesSearch && matchesSpecialization;
  });

  const handleDoctorClick = (doctor: any) => {
    onNavigate('book-appointment', doctor);
  };

  return (
    <PatientMobileLayout
      currentScreen={currentScreen}
      onNavigate={handleNavigation}
      patient={patient}
      notificationCount={2}
    >
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Find Doctors</h1>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name or specialization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12"
          />
        </div>

        {/* Specialization Filter */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
          {specializations.map((spec) => (
            <Button
              key={spec}
              variant={selectedSpecialization === spec.toLowerCase() ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedSpecialization(spec.toLowerCase())}
              className={selectedSpecialization === spec.toLowerCase() ? 'whitespace-nowrap' : 'whitespace-nowrap'}
              style={selectedSpecialization === spec.toLowerCase() ? {
                background: 'linear-gradient(135deg, #0093E9 0%, #80D0C7 100%)'
              } : {}}
            >
              {spec}
            </Button>
          ))}
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Doctors List */}
        <div className="space-y-3 pb-4">
          {error && (
            <Card className="shadow-sm">
              <CardContent className="p-4 text-red-600">{error}</CardContent>
            </Card>
          )}
          {loading && (
            <Card className="shadow-sm">
              <CardContent className="p-4">Loading doctors...</CardContent>
            </Card>
          )}
          {!loading && filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => (
              <Card 
                key={doctor.id} 
                className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleDoctorClick(doctor)}
              >
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <Avatar className="h-16 w-16 flex-shrink-0">
                      <AvatarImage src={doctor.image} alt={doctor.name} />
                      <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">{doctor.name}</p>
                          <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-2" />
                      </div>
                      
                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{doctor.rating}</span>
                          <span className="text-sm text-muted-foreground">({doctor.reviewCount} reviews)</span>
                        </div>
                      </div>
                      
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{doctor.experience} experience</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{doctor.location}</span>
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <Badge variant="outline" className="text-xs">
                          <CalendarIcon className="h-3 w-3 mr-1" />
                          Next: {new Date(doctor.nextAvailable).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="shadow-sm">
              <CardContent className="p-8 text-center">
                <Search className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">No doctors found matching your criteria</p>
                <Button 
                  variant="link" 
                  className="mt-2"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedSpecialization('all');
                  }}
                >
                  Clear filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PatientMobileLayout>
  );
}
