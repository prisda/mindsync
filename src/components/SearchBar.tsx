import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useSearch } from '../hooks/useSearch';

interface SearchBarProps {
  onNoteSelect: (noteId: string) => void;
}

export function SearchBar({ onNoteSelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { searchResults, search, highlightText } = useSearch();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    search(query);
  }, [query, search]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (noteId: string) => {
    onNoteSelect(noteId);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div ref={searchRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          placeholder="Search notes..."
          className="w-full px-10 py-2 bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-dark-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-500"
        />
        <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {isOpen && searchResults.length > 0 && (
        <div className="absolute z-50 w-full mt-2 card max-h-96 overflow-y-auto">
          {searchResults.map((result) => (
            <button
              key={result.id}
              onClick={() => handleSelect(result.id)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-dark-700 border-b last:border-b-0 border-gray-200 dark:border-dark-700"
            >
              <h4 className="font-medium mb-1">
                {result.title || 'Untitled'}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                {result.matches.map((match, index) => (
                  <span key={index}>
                    {highlightText(match.value, match.indices).map((part, i) => (
                      <span
                        key={i}
                        className={part.highlight ? 'bg-accent-100 dark:bg-accent-900/30' : ''}
                      >
                        {part.text}
                      </span>
                    ))}
                  </span>
                ))}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}