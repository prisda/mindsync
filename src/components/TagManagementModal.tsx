import React, { useState, useEffect } from 'react';
import { X, Hash } from 'lucide-react';
import { useNotesStore } from '../store/useNotesStore';
import { getTagColors } from '../utils/tagColors';

interface TagManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedNoteIds: string[];
  onApply: (tags: string[]) => void;
}

export function TagManagementModal({ isOpen, onClose, selectedNoteIds, onApply }: TagManagementModalProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const { notes } = useNotesStore();
  const [recentTags, setRecentTags] = useState<Array<{ tag: string; count: number }>>([]);

  useEffect(() => {
    // Get tag frequencies across all notes
    const tagCounts = notes.reduce((acc: Record<string, number>, note) => {
      note.tags?.forEach(tag => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {});

    // Sort by frequency and take top 15
    const sortedTags = Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 15)
      .map(([tag, count]) => ({ tag, count }));

    setRecentTags(sortedTags);
  }, [notes]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      const newTag = input.trim().startsWith('#') ? input.trim() : `#${input.trim()}`;
      if (!selectedTags.includes(newTag)) {
        setSelectedTags([...selectedTags, newTag]);
      }
      setInput('');
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply(selectedTags);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold">Manage Tags</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Add Tags
              </label>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type and press Enter..."
                className="input w-full"
                autoFocus
              />
            </div>

            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag, index) => {
                  const colors = getTagColors(tag);
                  return (
                    <span
                      key={index}
                      className={`inline-flex items-center px-2 py-1 rounded-full text-sm ${colors.bg} ${colors.text}`}
                    >
                      <Hash className="w-3 h-3 mr-1" />
                      {tag.replace('#', '')}
                      <button
                        onClick={() => toggleTag(tag)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">
                Recently Used Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {recentTags.map(({ tag, count }) => {
                  const colors = getTagColors(tag);
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`inline-flex items-center px-2 py-1 rounded-full text-sm ${
                        isSelected ? colors.bg : 'bg-gray-100 dark:bg-gray-700'
                      } ${isSelected ? colors.text : 'text-gray-700 dark:text-gray-300'}`}
                    >
                      <Hash className="w-3 h-3 mr-1" />
                      {tag.replace('#', '')}
                      <span className="ml-1 text-xs opacity-60">
                        ({count})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              Apply Tags
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}