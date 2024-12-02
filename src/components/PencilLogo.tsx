import React from 'react';

interface PencilLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function PencilLogo({ size = 'md', className = '' }: PencilLogoProps) {
  const sizes = {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
  };

  const pixelSize = sizes[size];

  return (
    <svg
      width={pixelSize}
      height={pixelSize}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}

// Usage example:
// <PencilLogo size="sm" className="text-blue-600" />
// <PencilLogo size="md" className="text-gray-800" />
// <PencilLogo size="lg" className="text-indigo-500" />
// <PencilLogo size="xl" className="text-purple-600" />