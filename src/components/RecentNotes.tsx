import React from 'react';
import { useNotesStore } from '../store/useNotesStore';
import { formatDate } from '../utils/dateUtils';

interface RecentNotesProps {
  limit: number;
  onSelect: (id: string) => void;
}

export function RecentNotes({ limit, onSelect }: RecentNotesProps) {
  const { notes } = useNotesStore();
  
  const recentNotes = notes
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, limit);

  return (
    <div className="space-y-1">
      {recentNotes.map((note) => (
        <button
          key={note.id}
          onClick={() => onSelect(note.id)}
          className="w-full text-left p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="text-sm truncate text-gray-900 dark:text-white">
            {note.title || 'Untitled'}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {formatDate(note.updatedAt)}
          </div>
        </button>
      ))}
    </div>
  );
}