import { useState } from 'react';
import { PatientMobileLayout } from './PatientMobileLayout';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Calendar, FileText, Pill, Search, Download, Share2, ChevronRight, Filter } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { toast } from 'sonner@2.0.3';

interface PatientMedicalRecordsProps {
  patient: any;
  onNavigate: (screen: string, data?: any) => void;
  onLogout: () => void;
}

export function PatientMedicalRecords({ patient, onNavigate, onLogout }: PatientMedicalRecordsProps) {
  const [currentScreen] = useState<'dashboard' | 'appointments' | 'records' | 'search' | 'profile'>('records');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

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
  const medicalRecords = [
    {
      id: '1',
      date: '2024-11-28',
      doctorName: 'Dr. Emily Davis',
      specialization: 'Dermatologist',
      doctorImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
      type: 'Consultation',
      chiefComplaint: 'Skin rash on forearm',
      diagnosis: 'Contact Dermatitis',
      prescription: [
        { medicine: 'Hydrocortisone Cream 1%', dosage: 'Apply twice daily', duration: '7 days' },
        { medicine: 'Cetirizine 10mg', dosage: 'Once daily at night', duration: '5 days' },
      ],
      clinicalNotes: 'Patient presented with red, itchy rash on left forearm. Likely allergic reaction to new soap. Advised to avoid irritants.',
      followUp: 'Return in 1 week if symptoms persist',
    },
    {
      id: '2',
      date: '2024-11-15',
      doctorName: 'Dr. Robert Wilson',
      specialization: 'Orthopedic',
      doctorImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert',
      type: 'Follow-up',
      chiefComplaint: 'Knee pain after exercise',
      diagnosis: 'Mild Tendinitis',
      prescription: [
        { medicine: 'Ibuprofen 400mg', dosage: 'Twice daily after meals', duration: '10 days' },
      ],
      clinicalNotes: 'Patient reports improvement in knee pain. Advised to continue physiotherapy exercises and avoid high-impact activities.',
      followUp: 'Follow-up in 2 weeks',
    },
    {
      id: '3',
      date: '2024-10-30',
      doctorName: 'Dr. Sarah Johnson',
      specialization: 'Cardiologist',
      doctorImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      type: 'General Checkup',
      chiefComplaint: 'Routine cardiac checkup',
      diagnosis: 'Normal cardiac function',
      prescription: [],
      clinicalNotes: 'ECG normal. Blood pressure 118/76. Heart rate 68 bpm. Continue current lifestyle and medications.',
      followUp: 'Annual checkup recommended',
      labResults: [
        { test: 'Total Cholesterol', value: '185 mg/dL', range: 'Normal' },
        { test: 'HDL Cholesterol', value: '52 mg/dL', range: 'Normal' },
        { test: 'LDL Cholesterol', value: '110 mg/dL', range: 'Normal' },
      ],
    },
  ];

  const filteredRecords = medicalRecords.filter(record =>
    record.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.chiefComplaint.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDownload = (record: any) => {
    toast.success('Downloading medical record...');
    // Simulate download
  };

  const handleShare = (record: any) => {
    toast.success('Share functionality - Coming soon!');
    // Simulate share
  };

  const RecordDetailSheet = () => {
    if (!selectedRecord) return null;

    return (
      <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle>Medical Record Details</SheetTitle>
        </SheetHeader>

        <div className="space-y-6">
          {/* Doctor Info */}
          <div className="flex items-center gap-3 pb-4 border-b">
            <Avatar className="h-12 w-12">
              <AvatarImage src={selectedRecord.doctorImage} alt={selectedRecord.doctorName} />
              <AvatarFallback>{selectedRecord.doctorName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{selectedRecord.doctorName}</p>
              <p className="text-sm text-muted-foreground">{selectedRecord.specialization}</p>
            </div>
          </div>

          {/* Date and Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Date</p>
              <p className="font-medium">
                {new Date(selectedRecord.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Type</p>
              <Badge>{selectedRecord.type}</Badge>
            </div>
          </div>

          {/* Chief Complaint */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">Chief Complaint</p>
            <Card>
              <CardContent className="p-3">
                <p>{selectedRecord.chiefComplaint}</p>
              </CardContent>
            </Card>
          </div>

          {/* Diagnosis */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">Diagnosis</p>
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-3">
                <p className="font-medium text-blue-900">{selectedRecord.diagnosis}</p>
              </CardContent>
            </Card>
          </div>

          {/* Prescription */}
          {selectedRecord.prescription && selectedRecord.prescription.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Prescription</p>
              <Card>
                <CardContent className="p-3 space-y-3">
                  {selectedRecord.prescription.map((med: any, index: number) => (
                    <div key={index} className="flex gap-3 pb-3 border-b last:border-0">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <Pill className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{med.medicine}</p>
                        <p className="text-sm text-muted-foreground">{med.dosage}</p>
                        <p className="text-xs text-muted-foreground mt-1">Duration: {med.duration}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Clinical Notes */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">Clinical Notes</p>
            <Card>
              <CardContent className="p-3">
                <p className="text-sm leading-relaxed">{selectedRecord.clinicalNotes}</p>
              </CardContent>
            </Card>
          </div>

          {/* Lab Results */}
          {selectedRecord.labResults && selectedRecord.labResults.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Lab Results</p>
              <Card>
                <CardContent className="p-3">
                  <div className="space-y-2">
                    {selectedRecord.labResults.map((result: any, index: number) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div>
                          <p className="font-medium text-sm">{result.test}</p>
                          <p className="text-xs text-muted-foreground">{result.value}</p>
                        </div>
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          {result.range}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Follow-up */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">Follow-up Instructions</p>
            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="p-3">
                <p className="text-sm text-orange-900">{selectedRecord.followUp}</p>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => handleDownload(selectedRecord)}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => handleShare(selectedRecord)}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </SheetContent>
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
        <h1 className="text-2xl font-bold mb-4">Medical Records</h1>

        {/* Search and Filter */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
          <Button variant="outline" size="icon" className="h-12 w-12">
            <Filter className="h-5 w-5" />
          </Button>
        </div>

        {/* Records List */}
        <div className="space-y-3">
          {filteredRecords.length > 0 ? (
            filteredRecords.map((record) => (
              <Sheet key={record.id}>
                <SheetTrigger asChild>
                  <div
                    className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer rounded-lg border"
                    onClick={() => setSelectedRecord(record)}
                  >
                    <div className="p-4">
                      <div className="flex gap-3">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{
                          background: 'linear-gradient(135deg, #0093E9 0%, #80D0C7 100%)'
                        }}>
                          <FileText className="h-6 w-6 text-white" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold truncate">{record.diagnosis}</p>
                              <p className="text-sm text-muted-foreground">{record.doctorName}</p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-2" />
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {record.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </SheetTrigger>
                <RecordDetailSheet />
              </Sheet>
            ))
          ) : (
            <Card className="shadow-sm">
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {searchQuery ? 'No records found matching your search' : 'No medical records yet'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PatientMobileLayout>
  );
}