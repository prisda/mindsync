import React from 'react';
import { Pin } from 'lucide-react';

interface PinButtonProps {
  isPinned: boolean;
  onToggle: () => void;
}

export function PinButton({ isPinned, onToggle }: PinButtonProps) {
  return (
    <button
      onClick={onToggle}
      className={`p-2 rounded-lg transition-colors ${
        isPinned
          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/50'
          : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
      }`}
      title={isPinned ? 'Unpin note' : 'Pin note'}
    >
      <Pin className={`w-5 h-5 ${isPinned ? 'fill-current' : ''}`} />
    </button>
  );
}