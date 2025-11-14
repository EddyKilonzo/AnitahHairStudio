'use client';

import { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import QuickActionSheet from './quick-action-sheet';

export default function FloatingActionButton() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <>
      {/* Floating Action Button - Mobile Only */}
      <button
        onClick={() => setIsSheetOpen(!isSheetOpen)}
        className={`lg:hidden fixed right-3 bottom-24 z-40 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg transition-all duration-300 flex items-center justify-center active:scale-95 animate-in fade-in zoom-in slide-in-from-bottom-4 ${
          isSheetOpen 
            ? 'rotate-90 scale-100 hover:scale-105' 
            : 'rotate-0 scale-100 hover:scale-105'
        }`}
        style={{ animationDelay: '400ms' }}
        aria-label="Quick actions"
      >
        <div className={`transition-all duration-300 ${isSheetOpen ? 'rotate-90' : 'rotate-0'}`}>
          {isSheetOpen ? (
            <X className="w-4 h-4 animate-in spin-in duration-300" strokeWidth={2.5} />
          ) : (
            <Sparkles className="w-4 h-4 animate-in spin-in duration-300" strokeWidth={2.5} />
          )}
        </div>
      </button>

      {/* Quick Action Sheet */}
      <QuickActionSheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)} />
    </>
  );
}

