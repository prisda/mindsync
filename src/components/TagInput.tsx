import React, { useState, useRef, useEffect } from 'react';
import { X, Hash } from 'lucide-react';
import { getTagColors } from '../utils/tagColors';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export function TagInput({ tags, onChange }: TagInputProps) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      const newTag = input.trim().startsWith('#') ? input.trim() : `#${input.trim()}`;
      if (!tags.includes(newTag)) {
        onChange([...tags, newTag]);
      }
      setInput('');
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="flex flex-wrap gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 focus-within:ring-2 focus-within:ring-blue-500">
      {tags.map((tag, index) => {
        const tagColor = getTagColors(tag);
        return <span
          key={index}
          className={`inline-flex items-center px-2 py-1 rounded-full text-sm ${tagColor.bg} ${tagColor.text} ${tagColor.hover}`}
        >
          <Hash className="w-3 h-3 mr-1" />
          {tag.replace('#', '')}
          <button
            onClick={() => removeTag(tag)}
            className="ml-1 hover:text-blue-800 dark:hover:text-blue-200"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      })}
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add tags..."
        className="flex-1 min-w-[120px] bg-transparent outline-none text-sm text-gray-700 dark:text-gray-300 placeholder-gray-500"
      />
    </div>
  );
}