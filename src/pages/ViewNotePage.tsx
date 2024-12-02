import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Trash2, Edit2, Search, X } from 'lucide-react';
import { useNotesStore } from '../store/useNotesStore';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { formatFullDate } from '../utils/dateUtils';
import { getTagColors } from '../utils/tagColors';

export function ViewNotePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notes, updateNote, deleteNote, setTagFilter } = useNotesStore();
  const note = notes.find(n => n.id === id);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [colors, setColors] = useState<Record<string, ReturnType<typeof getTagColors>>>({});

  useEffect(() => {
    if (note?.tags) {
      const tagColors = note.tags.reduce((acc, tag) => {
        acc[tag] = getTagColors(tag);
        return acc;
      }, {} as Record<string, ReturnType<typeof getTagColors>>);
      setColors(tagColors);
    }
  }, [note?.tags]);

  const highlightSearchText = (html: string) => {
    if (!searchQuery) return html;
    const regex = new RegExp(`(${searchQuery})`, 'gi');
    return html.replace(regex, '<mark>$1</mark>');
  };

  if (!note) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Note not found</h2>
          {showSearch && (
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search in note..."
                className="w-64 pl-10 pr-10 py-2 bg-gray-100/50 dark:bg-gray-700/50 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="icon-btn"
            title="Search in note"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/notes')}
            className="btn btn-primary"
          >
            Back to Notes
          </button>
        </div>
      </div>
    );
  }

  const handleToggleStar = async () => {
    await updateNote(note.id, { isPinned: !note.isPinned });
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      await deleteNote(note.id);
      navigate('/notes');
    }
  };

  const handleTagClick = (tag: string) => {
    setTagFilter(tag);
    navigate('/notes');
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="icon-btn"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-xl font-semibold">{note.title || 'Untitled'}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Last edited {formatFullDate(note.updatedAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleStar}
              className="icon-btn"
              title={note.isPinned ? 'Unpin note' : 'Pin note'}
            >
              <Star className={`w-4 h-4 ${note.isPinned ? 'fill-yellow-400 text-yellow-400' : ''}`} />
            </button>
            <button
              onClick={() => navigate(`/edit/${note.id}`, { state: { showPreview: true } })}
              className="icon-btn"
              title="Edit note"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="icon-btn text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
              title="Delete note"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {note.tags && note.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1.5">
              {note.tags.map((tag, index) => {
                const tagColor = colors[tag] || getTagColors(tag);
                return (
                  <button
                    key={index}
                    onClick={() => handleTagClick(tag)}
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${tagColor.bg} ${tagColor.text} ${tagColor.hover} transition-colors`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="card">
          <div 
            className="p-4 prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ 
              __html: DOMPurify.sanitize(highlightSearchText(marked(note.content))) 
            }}
          />
        </div>
      </div>
    </div>
  );
}