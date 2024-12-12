import React from 'react';
import type { FormFieldProps } from '@/types/form';

export function FormField({
  id,
  name,
  label,
  type = 'text',
  placeholder,
  required = false,
  error,
  icon,
  value,
  onChange,
  className = '',
  ...props
}: FormFieldProps & {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="mt-1 relative rounded-md shadow-sm">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}

        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className={`
            block w-full rounded-md border-gray-300 
            ${icon ? 'pl-10' : 'pl-3'} pr-3 py-2
            focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
            ${error ? 'border-red-300' : 'border-gray-300'}
          `}
          {...props}
        />
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
} 