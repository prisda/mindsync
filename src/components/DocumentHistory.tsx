import React from 'react';
import { format } from 'date-fns';
import { Clock, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotesStore } from '../store/useNotesStore';

export function DocumentHistory() {
  const { notes } = useNotesStore();
  const navigate = useNavigate();
  const recentNotes = notes.slice(0, 5);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-medium">Recent Documents</span>
        </div>
        <button
          onClick={() => navigate('/history')}
          className="menu-item"
        >
          View All
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-1.5">
        {recentNotes.map((note) => (
          <button
            key={note.id}
            onClick={() => navigate(`/note/${note.id}`)}
            className="w-full text-left p-2 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {note.title || 'Untitled'}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {format(new Date(note.updatedAt), 'MMM d, yyyy HH:mm')}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}