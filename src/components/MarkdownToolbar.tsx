import React from 'react';
import { Bold, Italic, List, ListOrdered, Link, Image, Code, Quote, Heading1, Heading2, Heading3 } from 'lucide-react';

interface ToolbarProps {
  onFormat: (format: string, defaultText?: string) => void;
}

export function MarkdownToolbar({ onFormat }: ToolbarProps) {
  const tools = [
    { icon: <Heading1 className="w-4 h-4" />, format: '# ', tooltip: 'Heading 1' },
    { icon: <Heading2 className="w-4 h-4" />, format: '## ', tooltip: 'Heading 2' },
    { icon: <Heading3 className="w-4 h-4" />, format: '### ', tooltip: 'Heading 3' },
    { icon: <Bold className="w-4 h-4" />, format: '**text**', tooltip: 'Bold' },
    { icon: <Italic className="w-4 h-4" />, format: '*text*', tooltip: 'Italic' },
    { icon: <List className="w-4 h-4" />, format: '- ', tooltip: 'Bullet List' },
    { icon: <ListOrdered className="w-4 h-4" />, format: '1. ', tooltip: 'Numbered List' },
    { icon: <Link className="w-4 h-4" />, format: '[text](url)', tooltip: 'Link' },
    { icon: <Image className="w-4 h-4" />, format: '![alt](url)', tooltip: 'Image' },
    { icon: <Code className="w-4 h-4" />, format: '`code`', tooltip: 'Inline Code' },
    { icon: <Quote className="w-4 h-4" />, format: '> ', tooltip: 'Quote' },
  ];

  return (
    <div className="flex flex-wrap gap-1 p-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      {tools.map((tool, index) => (
        <button
          key={index}
          onClick={() => onFormat(tool.format)}
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          title={tool.tooltip}
        >
          {tool.icon}
        </button>
      ))}
    </div>
  );
}