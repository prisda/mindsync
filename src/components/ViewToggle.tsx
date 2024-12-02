import React from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { useViewStore } from '../store/useViewStore';

export function ViewToggle() {
  const { viewMode, setViewMode } = useViewStore();

  return (
    <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
      <button
        onClick={() => setViewMode('card')}
        className={`p-2 rounded ${
          viewMode === 'card' 
            ? 'bg-white dark:bg-gray-600 shadow-sm' 
            : 'hover:bg-white/50 dark:hover:bg-gray-600/50'
        }`}
        title="Card view"
      >
        <LayoutGrid className="w-5 h-5" />
      </button>
      <button
        onClick={() => setViewMode('list')}
        className={`p-2 rounded ${
          viewMode === 'list' 
            ? 'bg-white dark:bg-gray-600 shadow-sm' 
            : 'hover:bg-white/50 dark:hover:bg-gray-600/50'
        }`}
        title="List view"
      >
        <List className="w-5 h-5" />
      </button>
    </div>
  );
}