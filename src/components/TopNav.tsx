import React from 'react';
import { HelpCircle } from 'lucide-react';

interface TopNavProps {
  outputFormat: string;
  setOutputFormat: (format: 'richtext' | 'plaintext') => void;
  onHelpClick: () => void;
}

export function TopNav({ outputFormat, setOutputFormat, onHelpClick }: TopNavProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
      <button
        onClick={() => setOutputFormat('richtext')}
        className={`px-3 py-2 rounded-lg transition-colors ${
          outputFormat === 'richtext'
            ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        Rich Text
      </button>
      <button
        onClick={() => setOutputFormat('plaintext')}
        className={`px-3 py-2 rounded-lg transition-colors ${
          outputFormat === 'plaintext'
            ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        Plain Text
      </button>
      <button
        onClick={onHelpClick}
        className="md:p-2 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center md:justify-start gap-2"
        title="Help"
      >
        <HelpCircle className="w-5 h-5" />
        <span className="md:hidden">Help</span>
      </button>
    </div>
  );
}