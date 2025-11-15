'use client';

import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'white';
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

const variantClasses = {
  default: 'text-foreground',
  primary: 'text-primary',
  white: 'text-white',
};

export function LoadingSpinner({ 
  className, 
  size = 'md', 
  variant = 'default' 
}: LoadingSpinnerProps) {
  return (
    <Loader2
      className={cn(
        'animate-spin',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    />
  );
}

interface LoadingButtonProps {
  isLoading?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function LoadingButton({ isLoading, children, className }: LoadingButtonProps) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      {isLoading && <LoadingSpinner size="sm" />}
      {children}
    </span>
  );
}

