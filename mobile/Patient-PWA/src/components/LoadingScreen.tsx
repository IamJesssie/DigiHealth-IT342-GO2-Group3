import { useEffect, useState } from 'react';
import { Smartphone } from 'lucide-react';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    // Show loading screen for 2.5 seconds
    const timer = setTimeout(() => {
      // Fade out animation
      setOpacity(0);
      
      // Call onLoadingComplete after fade out
      setTimeout(() => {
        onLoadingComplete();
      }, 500);
    }, 2500);

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  return (
    <div 
      className="fixed inset-0 flex flex-col items-center justify-center transition-opacity duration-500"
      style={{
        background: 'linear-gradient(135deg, #0093E9 0%, #80D0C7 100%)',
        opacity
      }}
    >
      <div className="flex flex-col items-center space-y-6 animate-pulse">
        {/* Logo */}
        <div 
          className="w-24 h-24 rounded-full flex items-center justify-center shadow-2xl"
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Smartphone className="h-12 w-12 text-white" />
        </div>
        
        {/* Brand Name */}
        <div className="text-center">
          <h1 className="text-white text-4xl mb-2">DigiHealth</h1>
          <p className="text-white/80 text-sm">Your Health, Digitalized</p>
        </div>

        {/* Loading Indicator */}
        <div className="flex space-x-2 mt-8">
          <div 
            className="w-3 h-3 bg-white rounded-full animate-bounce"
            style={{ animationDelay: '0ms' }}
          ></div>
          <div 
            className="w-3 h-3 bg-white rounded-full animate-bounce"
            style={{ animationDelay: '150ms' }}
          ></div>
          <div 
            className="w-3 h-3 bg-white rounded-full animate-bounce"
            style={{ animationDelay: '300ms' }}
          ></div>
        </div>
      </div>
    </div>
  );
}
