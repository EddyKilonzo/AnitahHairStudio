'use client';

import { useEffect, useState } from 'react';

interface ScrollProgressProps {
  /**
   * Color of the progress bar
   */
  color?: string;
  /**
   * Height of the progress bar in pixels
   */
  height?: number;
  /**
   * Show at the top or bottom
   */
  position?: 'top' | 'bottom';
  /**
   * Add blur/glow effect
   */
  glow?: boolean;
}

/**
 * ScrollProgress shows a progress bar indicating scroll position
 * Adds visual feedback for page navigation
 */
export default function ScrollProgress({
  color = 'oklch(0.67 0.16 290)',
  height = 3,
  position = 'top',
  glow = true,
}: ScrollProgressProps) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
      
      setScrollProgress(Math.min(100, Math.max(0, scrollPercent)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`fixed ${position === 'top' ? 'top-0' : 'bottom-0'} left-0 right-0 z-[9998] transition-opacity duration-300 ${
        scrollProgress > 0 ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className="bg-muted/10 w-full"
        style={{ height: `${height}px` }}
      >
        <div
          className={`h-full transition-all duration-150 ease-out ${
            glow ? 'shadow-[0_0_10px_currentColor]' : ''
          }`}
          style={{
            width: `${scrollProgress}%`,
            backgroundColor: color,
            color: color,
          }}
        />
      </div>
    </div>
  );
}

