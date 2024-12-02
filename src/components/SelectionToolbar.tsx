import React from 'react';
import { Trash2, Tag, X, CheckSquare } from 'lucide-react';
import { useViewStore } from '../store/useViewStore';

interface SelectionToolbarProps {
  onDelete: () => void;
  onAddTags: () => void;
}

export function SelectionToolbar({ onDelete, onAddTags }: SelectionToolbarProps) {
  const { selectedNotes, clearSelection, setSelectionMode } = useViewStore();
  
  if (selectedNotes.size === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 flex items-center space-x-2">
      <span className="text-sm text-gray-600 dark:text-gray-400 px-2">
        {selectedNotes.size} selected
      </span>

      <button
        onClick={onAddTags}
        className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        title="Add tags"
      >
        <Tag className="w-5 h-5" />
      </button>

      <button
        onClick={onDelete}
        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-lg"
        title="Delete selected"
      >
        <Trash2 className="w-5 h-5" />
      </button>

      <button
        onClick={clearSelection}
        className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        title="Clear selection"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}