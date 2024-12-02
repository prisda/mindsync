import React from 'react';
import { CheckSquare } from 'lucide-react';
import { useViewStore } from '../store/useViewStore';

export function SelectionModeToggle() {
  const { isSelectionMode, setSelectionMode } = useViewStore();

  return (
    <button
      onClick={() => setSelectionMode(!isSelectionMode)}
      className={`p-2 rounded-lg transition-colors ${
        isSelectionMode 
          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
      title={isSelectionMode ? 'Exit selection mode' : 'Enter selection mode'}
    >
      <CheckSquare className="w-5 h-5" />
    </button>
  );
}