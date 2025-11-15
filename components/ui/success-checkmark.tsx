'use client';

import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SuccessCheckmarkProps {
  show?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onAnimationComplete?: () => void;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export function SuccessCheckmark({ 
  show = false, 
  size = 'md',
  className,
  onAnimationComplete 
}: SuccessCheckmarkProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (show) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        onAnimationComplete?.();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onAnimationComplete]);

  if (!show) return null;

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center',
        className
      )}
    >
      <div
        className={cn(
          'relative flex items-center justify-center',
          sizeClasses[size]
        )}
      >
        {/* Animated circle background */}
        <div
          className={cn(
            'absolute inset-0 rounded-full bg-primary/20',
            isAnimating && 'animate-ping'
          )}
          style={{
            animation: isAnimating ? 'ping 0.6s cubic-bezier(0, 0, 0.2, 1)' : 'none',
          }}
        />
        {/* Checkmark circle */}
        <div
          className={cn(
            'relative rounded-full bg-primary flex items-center justify-center',
            sizeClasses[size],
            isAnimating && 'animate-scale-in'
          )}
          style={{
            animation: isAnimating
              ? 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
              : 'none',
          }}
        >
          <Check
            className={cn(
              'text-primary-foreground',
              size === 'sm' ? 'w-2.5 h-2.5' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'
            )}
            strokeWidth={3}
            style={{
              strokeDasharray: isAnimating ? '100' : '0',
              strokeDashoffset: isAnimating ? '100' : '0',
              animation: isAnimating
                ? 'checkmarkDraw 0.4s ease-out 0.2s both'
                : 'none',
            }}
          />
        </div>
      </div>
    </div>
  );
}

