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

  // Smooth scroll handler with animation
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    
    if (element) {
      const offset = 100; // Offset for fixed navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      setActiveSection(targetId);
      setIsOpen(false);
    }
  };

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = menuItems.map(item => item.href.replace('#', ''));
      const scrollPosition = window.scrollY + 150; // Navbar height offset

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
    };

    // Debounce scroll handler for better performance
    let timeoutId: NodeJS.Timeout;
    const debouncedHandleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 50);
    };

    window.addEventListener('scroll', debouncedHandleScroll);
    handleScroll(); // Initial check

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', debouncedHandleScroll);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className={`mx-4 mt-4 rounded-2xl border px-6 py-2 lg:mx-8 ${
        isDark 
          ? 'bg-black/20 backdrop-blur-xl border-white/10 shadow-lg' 
          : 'bg-white/40 backdrop-blur-md border-white/50 shadow-lg'
      }`}>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image
              src={isDark ? "/AnitaLogo.png" : "/AnitaLogo-removebg-preview.png"}
              alt="Anitah's Hair Studio Logo"
              width={240}
              height={80}
              className="h-12 md:h-14 w-auto object-contain rounded-xl"
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
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg hover:bg-accent/10 transition-colors"
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
              className="lg:hidden p-2"
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
