import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { useNotesStore } from '../store/useNotesStore';

export function ErrorDisplay() {
  const { error, clearError } = useNotesStore();

  if (!error) return null;

  return (
    <div className="fixed bottom-4 right-4 max-w-sm bg-red-50 dark:bg-red-900/50 text-red-900 dark:text-red-100 p-4 rounded-lg shadow-lg">
      <div className="flex items-start">
        <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium">Error</h3>
          <p className="mt-1 text-sm">{error}</p>
        </div>
        <button
          onClick={clearError}
          className="ml-4 flex-shrink-0 text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}