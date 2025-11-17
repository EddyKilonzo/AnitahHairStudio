'use client';

import { useState, useEffect } from 'react';
import { Home, Scissors, Image, Users, Calendar } from 'lucide-react';

interface MobileBottomNavProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  hideInHero?: boolean;
}

export default function MobileBottomNav({ activeSection, onNavigate, hideInHero = false }: MobileBottomNavProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Arranged according to site order: Home, Services, Gallery, Team, Booking
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'services', icon: Scissors, label: 'Services' },
    { id: 'gallery', icon: Image, label: 'Gallery' },
    { id: 'team', icon: Users, label: 'Team' },
    { id: 'booking', icon: Calendar, label: 'Book' },
  ];

  // Auto-hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down - hide nav
        setIsVisible(false);
      } else {
        // Scrolling up - show nav
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleNavClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      onNavigate(sectionId);
    }
  };

  return (
    <nav
      className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 transition-all duration-500 ${
        isVisible && !hideInHero ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
    >
      {/* Glassmorphism Background */}
      <div className="mx-3 mb-3 rounded-3xl border border-white/20 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(169,127,255,0.15)] animate-in slide-in-from-bottom-4 fade-in duration-700">
        {/* Inner glow effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        
        {/* Safe area padding for devices with notch/home indicator */}
        <div className="relative px-2 py-2.5 pb-safe">
          <div className="flex items-center justify-around gap-0.5">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative flex flex-col items-center gap-1 px-2.5 py-2 rounded-2xl transition-all duration-300 min-w-[56px] min-h-[60px] active:scale-95 animate-in fade-in slide-in-from-bottom-2 ${
                    isActive
                      ? 'bg-primary/20 text-primary scale-105 shadow-lg shadow-primary/20'
                      : 'text-foreground/70 hover:text-foreground hover:bg-white/10'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                  aria-label={item.label}
                >
                  {/* Glassmorphism effect for active state */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-primary/10 to-primary/5 backdrop-blur-sm border border-primary/30" />
                  )}
                  
                  <div className="relative z-10">
                    <Icon
                      className={`w-5 h-5 transition-all duration-300 ${
                        isActive ? 'scale-110 -translate-y-0.5 drop-shadow-lg' : ''
                      }`}
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                    {isActive && (
                      <>
                        <span className="absolute -top-2 -right-2 w-2 h-2 rounded-full bg-primary animate-ping opacity-75" />
                        <span className="absolute -top-2 -right-2 w-2 h-2 rounded-full bg-primary shadow-lg shadow-primary/50" />
                      </>
                    )}
                  </div>
                  <span 
                    className={`relative z-10 text-[10px] transition-all duration-300 ${
                      isActive ? 'font-semibold scale-105' : 'font-medium'
                    }`}
                  >
                    {item.label}
                  </span>
                  {/* Active indicator line at bottom with glow */}
                  <span 
                    className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-primary rounded-full transition-all duration-300 shadow-sm shadow-primary/50 ${
                      isActive ? 'w-6 opacity-100' : 'w-0 opacity-0'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

