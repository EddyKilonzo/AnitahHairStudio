'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Moon, Sun } from 'lucide-react';

interface NavigationProps {
  isDark: boolean;
  setIsDark: (isDark: boolean) => void;
}

export default function Navigation({ isDark, setIsDark }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const menuItems = [
    { label: 'Home', href: '#home' },
    { label: 'Services', href: '#services' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Team', href: '#team' },
    { label: 'Booking', href: '#booking' },
  ];

  // Custom smooth scroll handler - prevents conflicts with other scroll handlers
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    
    if (element) {
      // Mark that we're doing programmatic navigation - longer duration for smoother transitions
      (window as any).__isNavigating = true;
      setTimeout(() => {
        (window as any).__isNavigating = false;
      }, 800);
      
      const offset = 120; // Offset for fixed navbar + some padding
      const startPosition = window.pageYOffset;
      const elementTop = element.getBoundingClientRect().top;
      const targetPosition = elementTop + startPosition - offset;
      const distance = targetPosition - startPosition;
      const duration = 500; // Faster scroll for nav clicks
      const startTime = performance.now();

      // Immediately set active section
      setActiveSection(targetId);
      setIsOpen(false);

      // Easing function for smooth animation
      const easeInOutCubic = (t: number): number => {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      };

      // Custom smooth scroll animation
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeInOutCubic(progress);

        window.scrollTo(0, startPosition + distance * easedProgress);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Update URL hash and ensure active section is still correct
          history.pushState(null, '', href);
          setActiveSection(targetId);
        }
      };

      requestAnimationFrame(animate);
    }
  };

  // Track active section on scroll - runs immediately without debounce
  useEffect(() => {
    const handleScroll = () => {
      // Skip scroll-based updates if we're currently navigating
      if ((window as any).__isNavigating) {
        return;
      }
      
      const sections = menuItems.map(item => item.href.replace('#', ''));
      const scrollPosition = window.scrollY + 180; // Match navigation offset

      // Check each section from top to bottom
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          const sectionBottom = offsetTop + offsetHeight;
          
          // If we're within this section's range
          if (scrollPosition >= offsetTop && scrollPosition < sectionBottom) {
            setActiveSection(sectionId);
            return;
          }
        }
      }
      
      // Default to 'home' if we're at the very top
      if (window.scrollY < 100) {
        setActiveSection('home');
      }
    };

    // Call immediately on mount to set initial section
    setTimeout(() => handleScroll(), 200);

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 overflow-hidden">
      <div className={`mx-2 sm:mx-4 mt-4 rounded-2xl border px-3 sm:px-6 py-2 lg:mx-8 ${
        isDark 
          ? 'bg-black/20 backdrop-blur-xl border-white/10 shadow-lg' 
          : 'bg-white/40 backdrop-blur-md border-white/50 shadow-lg'
      }`}>
        <div className="flex items-center justify-between gap-2 sm:gap-4 min-w-0">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-shrink-0 min-w-0">
            <Image
              src={isDark ? "/AnitaLogo.png" : "/AnitaLogo-removebg-preview.png"}
              alt="Anitah's Hair Studio Logo"
              width={240}
              height={80}
              className="h-10 sm:h-12 md:h-14 w-auto max-w-[180px] sm:max-w-[200px] md:max-w-none object-contain rounded-xl"
              priority
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            {menuItems.map((item) => {
              const isActive = activeSection === item.href.replace('#', '');
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`text-sm font-medium transition-all duration-300 relative group ${
                    isActive 
                      ? 'text-primary scale-105' 
                      : 'text-foreground/80 hover:text-primary hover:scale-105'
                  }`}
                >
                  {item.label}
                  {/* Active indicator dot */}
                  <span 
                    className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary transition-all duration-300 ${
                      isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0 group-hover:opacity-50 group-hover:scale-100'
                    }`}
                  />
                </a>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg hover:bg-accent/10 transition-colors flex-shrink-0"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-primary" />
              ) : (
                <Moon className="w-5 h-5 text-primary" />
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 flex-shrink-0"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-white/10 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            {menuItems.map((item, index) => {
              const isActive = activeSection === item.href.replace('#', '');
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`text-sm font-medium transition-all duration-300 py-2 px-3 rounded-lg flex items-center justify-between group ${
                    isActive 
                      ? 'text-primary bg-primary/10 scale-105' 
                      : 'text-foreground/80 hover:text-primary hover:bg-primary/5 hover:scale-105'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  )}
                </a>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}
