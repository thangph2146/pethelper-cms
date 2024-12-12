import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  light?: boolean;
}

const sizeClasses = {
  sm: 'h-4 w-4 border',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-2'
};

export function Spinner({ size = 'md', light = false }: SpinnerProps) {
  return (
    <div 
      className={`
        animate-spin rounded-full
        ${sizeClasses[size]}
        ${light ? 'border-t-white border-b-white' : 'border-t-indigo-500 border-b-indigo-500'}
      `}
    />
  );
} 