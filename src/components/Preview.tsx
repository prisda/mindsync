import React from 'react';
import DOMPurify from 'dompurify';
import { marked } from 'marked';

interface PreviewProps {
  markdown: string;
  searchQuery?: string;
}

export function Preview({ markdown, searchQuery }: PreviewProps) {
  const highlightSearchText = (html: string) => {
    if (!searchQuery) return html;
    const regex = new RegExp(`(${searchQuery})`, 'gi');
    return html.replace(regex, '<mark>$1</mark>');
  };

  const html = DOMPurify.sanitize(marked(markdown));
  const highlightedHtml = searchQuery ? highlightSearchText(html) : html;

  return (
    <div className="h-full card">
      <div className="p-4 border-b border-gray-200/10 dark:border-gray-700/10">
        <span className="font-medium">Preview</span>
      </div>
      <div 
        className="p-6 prose dark:prose-invert max-w-none overflow-auto h-[calc(100%-57px)]"
        dangerouslySetInnerHTML={{ __html: highlightedHtml }}
      />
    </div>
  );
}