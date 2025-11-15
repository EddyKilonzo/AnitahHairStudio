'use client';

import { useEffect } from 'react';

interface SmoothScrollProps {
  /**
   * Scroll behavior duration in milliseconds
   */
  duration?: number;
  /**
   * Easing function for scroll animation
   */
  easing?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

/**
 * SmoothScroll component enhances scroll behavior throughout the page
 * Provides smooth scrolling to anchor links and sections
 */
export default function SmoothScroll({ 
  duration = 800,
  easing = 'ease-in-out' 
}: SmoothScrollProps) {
  useEffect(() => {
    // Don't set global smooth scroll - let individual handlers manage it
    // This prevents conflicts with navigation's custom scroll

    // Handle anchor link clicks with custom smooth scroll
    // Skip if event was already handled by navigation component
    const handleClick = (e: MouseEvent) => {
      // Check if this was already handled (e.g., by navigation)
      const target = e.target as HTMLElement;
      if (target?.closest('nav')) {
        return; // Let navigation handle its own links
      }
      
      // Also skip if event was stopped
      if (e.defaultPrevented) {
        return;
      }
      
      const anchor = target.closest('a[href^="#"]');
      
      if (anchor && anchor instanceof HTMLAnchorElement) {
        const href = anchor.getAttribute('href');
        if (!href || href === '#') return;

        const targetId = href.slice(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          e.preventDefault();

          // Account for fixed navbar offset
          const navbarOffset = 100;
          const startPosition = window.pageYOffset;
          const elementTop = targetElement.getBoundingClientRect().top;
          const targetPosition = elementTop + startPosition - navbarOffset;
          const distance = targetPosition - startPosition;
          const startTime = performance.now();

          const ease = (t: number): number => {
            switch (easing) {
              case 'linear':
                return t;
              case 'ease-in':
                return t * t;
              case 'ease-out':
                return t * (2 - t);
              case 'ease-in-out':
                return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
              default:
                return t;
            }
          };

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = ease(progress);

            window.scrollTo(0, startPosition + distance * easedProgress);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              // Update URL hash without jumping
              history.pushState(null, '', href);
            }
          };

          requestAnimationFrame(animate);
        }
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [duration, easing]);

  return null;
}

