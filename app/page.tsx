'use client';

import { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Navigation from '@/components/navigation';
import Hero from '@/components/hero';
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

// Loading component for lazy loaded sections
const SectionLoader = () => (
  <div className="flex items-center justify-center min-h-[200px] py-12">
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-8 h-8">
        <div className="absolute inset-0 rounded-full border-2 border-primary/20"></div>
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin"></div>
      </div>
      <p className="text-sm text-foreground/60">Loading...</p>
    </div>
  </div>
);

// Lazy load components that are below the fold using Next.js dynamic imports
const Services = dynamic(() => import('@/components/services'), {
  loading: () => <SectionLoader />,
  ssr: true,
});

const Gallery = dynamic(() => import('@/components/gallery'), {
  loading: () => <SectionLoader />,
  ssr: true,
});

const Testimonials = dynamic(() => import('@/components/testimonials'), {
  loading: () => <SectionLoader />,
  ssr: true,
});

const Team = dynamic(() => import('@/components/team'), {
  loading: () => <SectionLoader />,
  ssr: true,
});

const CTA = dynamic(() => import('@/components/cta'), {
  loading: () => <SectionLoader />,
  ssr: true,
});

const SocialMedia = dynamic(() => import('@/components/social-media'), {
  loading: () => <SectionLoader />,
  ssr: true,
});

const Footer = dynamic(() => import('@/components/footer'), {
  loading: () => <SectionLoader />,
  ssr: true,
});

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
        {/* Other sections with transparent background to show Aurora - Lazy Loaded */}
        <div className="relative z-10 bg-transparent">
          <SectionTransition variant="fade-up" duration={600} delay={0}>
            <Suspense fallback={<SectionLoader />}>
              <Services />
            </Suspense>
          </SectionTransition>
          <SectionTransition variant="fade-up" duration={600} delay={0}>
            <Suspense fallback={<SectionLoader />}>
              <Gallery />
            </Suspense>
          </SectionTransition>
          <SectionTransition variant="fade-up" duration={600} delay={0}>
            <Suspense fallback={<SectionLoader />}>
              <Testimonials />
            </Suspense>
          </SectionTransition>
          <SectionTransition variant="fade-up" duration={600} delay={0}>
            <Suspense fallback={<SectionLoader />}>
              <Team />
            </Suspense>
          </SectionTransition>
          <SectionTransition variant="fade-up" duration={600} delay={0}>
            <Suspense fallback={<SectionLoader />}>
              <SocialMedia />
            </Suspense>
          </SectionTransition>
          <SectionTransition variant="zoom" duration={600} delay={0}>
            <Suspense fallback={<SectionLoader />}>
              <CTA />
            </Suspense>
          </SectionTransition>
        </div>
      </main>
      <SectionTransition variant="fade" duration={600}>
        <Suspense fallback={<SectionLoader />}>
          <Footer />
        </Suspense>
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
