'use client';

import { useEffect, useState, useRef } from 'react';

export default function PageLoader() {
  const [isLoading, setIsLoading] = useState(false); // Start hidden
  const [fadeOut, setFadeOut] = useState(false);
  const isLoadingRef = useRef(false);
  const LOADING_THRESHOLD = 800; // Only show if loading takes longer than 800ms

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
      
      // Only show loader if loading took longer than threshold OR network is slow
      if (loadTime > LOADING_THRESHOLD || checkNetworkStatus()) {
        // Page took a while to load, fade out the loader if it was shown
        if (isLoadingRef.current) {
          fadeTimer = setTimeout(() => {
            startFadeOut();
          }, 300);
        } else {
          // Loader wasn't shown yet, don't show it now
          isLoadingRef.current = false;
          setIsLoading(false);
        }
      } else {
        // Page loaded quickly, don't show loader at all
        isLoadingRef.current = false;
        setIsLoading(false);
      }
    };

    // Check if network is slow/offline immediately
    if (checkNetworkStatus()) {
      // Network is slow, show loader immediately
      isLoadingRef.current = true;
      setIsLoading(true);
    }

    // Check if page is already loaded
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      // Set timer to show loader if loading takes too long
      showTimer = setTimeout(() => {
        const loadTime = performance.now() - startTime;
        if (loadTime > LOADING_THRESHOLD && !hasStartedFade) {
          isLoadingRef.current = true;
          setIsLoading(true);
        }
      }, LOADING_THRESHOLD);

      // Wait for window load event (includes images)
      window.addEventListener('load', handleLoad);
    }

    return () => {
      window.removeEventListener('load', handleLoad);
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

