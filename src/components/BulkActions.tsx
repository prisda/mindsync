import React from 'react';
import { Trash2, FolderInput, Tags, X } from 'lucide-react';
import { useNotesStore } from '../store/useNotesStore';

export function BulkActions() {
  const { selectedNotes, clearSelection, bulkMove, bulkTag, bulkDelete, categories, tags } = useNotesStore();
  const [showMoveMenu, setShowMoveMenu] = React.useState(false);
  const [showTagMenu, setShowTagMenu] = React.useState(false);

  if (selectedNotes.size === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 flex items-center space-x-2">
      <span className="text-sm text-gray-600 dark:text-gray-400 px-2">
        {selectedNotes.size} selected
      </span>

      <button
        onClick={() => setShowMoveMenu(true)}
        className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
      >
        <FolderInput className="w-5 h-5" />
      </button>

      <button
        onClick={() => setShowTagMenu(true)}
        className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
      >
        <Tags className="w-5 h-5" />
      </button>

      <button
        onClick={() => {
          if (confirm('Delete selected notes?')) {
            bulkDelete();
          }
        }}
        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-lg"
      >
        <Trash2 className="w-5 h-5" />
      </button>

      <button
        onClick={clearSelection}
        className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
      >
        <X className="w-5 h-5" />
      </button>

      {showMoveMenu && (
        <div className="absolute bottom-full left-0 mb-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => {
                bulkMove(category.id);
                setShowMoveMenu(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              {category.name}
            </button>
          ))}
        </div>
      )}

      {showTagMenu && (
        <div className="absolute bottom-full left-0 mb-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2">
          {tags.map(tag => (
            <button
              key={tag.id}
              onClick={() => {
                bulkTag([tag.id]);
                setShowTagMenu(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <span
                className="inline-block w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: tag.color }}
              />
              {tag.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}