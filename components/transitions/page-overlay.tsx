'use client';

import { useEffect, useState } from 'react';
import { usePageTransition } from './transition-context';

/**
 * PageOverlay creates a full-screen transition effect
 * Used for route changes, major state transitions, or loading states
 */
export default function PageOverlay() {
  const { isTransitioning, overlayVariant } = usePageTransition();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isTransitioning) {
      setIsVisible(true);
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
      // Delay hiding to allow fade-out animation
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  if (!isVisible) return null;

  const getOverlayStyles = () => {
    switch (overlayVariant) {
      case 'fade':
        return {
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(8px)',
        };
      case 'blur':
        return {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
        };
      case 'gradient':
        return {
          background: 'linear-gradient(135deg, rgba(169, 127, 255, 0.3) 0%, rgba(212, 179, 255, 0.3) 100%)',
          backdropFilter: 'blur(12px)',
        };
      case 'dark':
        return {
          background: 'rgba(0, 0, 0, 0.9)',
          backdropFilter: 'blur(4px)',
        };
      default:
        return {
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(10px)',
        };
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-all ease-in-out ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        ...getOverlayStyles(),
        transitionDuration: '600ms',
      }}
    >
      {/* Optional: Add loading spinner or custom content */}
      <div className="relative">
        {/* Animated circles */}
        <div className="flex gap-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-4 h-4 rounded-full bg-primary animate-pulse"
              style={{
                animationDelay: `${i * 150}ms`,
                animationDuration: '1s',
              }}
            />
          ))}
        </div>
        
        {/* Optional text */}
        <div className="mt-6 text-center">
          <p className="text-sm font-medium text-white/90 animate-pulse">
            Loading...
          </p>
        </div>
      </div>
    </div>
  );
}

