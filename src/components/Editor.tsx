import React, { forwardRef, useEffect } from 'react';
import { MarkdownToolbar } from './MarkdownToolbar';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  noteId: string | null;
  fullWidth?: boolean;
  searchQuery?: string;
}

export const Editor = forwardRef<HTMLTextAreaElement, EditorProps>(
  ({ value, onChange, noteId, fullWidth = false, searchQuery }, ref) => {
    const handleFormat = (format: string) => {
      const textarea = ref as React.RefObject<HTMLTextAreaElement>;
      if (!textarea.current) return;

      const start = textarea.current.selectionStart;
      const end = textarea.current.selectionEnd;
      const selectedText = value.substring(start, end);
      
      let newText = '';
      if (format.includes('text')) {
        const formattedText = format.replace('text', selectedText || 'text');
        newText = value.substring(0, start) + formattedText + value.substring(end);
      } else {
        const lines = selectedText.split('\n');
        const formattedLines = lines.map(line => format + line);
        newText = value.substring(0, start) + formattedLines.join('\n') + value.substring(end);
      }

      onChange(newText);
      
      setTimeout(() => {
        if (textarea.current) {
          textarea.current.focus();
          const newCursorPos = start + format.length;
          textarea.current.setSelectionRange(newCursorPos, newCursorPos);
        }
      }, 0);
    };

    const highlightSearchText = () => {
      if (!searchQuery || !ref || !(ref as React.RefObject<HTMLTextAreaElement>).current) return;
      const regex = new RegExp(searchQuery, 'gi');
      const matches = [...value.matchAll(regex)];
      if (matches.length > 0) {
        const firstMatch = matches[0].index || 0;
        (ref as React.RefObject<HTMLTextAreaElement>).current!.scrollTop = firstMatch * 16;
      }
    };

    useEffect(() => {
      highlightSearchText();
    }, [searchQuery, value]);

    return (
      <div className={`h-full card ${fullWidth ? 'w-full' : ''}`}>
        <MarkdownToolbar onFormat={handleFormat} />
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-[calc(100%-48px)] resize-none p-6 bg-transparent focus:outline-none font-mono text-gray-800 dark:text-gray-200"
          placeholder="Start writing..."
        />
      </div>
    );
  }
);

Editor.displayName = 'Editor';