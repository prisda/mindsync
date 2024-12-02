import React from 'react';
import { Check } from 'lucide-react';

interface TagColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export function TagColorPicker({ color, onChange }: TagColorPickerProps) {
  const colors = [
    { name: 'rose', value: '#f43f5e' },
    { name: 'blue', value: '#3b82f6' },
    { name: 'green', value: '#22c55e' },
    { name: 'yellow', value: '#eab308' },
    { name: 'purple', value: '#a855f7' },
    { name: 'orange', value: '#f97316' },
    { name: 'cyan', value: '#06b6d4' },
    { name: 'pink', value: '#ec4899' },
  ];

  return (
    <div className="flex flex-wrap gap-2 p-2">
      {colors.map((c) => (
        <button
          key={c.name}
          onClick={() => onChange(c.value)}
          className="w-6 h-6 rounded-full flex items-center justify-center transition-transform hover:scale-110"
          style={{ backgroundColor: c.value }}
        >
          {color === c.value && (
            <Check className="w-4 h-4 text-white" />
          )}
        </button>
      ))}
    </div>
  );
}