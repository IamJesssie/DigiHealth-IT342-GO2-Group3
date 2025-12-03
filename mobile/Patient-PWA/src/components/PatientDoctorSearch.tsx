import { useState } from 'react';
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
  onNavigate: (screen: string, data?: any) => void;
  onLogout: () => void;
}

export function PatientDoctorSearch({ patient, onNavigate, onLogout }: PatientDoctorSearchProps) {
  const [currentScreen] = useState<'dashboard' | 'appointments' | 'records' | 'search' | 'profile'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

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
    onNavigate(mappedScreen);
  };

  // Mock data
  const doctors = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      specialization: 'Cardiologist',
      rating: 4.8,
      reviewCount: 124,
      experience: '15 years',
      location: 'DigiHealth Clinic, Building A',
      nextAvailable: '2024-12-05',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      bio: 'Specialized in preventive cardiology and heart disease management.',
      languages: ['English', 'Spanish'],
      education: 'MD, Harvard Medical School',
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      specialization: 'General Physician',
      rating: 4.9,
      reviewCount: 203,
      experience: '12 years',
      location: 'DigiHealth Clinic, Building B',
      nextAvailable: '2024-12-04',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
      bio: 'General practice with focus on family medicine and preventive care.',
      languages: ['English', 'Mandarin'],
      education: 'MD, Johns Hopkins University',
    },
    {
      id: '3',
      name: 'Dr. Emily Davis',
      specialization: 'Dermatologist',
      rating: 4.7,
      reviewCount: 98,
      experience: '10 years',
      location: 'DigiHealth Clinic, Building A',
      nextAvailable: '2024-12-06',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
      bio: 'Expert in medical and cosmetic dermatology.',
      languages: ['English', 'French'],
      education: 'MD, Stanford University',
    },
    {
      id: '4',
      name: 'Dr. Robert Wilson',
      specialization: 'Orthopedic',
      rating: 4.6,
      reviewCount: 156,
      experience: '18 years',
      location: 'DigiHealth Clinic, Building C',
      nextAvailable: '2024-12-07',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert',
      bio: 'Specializing in sports medicine and joint replacement.',
      languages: ['English'],
      education: 'MD, Mayo Clinic',
    },
    {
      id: '5',
      name: 'Dr. Lisa Anderson',
      specialization: 'Pediatrician',
      rating: 4.9,
      reviewCount: 187,
      experience: '14 years',
      location: 'DigiHealth Clinic, Building B',
      nextAvailable: '2024-12-05',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
      bio: 'Child healthcare specialist with expertise in developmental pediatrics.',
      languages: ['English', 'German'],
      education: 'MD, Yale School of Medicine',
    },
  ];

  const specializations = ['All', 'Cardiologist', 'General Physician', 'Dermatologist', 'Orthopedic', 'Pediatrician'];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialization = selectedSpecialization === 'all' || 
                                 doctor.specialization.toLowerCase() === selectedSpecialization.toLowerCase();
    return matchesSearch && matchesSpecialization;
  });

  const handleDoctorClick = (doctor: any) => {
    onNavigate('doctor-profile', doctor);
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
          {filteredDoctors.length > 0 ? (
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
