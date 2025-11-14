'use client';

import { useState, useEffect } from 'react';
import { Home, Calendar, Image, Users } from 'lucide-react';

interface MobileBottomNavProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

export default function MobileBottomNav({ activeSection, onNavigate }: MobileBottomNavProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'booking', icon: Calendar, label: 'Book' },
    { id: 'gallery', icon: Image, label: 'Gallery' },
    { id: 'team', icon: Users, label: 'Team' },
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
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
    >
      {/* Background with blur */}
      <div className="mx-4 mb-4 rounded-2xl border border-white/10 bg-background/80 backdrop-blur-xl shadow-2xl animate-in slide-in-from-bottom-4 fade-in duration-700">
        {/* Safe area padding for devices with notch/home indicator */}
        <div className="px-2 py-3 pb-safe">
          <div className="flex items-center justify-around gap-1">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300 min-w-[60px] min-h-[56px] active:scale-95 animate-in fade-in slide-in-from-bottom-2 ${
                    isActive
                      ? 'bg-primary/15 text-primary scale-105'
                      : 'text-foreground/60 hover:text-foreground hover:bg-accent/50'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                  aria-label={item.label}
                >
                  <div className="relative">
                    <Icon
                      className={`w-5 h-5 transition-all duration-300 ${
                        isActive ? 'scale-110 -translate-y-0.5' : ''
                      }`}
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                    {isActive && (
                      <span className="absolute -top-2 -right-2 w-2 h-2 rounded-full bg-primary animate-ping" />
                    )}
                    {isActive && (
                      <span className="absolute -top-2 -right-2 w-2 h-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <span 
                    className={`text-xs transition-all duration-300 ${
                      isActive ? 'font-semibold scale-105' : 'font-medium'
                    }`}
                  >
                    {item.label}
                  </span>
                  {/* Active indicator line at bottom */}
                  <span 
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-primary rounded-full transition-all duration-300 ${
                      isActive ? 'w-8 opacity-100' : 'w-0 opacity-0'
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

