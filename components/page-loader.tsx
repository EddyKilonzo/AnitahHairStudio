'use client';

import { useEffect, useState, useRef } from 'react';

export default function PageLoader() {
  const [isLoading, setIsLoading] = useState(true); // Start visible
  const [fadeOut, setFadeOut] = useState(false);
  const isLoadingRef = useRef(true);
  const LOADING_THRESHOLD = 100; // Show loader immediately (reduced threshold)

  useEffect(() => {
    let showTimer: NodeJS.Timeout;
    let fadeTimer: NodeJS.Timeout;
    let hasStartedFade = false;
    const startTime = performance.now();

    // Check network connection
    const checkNetworkStatus = (): boolean => {
      // Check if offline
      if (!navigator.onLine) {
        return true; // Offline
      }
      
      // Check connection API (may not be available in all browsers)
      const nav = navigator as any;
      const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
      
      if (connection) {
        // Show loader if connection is slow (2G, slow-2g, or downlink is very slow)
        const slowConnections = ['slow-2g', '2g'];
        const effectiveType = connection.effectiveType || connection.type;
        
        if (effectiveType && slowConnections.includes(effectiveType)) {
          return true; // Network is slow
        }
        
        // Check downlink speed (Mbps)
        if (connection.downlink !== undefined && connection.downlink < 0.5) {
          return true; // Very slow connection
        }
      }
      
      return false;
    };

    const startFadeOut = () => {
      if (hasStartedFade) return;
      hasStartedFade = true;
      
      setFadeOut(true);
      // Wait for fade out animation to complete before removing
      fadeTimer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
    };

    const handleLoad = () => {
      // Clear the show timer since page has loaded
      if (showTimer) {
        clearTimeout(showTimer);
      }
      
      const loadTime = performance.now() - startTime;
      
      // Always fade out the loader when page is loaded
      if (isLoadingRef.current) {
        // Ensure minimum display time for smooth UX (at least 500ms)
        const minDisplayTime = 500;
        const remainingTime = Math.max(0, minDisplayTime - loadTime);
        
        fadeTimer = setTimeout(() => {
          startFadeOut();
        }, remainingTime);
      } else {
        isLoadingRef.current = false;
        setIsLoading(false);
      }
    };

    // Show loader immediately
    isLoadingRef.current = true;
    setIsLoading(true);

    // Check if network is slow/offline immediately
    if (checkNetworkStatus()) {
      // Network is slow, keep loader visible
      isLoadingRef.current = true;
      setIsLoading(true);
    }

    // Wrapper function for load event
    const loadHandler = () => {
      // Small delay to ensure smooth transition
      setTimeout(() => {
        handleLoad();
      }, 300);
    };

    // Check if page is already loaded
    if (document.readyState === 'complete') {
      loadHandler();
    } else {
      // Wait for window load event (includes images)
      window.addEventListener('load', loadHandler);
    }

    return () => {
      window.removeEventListener('load', loadHandler);
      if (showTimer) clearTimeout(showTimer);
      if (fadeTimer) clearTimeout(fadeTimer);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-background/95 backdrop-blur-sm transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center gap-6">
        {/* Spinner Animation */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
          {/* Inner pulsing circle */}
          <div className="absolute inset-2 rounded-full bg-primary/10 animate-pulse"></div>
        </div>

        {/* Loading Message */}
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-foreground">
            Welcome to Anita's Hair Studio
          </p>
          <p className="text-sm text-foreground/60">
            Loading...
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-48 h-1 bg-primary/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full"
            style={{
              animation: 'progress 1.5s ease-in-out infinite',
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}

