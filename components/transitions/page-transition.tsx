'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePageTransition } from './transition-context';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

/**
 * PageTransition wraps content with fade and blur effects
 * Automatically triggers on mount and when context state changes
 */
export default function PageTransition({ children, className = '' }: PageTransitionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { isTransitioning } = usePageTransition();

  useEffect(() => {
    // Trigger fade-in on mount
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`transition-all duration-700 ease-in-out ${
        isVisible && !isTransitioning
          ? 'opacity-100 blur-0 scale-100'
          : 'opacity-0 blur-sm scale-[0.98]'
      } ${className}`}
      style={{
        transformOrigin: 'center',
      }}
    >
      {children}
    </div>
  );
}

