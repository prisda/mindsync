import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotesStore } from '../store/useNotesStore';
import { Hash, ChevronRight } from 'lucide-react';
import { getTagColors } from '../utils/tagColors';

export function TagsPage() {
  const { notes, setTagFilter } = useNotesStore();
  const navigate = useNavigate();

  // Get all unique tags and their counts
  const tagCounts = notes.reduce((acc, note) => {
    note.tags?.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const sortedTags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([tag, count]) => ({ tag, count }));

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Hash className="w-6 h-6" />
            All Tags
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {sortedTags.length} tags total
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedTags.map(({ tag, count }) => {
            const colors = getTagColors(tag);
            return (
              <button
                key={tag}
                onClick={() => {
                  setTagFilter(tag);
                  navigate('/notes');
                }}
                className={`p-4 ${colors.bg} rounded-lg shadow hover:shadow-md transition-shadow flex items-center justify-between group`}
              >
                <div className="flex items-center gap-2">
                  <Hash className={`w-5 h-5 ${colors.text}`} />
                  <span className={`text-lg font-medium ${colors.text}`}>
                    {tag}
                  </span>
                  <span className={`text-sm ${colors.text} opacity-75`}>
                    {count} {count === 1 ? 'note' : 'notes'}
                  </span>
                </div>
                <ChevronRight className={`w-5 h-5 ${colors.text} opacity-0 group-hover:opacity-100 transition-opacity`} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}