import React from 'react';

interface Props {
  message: string;
}

export function ErrorMessage({ message }: Props) {
  return (
    <div className="text-center py-8">
      <p className="text-red-500">{message}</p>
    </div>
  );
} 