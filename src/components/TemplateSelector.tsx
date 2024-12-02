import React from 'react';
import { noteTemplates } from '../data/templates';
import { FileText } from 'lucide-react';

interface TemplateSelectorProps {
  onSelect: (template: string) => void;
}

export function TemplateSelector({ onSelect }: TemplateSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.entries(noteTemplates).map(([key, template]) => (
        <button
          key={key}
          onClick={() => onSelect(template)}
          className="flex items-start p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors text-left"
        >
          <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1 mr-3" />
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white capitalize">
              {key} Template
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {template.split('\n')[0].replace('#', '').trim()}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}