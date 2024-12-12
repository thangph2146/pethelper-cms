'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  className?: string;
}

export function FormField({
  id,
  label,
  error,
  className,
  ...props
}: FormFieldProps & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <input
        id={id}
        className={cn(
          "block w-full rounded-md border border-gray-300 px-3 py-2",
          "focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
          "disabled:bg-gray-100 disabled:cursor-not-allowed",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500",
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
} 