import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotesStore } from '../store/useNotesStore';
import { DocumentGrid } from '../components/DocumentGrid';
import { Star } from 'lucide-react';

export function StarredPage() {
  const { notes } = useNotesStore();
  const navigate = useNavigate();

  const starredNotes = notes.filter(note => note.isPinned);

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Star className="w-6 h-6" />
            Starred Notes
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {starredNotes.length} {starredNotes.length === 1 ? 'note' : 'notes'}
          </p>
        </div>

        <DocumentGrid
          notes={starredNotes}
          onNoteSelect={(id) => navigate(`/view/${id}`)}
          onToggleStar={async (noteId) => {
            const note = notes.find(n => n.id === noteId);
            if (note) {
              await useNotesStore.getState().updateNote(noteId, { isPinned: !note.isPinned });
            }
          }}
        />
      </div>
    </div>
  );
}