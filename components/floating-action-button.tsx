'use client';

import { useState, useEffect } from 'react';
import { Sparkles, X } from 'lucide-react';
import QuickActionSheet from './quick-action-sheet';
import { useRipple } from './ui/ripple-effect';

export default function FloatingActionButton() {
  const [mounted, setMounted] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { ripples, addRipple } = useRipple();

  // Avoid SSR/client mismatches by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Show button when user scrolls down 50% of the page, hide near bottom
  useEffect(() => {
    const computeVisibility = () => {
      const docEl = document.documentElement;
      const scrollTop = window.pageYOffset || docEl.scrollTop || 0;
      const clientHeight = docEl.clientHeight || window.innerHeight;
      const scrollHeight = docEl.scrollHeight || 0;

      const scrollable = Math.max(scrollHeight - clientHeight, 1);

      // Compute a robust threshold: 50% of scrollable height but cap so it doesn't end up too late
      const halfScrollable = scrollable * 0.5;
      const thresholdPx = Math.min(halfScrollable, 1200); // show by 1200px at latest
      const pastThreshold = scrollTop >= thresholdPx;

      // Optionally hide very close to the bottom to avoid footer overlap
      const nearBottom = scrollTop + clientHeight >= scrollHeight - 240;

      setIsVisible(pastThreshold && !nearBottom);
    };

    window.addEventListener('scroll', computeVisibility, { passive: true });
    window.addEventListener('resize', computeVisibility, { passive: true });
    computeVisibility(); // initial

    return () => {
      window.removeEventListener('scroll', computeVisibility);
      window.removeEventListener('resize', computeVisibility);
    };
  }, []);

  if (!mounted) {
    return null;
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    addRipple(e);
    setIsSheetOpen(!isSheetOpen);
  };

  return (
    <>
      {/* Floating Action Button - Appears on scroll */}
      <button
        onClick={handleClick}
        className={`fixed right-4 bottom-4 sm:right-6 sm:bottom-6 lg:right-8 lg:bottom-8 z-50 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-2xl transition-all duration-500 flex items-center justify-center active:scale-95 relative overflow-hidden ${
          isVisible
            ? 'translate-y-0 opacity-100 scale-100'
            : 'translate-y-20 opacity-0 scale-0 pointer-events-none'
        } ${
          isSheetOpen 
            ? 'rotate-90 hover:scale-110' 
            : 'rotate-0 hover:scale-110'
        }`}
        aria-label="Quick actions"
      >
        <div className={`transition-all duration-300 relative z-10 ${isSheetOpen ? 'rotate-90' : 'rotate-0'}`}>
          {isSheetOpen ? (
            <X className="w-6 h-6 sm:w-7 sm:h-7 animate-in spin-in duration-300" strokeWidth={2.5} />
          ) : (
            <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 animate-in spin-in duration-300" strokeWidth={2.5} />
          )}
        </div>
        {ripples.length > 0 && (
          <span className="absolute inset-0 overflow-hidden pointer-events-none">
            {ripples.map((ripple) => (
              <span
                key={ripple.id}
                className="absolute rounded-full animate-ripple"
                style={{
                  left: ripple.x,
                  top: ripple.y,
                  width: ripple.size,
                  height: ripple.size,
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  transform: 'scale(0)',
                }}
              />
            ))}
          </span>
        )}
      </button>

      {/* Quick Action Sheet */}
      <QuickActionSheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)} />
    </>
  );
}

