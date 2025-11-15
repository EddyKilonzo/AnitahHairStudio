'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

type OverlayVariant = 'fade' | 'blur' | 'gradient' | 'dark';

interface TransitionContextType {
  isTransitioning: boolean;
  overlayVariant: OverlayVariant;
  startTransition: (variant?: OverlayVariant, duration?: number) => Promise<void>;
  endTransition: () => void;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

interface TransitionProviderProps {
  children: ReactNode;
}

/**
 * TransitionProvider manages global page transition state
 * Use this at the root of your app to enable transitions throughout
 */
export function TransitionProvider({ children }: TransitionProviderProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [overlayVariant, setOverlayVariant] = useState<OverlayVariant>('fade');

  const startTransition = useCallback(
    async (variant: OverlayVariant = 'fade', duration: number = 600): Promise<void> => {
      setOverlayVariant(variant);
      setIsTransitioning(true);

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, duration);
      });
    },
    []
  );

  const endTransition = useCallback(() => {
    setIsTransitioning(false);
  }, []);

  return (
    <TransitionContext.Provider
      value={{
        isTransitioning,
        overlayVariant,
        startTransition,
        endTransition,
      }}
    >
      {children}
    </TransitionContext.Provider>
  );
}

/**
 * Hook to access transition context
 * Must be used within a TransitionProvider
 */
export function usePageTransition() {
  const context = useContext(TransitionContext);
  if (context === undefined) {
    throw new Error('usePageTransition must be used within a TransitionProvider');
  }
  return context;
}

