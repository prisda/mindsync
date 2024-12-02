import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Save, Eye, EyeOff, Search, X } from 'lucide-react';
import { useNotesStore } from '../store/useNotesStore';
import { useAuthStore } from '../store/useAuthStore';
import { Editor } from '../components/Editor';
import { Preview } from '../components/Preview';
import { TagInput } from '../components/TagInput';

export function EditNotePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { notes, updateNote, addNote } = useNotesStore();
  const { user, setShowAuthModal } = useAuthStore();
  const note = id ? notes.find(n => n.id === id) : null;
  
  const [content, setContent] = useState(note?.content || '# Untitled\n\n');
  const [tags, setTags] = useState<string[]>(note?.tags || []);
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState(note?.title || 'New Note');
  const [showPreview, setShowPreview] = useState(location.state?.showPreview || false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!id && editorRef.current) {
      editorRef.current.focus();
    }
  }, [id]);

  useEffect(() => {
    const firstLine = content.split('\n')[0];
    const extractedTitle = firstLine.replace(/^#*\s*/, '').substring(0, 50);
    setTitle(extractedTitle || 'Untitled');
  }, [content]);

  const handleSave = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setIsSaving(true);
    try {
      const noteData = {
        title,
        content,
        tags,
        userId: user.uid,
        isPinned: note?.isPinned || false
      };

      if (id) {
        await updateNote(id, noteData);
        navigate(`/view/${id}`);
      } else {
        const newNote = await addNote(noteData);
        navigate(`/view/${newNote.id}`);
      }
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="icon-btn"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-lg font-semibold">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
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
              onClick={() => setShowPreview(!showPreview)}
              className="icon-btn"
              title={showPreview ? 'Hide Preview' : 'Show Preview'}
            >
              {showPreview ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="btn btn-primary flex items-center gap-1.5 py-1.5"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        <div className="mb-4">
          <TagInput
            tags={tags}
            onChange={setTags}
          />
        </div>

        <div className={`grid gap-4 h-[calc(100vh-180px)] ${showPreview ? 'grid-cols-2' : 'grid-cols-1'}`}>
          <Editor
            ref={editorRef}
            value={content}
            onChange={setContent}
            noteId={id}
            fullWidth={!showPreview}
            searchQuery={searchQuery}
          />
          {showPreview && (
            <Preview 
              markdown={content} 
              searchQuery={searchQuery}
            />
          )}
        </div>
      </div>
    </div>
  );
}