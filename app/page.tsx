'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/navigation';
import Hero from '@/components/hero';
import Services from '@/components/services';
import Gallery from '@/components/gallery';
import Testimonials from '@/components/testimonials';
import Team from '@/components/team';
import CTA from '@/components/cta';
import SocialMedia from '@/components/social-media';
import Footer from '@/components/footer';
import Aurora from '@/components/aurora';
import MobileBottomNav from '@/components/mobile-bottom-nav';
import FloatingActionButton from '@/components/floating-action-button';

export default function Home() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    setMounted(true);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(prefersDark);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark, mounted]);

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
      
      // Update active section based on scroll position
      const sections = ['home', 'services', 'gallery', 'team', 'booking'];
      const scrollPosition = window.scrollY + 150;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          const sectionBottom = offsetTop + offsetHeight;
          
          if (scrollPosition >= offsetTop && scrollPosition < sectionBottom) {
            setActiveSection(sectionId);
            return;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen text-foreground relative">
      {/* Aurora Background - Full page background */}
      {mounted && (
        <div className="fixed inset-0 -z-10" style={{ opacity: isDark ? 0.4 : 0.25 }}>
          {isDark ? (
            <Aurora
              colorStops={["#A97FFF", "#C19FFF", "#D4B3FF"]}
              blend={0.8}
              amplitude={0.8}
              speed={0.4}
            />
          ) : (
            <Aurora
              colorStops={["#A97FFF", "#C19FFF", "#D4B3FF"]}
              blend={0.8}
              amplitude={0.7}
              speed={0.3}
            />
          )}
        </div>
      )}
      <Navigation isDark={isDark} setIsDark={setIsDark} />
      <main>
        {/* Hero section with transparent background to show Aurora */}
        <div className="relative z-10 bg-transparent">
          <Hero />
        </div>
        {/* Other sections with transparent background to show Aurora */}
        <div className="relative z-10 bg-transparent">
          <Services />
          <Gallery />
          <Testimonials />
          <Team />
          <SocialMedia />
          <CTA />
        </div>
      </main>
      <Footer />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav 
        activeSection={activeSection} 
        onNavigate={setActiveSection} 
      />

      {/* Floating Action Button - Mobile Only */}
      <FloatingActionButton />

      {/* Scroll to Top Button - Desktop Only */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="hidden lg:flex fixed bottom-8 right-8 p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 z-40 min-w-[48px] min-h-[48px] items-center justify-center"
          aria-label="Scroll to top"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
