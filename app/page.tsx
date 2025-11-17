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
import QuickActionSheet from '@/components/quick-action-sheet';
import { 
  PageOverlay, 
  SmoothScroll, 
  ScrollProgress,
  SectionTransition 
} from '@/components/transitions';
import PageLoader from '@/components/page-loader';
import { Sparkles } from 'lucide-react';

export default function Home() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [isQuickActionSheetOpen, setIsQuickActionSheetOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(prefersDark);
    
    // Check if mobile on mount and resize
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark, mounted]);

  // Track active section on scroll and show quick actions button at 50% scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
      
      // Calculate 50% of page height
      const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (window.scrollY / pageHeight) * 100;
      
      // Show quick actions button after 50% scroll on mobile
      if (isMobile) {
        setShowQuickActions(scrollPercent >= 50);
      } else {
        setShowQuickActions(false);
      }
      
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
  }, [isMobile]);

  // Track hero section visibility to hide mobile nav
  useEffect(() => {
    if (!mounted) return;

    const heroSection = document.getElementById('home');
    if (!heroSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Hide mobile nav when hero is visible (more than 20% visible)
        setIsHeroVisible(entry.intersectionRatio > 0.2);
      },
      {
        threshold: [0, 0.2, 0.5, 1],
        rootMargin: '-80px 0px 0px 0px' // Account for top navbar
      }
    );

    observer.observe(heroSection);

    return () => {
      observer.disconnect();
    };
  }, [mounted]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen text-foreground relative">
      {/* Page Loading Animation */}
      <PageLoader />
      
      {/* Transition Components */}
      <PageOverlay />
      <SmoothScroll duration={800} easing="ease-in-out" />
      <ScrollProgress color="oklch(0.67 0.16 290)" height={3} position="top" glow />

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
        {/* Hero section with transparent background to show Aurora - Always visible */}
        <div className="relative z-10 bg-transparent">
          <Hero />
        </div>
        {/* Other sections with transparent background to show Aurora */}
        <div className="relative z-10 bg-transparent">
          <SectionTransition variant="fade-up" duration={600} delay={0}>
            <Services />
          </SectionTransition>
          <SectionTransition variant="fade-up" duration={600} delay={0}>
            <Gallery />
          </SectionTransition>
          <SectionTransition variant="fade-up" duration={600} delay={0}>
            <Testimonials />
          </SectionTransition>
          <SectionTransition variant="fade-up" duration={600} delay={0}>
            <Team />
          </SectionTransition>
          <SectionTransition variant="fade-up" duration={600} delay={0}>
            <SocialMedia />
          </SectionTransition>
          <SectionTransition variant="zoom" duration={600} delay={0}>
            <CTA />
          </SectionTransition>
        </div>
      </main>
      <SectionTransition variant="fade" duration={600}>
        <Footer />
      </SectionTransition>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav 
        activeSection={activeSection} 
        onNavigate={setActiveSection}
        hideInHero={isHeroVisible}
      />

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

      {/* Quick Actions Button - Mobile Only */}
      {showQuickActions && (
        <button
          onClick={() => setIsQuickActionSheetOpen(true)}
          className="lg:hidden fixed right-4 bottom-20 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-2xl hover:shadow-primary/50 hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group animate-fade-in-up"
          aria-label="Quick actions"
          style={{
            animation: 'fadeInUp 0.3s ease-out'
          }}
        >
          <Sparkles className="w-6 h-6 transition-transform duration-300 group-hover:rotate-12" strokeWidth={2.5} />
        </button>
      )}

      {/* Quick Action Sheet */}
      <QuickActionSheet 
        isOpen={isQuickActionSheetOpen} 
        onClose={() => setIsQuickActionSheetOpen(false)} 
      />
    </div>
  );
}
