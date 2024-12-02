import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, Clock } from 'lucide-react';
import { useNotesStore } from '../store/useNotesStore';

export function HistoryPage() {
  const navigate = useNavigate();
  const { notes } = useNotesStore();

  return (
    <div className="min-h-screen gradient-bg">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/')}
            className="icon-btn"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="header-title">Document History</h1>
            <p className="header-subtitle">View and manage your document history</p>
          </div>
        </div>

        <div className="card p-6">
          <div className="space-y-2">
            {notes.map((note) => (
              <button
                key={note.id}
                onClick={() => navigate(`/note/${note.id}`)}
                className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {note.title || 'Untitled'}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Last modified {format(new Date(note.updatedAt), 'MMM d, yyyy HH:mm')}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}