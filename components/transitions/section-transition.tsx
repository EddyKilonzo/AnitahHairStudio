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
  const [isBlurred, setIsBlurred] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const lastScrollYRef = useRef(0);
  const previousRatioRef = useRef(0);
  const scrollDirectionRef = useRef<'up' | 'down' | null>(null);

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
    
    // Initialize scroll position before setting up handler
    if (typeof window !== 'undefined') {
      lastScrollYRef.current = window.scrollY;
    }
    
    // Track scroll direction
    const handleScroll = () => {
      if (typeof window === 'undefined') return;
      
      const currentScrollY = window.scrollY;
      const prevScrollY = lastScrollYRef.current;
      const direction = currentScrollY > prevScrollY ? 'down' : currentScrollY < prevScrollY ? 'up' : scrollDirectionRef.current;
      
      if (direction !== scrollDirectionRef.current) {
        scrollDirectionRef.current = direction;
        setScrollDirection(direction);
      }
      lastScrollYRef.current = currentScrollY;
      
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
        
        // If already in view, show immediately (for AOS to work)
        if (checkIfInView() && !hasAnimated) {
          // Show immediately for visible content - let AOS handle animations
          setIsVisible(true);
          setHasAnimated(true);
        }
        
        // Always set up observer to track scroll direction and blur effects
        // Even if already animated, we need to track for scroll-up blur

        // Listen for scroll events to detect programmatic scrolling and track direction
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              const currentRatio = entry.intersectionRatio;
              const previousRatio = previousRatioRef.current;
              
              // Get current scroll direction from ref (more reliable than state)
              const currentScrollY = window.scrollY;
              const currentDirection = currentScrollY > lastScrollYRef.current ? 'down' : 'up';
              lastScrollYRef.current = currentScrollY;
              
              // Handle blur effect when scrolling up and leaving view
              if (currentDirection === 'up') {
                // If section is leaving view (ratio decreasing) and was previously visible
                if (currentRatio < previousRatio && currentRatio < 0.5 && isVisible) {
                  setIsBlurred(true);
                }
                // If section is entering view (ratio increasing) when scrolling up
                else if (currentRatio > previousRatio && currentRatio > 0.1) {
                  setIsBlurred(false);
                  if (!hasAnimated) {
                    // Check if we're navigating programmatically (from nav click)
                    const isNavigating = typeof window !== 'undefined' && (window as any).__isNavigating;
                    // If scrolling programmatically, show immediately
                    const animationDelay = (isNavigating || isProgrammaticScroll) ? 0 : delay;
                    setTimeout(() => {
                      setIsVisible(true);
                      setHasAnimated(true);
                    }, animationDelay);
                  }
                }
              } else {
                // When scrolling down, let AOS handle animations - just make sure section is visible
                if (entry.isIntersecting) {
                  // Make visible immediately when scrolling down to allow AOS to work
                  if (!hasAnimated) {
                    setIsVisible(true);
                    setHasAnimated(true);
                  }
                  setIsBlurred(false);
                }
                // If scrolling down and section is leaving view, remove blur
                if (currentRatio < previousRatio && currentRatio < 0.1) {
                  setIsBlurred(false);
                }
              }
              
              previousRatioRef.current = currentRatio;
            });
          },
          {
            threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
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
  }, [delay, hasAnimated, threshold, variant, isVisible]);

  const getVariantClasses = () => {
    // Apply blur when scrolling up and leaving view
    const blurClass = isBlurred && scrollDirection === 'up' ? 'blur-md opacity-60' : '';
    
    // When scrolling down, wrapper is completely transparent - AOS handles all animations
    if (scrollDirection === 'down' || !scrollDirection) {
      // Only apply transition for blur effects, no opacity/transform interference
      return `transition-all duration-500 ease-out ${blurClass}`;
    }
    
    // When scrolling up, apply fade-in animation for sections coming into view
    const baseClasses = 'transition-all ease-out';
    
    if (!isVisible) {
      // Fade in when scrolling up and entering view
      switch (variant) {
        case 'fade':
          return `${baseClasses} opacity-0 ${blurClass}`;
        case 'fade-up':
          return `${baseClasses} opacity-0 translate-y-4 ${blurClass}`;
        case 'fade-down':
          return `${baseClasses} opacity-0 -translate-y-4 ${blurClass}`;
        case 'fade-left':
          return `${baseClasses} opacity-0 translate-x-4 ${blurClass}`;
        case 'fade-right':
          return `${baseClasses} opacity-0 -translate-x-4 ${blurClass}`;
        case 'zoom':
          return `${baseClasses} opacity-0 scale-98 ${blurClass}`;
        case 'blur':
          return `${baseClasses} opacity-0 blur-sm`;
        default:
          return `${baseClasses} opacity-0 translate-y-4 ${blurClass}`;
      }
    }
    
    // When visible and scrolling up, only apply blur if leaving view
    return `${baseClasses} opacity-100 ${blurClass} translate-x-0 translate-y-0 scale-100`;
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

