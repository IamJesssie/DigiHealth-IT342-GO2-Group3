import { ReactNode } from 'react';
import { Home, Calendar, FileText, Search, User, Bell } from 'lucide-react';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useNotificationContext } from '../context/NotificationContext';
import { NotificationsDialog } from './NotificationsDialog';

interface PatientMobileLayoutProps {
  children: ReactNode;
  currentScreen: 'dashboard' | 'appointments' | 'records' | 'search' | 'profile';
  onNavigate: (screen: string) => void;
  patient: any;
  notificationCount?: number;
  onNotificationClick?: () => void;
}

export function PatientMobileLayout({ 
  children, 
  currentScreen, 
  onNavigate, 
  patient,
}: PatientMobileLayoutProps) {
  
  const { unreadCount, showNotifications, setShowNotifications, notifications, markAllAsRead } = useNotificationContext();

  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'appointments', icon: Calendar, label: 'Appointments' },
    { id: 'search', icon: Search, label: 'Find Doctors' },
    { id: 'records', icon: FileText, label: 'Records' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={patient?.profilePicture} alt={patient?.name} />
              <AvatarFallback>{patient?.name?.charAt(0) || 'P'}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm text-muted-foreground">Welcome back,</p>
              <p className="font-semibold">{patient?.name || 'Patient'}</p>
            </div>
          </div>
          
          <button 
            className="relative p-2 hover:bg-gray-100 rounded-full"
            onClick={() => setShowNotifications(true)}
          >
            <Bell className="h-6 w-6 text-gray-600" />
            {unreadCount > 0 && (
              <Badge 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                style={{
                  background: 'linear-gradient(135deg, #0093E9 0%, #80D0C7 100%)'
                }}
              >
                {unreadCount}
              </Badge>
            )}
          </button>
        </div>
      </header>

      <NotificationsDialog 
        open={showNotifications} 
        onOpenChange={setShowNotifications}
        notifications={notifications}
        onMarkAllAsRead={markAllAsRead}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg max-w-md mx-auto">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'text-white' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                style={isActive ? {
                  background: 'linear-gradient(135deg, #0093E9 0%, #80D0C7 100%)'
                } : {}}
              >
                <Icon className={`h-6 w-6 ${isActive ? 'text-white' : ''}`} />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
