'use client';

import { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import QuickActionSheet from './quick-action-sheet';
import { useRipple } from './ui/ripple-effect';

export default function FloatingActionButton() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { ripples, addRipple } = useRipple();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    addRipple(e);
    setIsSheetOpen(!isSheetOpen);
  };

  return (
    <>
      {/* Floating Action Button - Mobile Only */}
      <button
        onClick={handleClick}
        className={`lg:hidden fixed right-3 bottom-24 z-40 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg transition-all duration-300 flex items-center justify-center active:scale-95 animate-in fade-in zoom-in slide-in-from-bottom-4 relative overflow-hidden ${
          isSheetOpen 
            ? 'rotate-90 scale-100 hover:scale-105' 
            : 'rotate-0 scale-100 hover:scale-105'
        }`}
        style={{ animationDelay: '400ms' }}
        aria-label="Quick actions"
      >
        <div className={`transition-all duration-300 relative z-10 ${isSheetOpen ? 'rotate-90' : 'rotate-0'}`}>
          {isSheetOpen ? (
            <X className="w-4 h-4 animate-in spin-in duration-300" strokeWidth={2.5} />
          ) : (
            <Sparkles className="w-4 h-4 animate-in spin-in duration-300" strokeWidth={2.5} />
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

