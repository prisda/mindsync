import React from 'react';
import { ChevronDown, ChevronRight, Folder } from 'lucide-react';
import { useNotesStore } from '../store/useNotesStore';

interface CategoryTreeProps {
  categoryId: string | null;
  level?: number;
  onSelect: (categoryId: string) => void;
}

export function CategoryTree({ categoryId, level = 0, onSelect }: CategoryTreeProps) {
  const { categories } = useNotesStore();
  const [isExpanded, setIsExpanded] = React.useState(true);

  const childCategories = categories.filter(c => c.parentId === categoryId);
  if (childCategories.length === 0) return null;

  return (
    <div style={{ marginLeft: level * 16 }}>
      {childCategories.map(category => (
        <div key={category.id}>
          <button
            onClick={() => {
              setIsExpanded(!isExpanded);
              onSelect(category.id);
            }}
            className="flex items-center w-full px-2 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
          >
            {childCategories.length > 0 ? (
              isExpanded ? (
                <ChevronDown className="w-4 h-4 mr-2" />
              ) : (
                <ChevronRight className="w-4 h-4 mr-2" />
              )
            ) : (
              <div className="w-4 h-4 mr-2" />
            )}
            <Folder className="w-4 h-4 mr-2" />
            {category.name}
          </button>
          {isExpanded && (
            <CategoryTree
              categoryId={category.id}
              level={level + 1}
              onSelect={onSelect}
            />
          )}
        </div>
      ))}
    </div>
  );
}