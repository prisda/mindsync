import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotesStore } from '../store/useNotesStore';
import { useViewStore } from '../store/useViewStore';
import { DocumentGrid } from '../components/DocumentGrid';
import { DocumentList } from '../components/DocumentList';
import { ViewToggle } from '../components/ViewToggle';
import { SelectionModeToggle } from '../components/SelectionModeToggle';
import { SelectionToolbar } from '../components/SelectionToolbar';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { TagManagementModal } from '../components/TagManagementModal';

export function NotesPage() {
  const { notes, filteredNotes, searchQuery, tagFilter } = useNotesStore();
  const { viewMode, selectedNotes, setSelectionMode } = useViewStore();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [showTagModal, setShowTagModal] = React.useState(false);

  // Use filtered notes if there's a search query or tag filter, otherwise use all notes
  const displayedNotes = (searchQuery || tagFilter) ? filteredNotes : notes;

  const handleDelete = async () => {
    setShowDeleteModal(true);
  };
  
  const handleSingleDelete = async (noteId: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      await useNotesStore.getState().deleteNote(noteId);
    }
  };

  const handleConfirmDelete = async () => {
    const selectedIds = Array.from(selectedNotes);
    for (const noteId of selectedIds) {
      await useNotesStore.getState().deleteNote(noteId);
    }
    setShowDeleteModal(false);
    setSelectionMode(false);
  };

  const handleApplyTags = async (tags: string[]) => {
    const selectedIds = Array.from(selectedNotes);
    for (const noteId of selectedIds) {
      const note = notes.find(n => n.id === noteId);
      if (note) {
        const existingTags = new Set(note.tags || []);
        tags.forEach(tag => existingTags.add(tag));
        await useNotesStore.getState().updateNote(noteId, { 
          tags: Array.from(existingTags) 
        });
      }
    }
    setSelectionMode(false);
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {tagFilter ? `#${tagFilter}` : searchQuery ? 'Search Results' : 'All Notes'}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {displayedNotes.length} {displayedNotes.length === 1 ? 'note' : 'notes'}
          </p>
          </div>
          <div className="flex items-center gap-2">
            <SelectionModeToggle />
            <ViewToggle />
          </div>
        </div>

        {viewMode === 'card' ? (
          <DocumentGrid
            notes={displayedNotes}
            onNoteSelect={(id) => navigate(`/view/${id}`)}
            onToggleStar={async (noteId) => {
              const note = notes.find(n => n.id === noteId);
              if (note) {
                await useNotesStore.getState().updateNote(noteId, { isPinned: !note.isPinned });
              }
            }}
            onDelete={handleSingleDelete}
          />
        ) : (
          <DocumentList
            notes={displayedNotes}
            onNoteSelect={(id) => navigate(`/view/${id}`)}
            onToggleStar={async (noteId) => {
              const note = notes.find(n => n.id === noteId);
              if (note) {
                await useNotesStore.getState().updateNote(noteId, { isPinned: !note.isPinned });
              }
            }}
            onDelete={handleSingleDelete}
          />
        )}

        <SelectionToolbar
          onDelete={handleDelete}
          onAddTags={() => setShowTagModal(true)}
        />

        <DeleteConfirmModal
          isOpen={showDeleteModal}
          count={selectedNotes.size}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteModal(false)}
        />

        <TagManagementModal
          isOpen={showTagModal}
          onClose={() => setShowTagModal(false)}
          selectedNoteIds={Array.from(selectedNotes)}
          onApply={handleApplyTags}
        />
      </div>
    </div>
  );
}