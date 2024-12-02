import React from 'react';
import { X } from 'lucide-react';
import helpContent from '../data/helpContent.json';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh]">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">Help & Documentation</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-4rem)]">
          <div className="prose dark:prose-invert max-w-none">
            {helpContent.sections.map((section, index) => (
              <div key={index} className="mb-8">
                <h3 className="text-lg font-semibold mb-3">{section.title}</h3>
                <p className="mb-4">{section.description}</p>
                {section.examples && (
                  <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <h4 className="text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Examples:</h4>
                    <pre className="text-sm text-gray-800 dark:text-gray-200">{section.examples}</pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}