'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';

interface SectionTransitionProps {
  children: ReactNode;
  className?: string;
  /**
   * Animation type for the section
   */
  variant?: 'fade' | 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom' | 'blur';
  /**
   * Animation duration in milliseconds
   */
  duration?: number;
  /**
   * Delay before animation starts in milliseconds
   */
  delay?: number;
  /**
   * Threshold for IntersectionObserver (0-1)
   */
  threshold?: number;
}

/**
 * SectionTransition provides smooth scroll-based transitions for individual sections
 * Uses IntersectionObserver for performance
 */
export default function SectionTransition({
  children,
  className = '',
  variant = 'fade-up',
  duration = 800,
  delay = 0,
  threshold = 0.1,
}: SectionTransitionProps) {
  // Always start with false to ensure server/client hydration match
  // We'll set to visible in useEffect for client-side only
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentRef = sectionRef.current;
    if (!currentRef) return;

    // Check if element is already in viewport on mount (client-side only)
    const checkIfInView = () => {
      if (typeof window === 'undefined') return false;
      
      const rect = currentRef.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const windowWidth = window.innerWidth || document.documentElement.clientWidth;
      
      return (
        rect.top < windowHeight + 100 &&
        rect.bottom > -100 &&
        rect.left < windowWidth &&
        rect.right > 0
      );
    };

    let observer: IntersectionObserver | null = null;
    let fallbackTimer: NodeJS.Timeout | null = null;
    let scrollTimeout: NodeJS.Timeout | null = null;
    let isProgrammaticScroll = false;
    let scrollStartTime = 0;
    
    // Detect programmatic scrolling (from navigation clicks)
    const handleScroll = () => {
      const now = performance.now();
      // If scroll happens very quickly, it's likely programmatic
      if (now - scrollStartTime < 50) {
        isProgrammaticScroll = true;
      } else {
        scrollStartTime = now;
      }
      
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isProgrammaticScroll = false;
      }, 300);
    };

    // Only run on client-side to avoid hydration mismatches
    if (typeof window === 'undefined') return;

    // Use requestAnimationFrame to ensure DOM is ready, then check
    const rafId = requestAnimationFrame(() => {
      // Double-check with another frame to ensure layout is complete
      requestAnimationFrame(() => {
        // For fade variant with no delay, show immediately
        if (variant === 'fade' && delay === 0 && !hasAnimated) {
          setIsVisible(true);
          setHasAnimated(true);
          return;
        }
        
        // If already in view, show immediately
        if (checkIfInView() && !hasAnimated) {
          // Show immediately for visible content
          setIsVisible(true);
          setHasAnimated(true);
          return;
        }
        
        // If not in view and hasn't animated, set up observer
        if (hasAnimated) return;

        // Listen for scroll events to detect programmatic scrolling
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && !hasAnimated) {
                // Check if we're navigating programmatically (from nav click)
                const isNavigating = typeof window !== 'undefined' && (window as any).__isNavigating;
                // If scrolling programmatically, show immediately
                const animationDelay = (isNavigating || isProgrammaticScroll) ? 0 : delay;
                setTimeout(() => {
                  setIsVisible(true);
                  setHasAnimated(true);
                }, animationDelay);
              }
            });
          },
          {
            threshold,
            rootMargin: '100px',
          }
        );

        observer.observe(currentRef);

        // Fallback: If section doesn't animate within 300ms, make it visible anyway
        fallbackTimer = setTimeout(() => {
          if (!hasAnimated) {
            setIsVisible(true);
            setHasAnimated(true);
          }
        }, 300);
      });
    });

    return () => {
      cancelAnimationFrame(rafId);
      if (observer) {
        observer.unobserve(currentRef);
        observer.disconnect();
      }
      if (fallbackTimer) {
        clearTimeout(fallbackTimer);
      }
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', handleScroll);
      }
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [delay, hasAnimated, threshold]);

  const getVariantClasses = () => {
    const baseClasses = 'transition-all ease-out';
    
    if (isVisible) {
      return `${baseClasses} opacity-100 blur-0 translate-x-0 translate-y-0 scale-100`;
    }

    switch (variant) {
      case 'fade':
        return `${baseClasses} opacity-0`;
      case 'fade-up':
        return `${baseClasses} opacity-0 translate-y-4`;
      case 'fade-down':
        return `${baseClasses} opacity-0 -translate-y-4`;
      case 'fade-left':
        return `${baseClasses} opacity-0 translate-x-4`;
      case 'fade-right':
        return `${baseClasses} opacity-0 -translate-x-4`;
      case 'zoom':
        return `${baseClasses} opacity-0 scale-98`;
      case 'blur':
        return `${baseClasses} opacity-0 blur-sm`;
      default:
        return `${baseClasses} opacity-0 translate-y-4`;
    }
  };

  return (
    <div
      ref={sectionRef}
      className={`${getVariantClasses()} ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        transformOrigin: 'center',
      }}
    >
      {children}
    </div>
  );
}

