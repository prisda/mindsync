import React from 'react';
import { Star, Clock, Trash2 } from 'lucide-react';
import { Note } from '../types/note';
import { formatDate } from '../utils/dateUtils';
import { getTagColors } from '../utils/tagColors';
import { useViewStore } from '../store/useViewStore';

interface DocumentGridProps {
  notes: Note[];
  onNoteSelect: (noteId: string) => void;
  onToggleStar: (noteId: string) => void;
  onDelete?: (noteId: string) => void;
}

export function DocumentGrid({ notes, onNoteSelect, onToggleStar, onDelete }: DocumentGridProps) {
  const { selectedNotes, toggleNoteSelection, isSelectionMode } = useViewStore();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {notes.map((note) => (
        <div 
          key={note.id}
          className={`card p-4 hover:shadow-md transition-shadow cursor-pointer group relative ${
            selectedNotes.has(note.id) ? 'ring-2 ring-blue-500' : ''
          }`}
          onClick={() => onNoteSelect(note.id)}
        >
          {isSelectionMode && (
            <div className="absolute top-2 left-2 z-10">
              <input
                type="checkbox"
                checked={selectedNotes.has(note.id)}
                onChange={() => toggleNoteSelection(note.id)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(note.id);
              }}
              className="absolute top-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
            </button>
          )}
          <div 
            className="pt-6"
            onClick={() => onNoteSelect(note.id)}
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-medium text-gray-900 dark:text-white truncate">
                {note.title || 'Untitled'}
              </h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleStar(note.id);
                }}
                className="icon-btn opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Star
                  className={`w-4 h-4 ${
                    note.isPinned
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-400'
                  }`}
                />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
              {note.content.replace(/[#*`]/g, '')}
            </p>

            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDate(note.updatedAt)}
              </div>
              {note.tags?.length > 0 && (
                <div className="flex gap-1">
                  {note.tags.slice(0, 2).map((tag, i) => {
                    const tagColor = getTagColors(tag);
                    return (
                      <span
                        key={i}
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${tagColor.bg} ${tagColor.text}`}
                      >
                        #{tag.replace('#', '')}
                      </span>
                    );
                  })}
                  {note.tags.length > 2 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      +{note.tags.length - 2}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}