import React from 'react';
import { useSearch } from '../hooks/useSearch';
import { Sparkles } from 'lucide-react';

interface SimilarNotesProps {
  noteId: string;
  onNoteSelect: (noteId: string) => void;
}

export function SimilarNotes({ noteId, onNoteSelect }: SimilarNotesProps) {
  const { similarNotes, findSimilarNotes } = useSearch();

  React.useEffect(() => {
    if (noteId) {
      findSimilarNotes(noteId);
    }
  }, [noteId, findSimilarNotes]);

  if (!similarNotes.length) return null;

  return (
    <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-blue-600" />
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
          Similar Notes
        </h3>
      </div>
      <div className="space-y-2">
        {similarNotes.map((note) => (
          <button
            key={note.id}
            onClick={() => onNoteSelect(note.id)}
            className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <span className="font-medium">{note.title || 'Untitled'}</span>
            <span className="ml-2 text-xs text-gray-500">
              {Math.round(note.similarity * 100)}% similar
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}