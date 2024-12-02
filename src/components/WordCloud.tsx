import React from 'react';
import { TagCloud } from 'react-tagcloud';
import { useNavigate } from 'react-router-dom';
import { useNotesStore } from '../store/useNotesStore';

interface CloudTag {
  value: string;
  count: number;
}

export function WordCloud() {
  const { notes, setTagFilter } = useNotesStore();
  const navigate = useNavigate();

  // Extract all tags and count their occurrences
  const tagCounts = notes.reduce((acc: Record<string, number>, note) => {
    note.tags?.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {});

  // Convert to format required by react-tagcloud
  const cloudData: CloudTag[] = Object.entries(tagCounts).map(([tag, count]) => ({
    value: tag,
    count
  }));

  const customRenderer = (tag: CloudTag, size: number, color: string) => (
    <button
      key={tag.value}
      onClick={() => {
        setTagFilter(tag.value);
        navigate('/notes');
      }}
      className={`inline-block m-1 px-3 py-1 rounded-full 
        bg-${color}-100 dark:bg-${color}-900/30 
        text-${color}-700 dark:text-${color}-300
        hover:bg-${color}-200 dark:hover:bg-${color}-800/50
        transition-colors`}
      style={{ fontSize: size }}
    >
      #{tag.value}
    </button>
  );

  return (
    <div className="card p-6">
      <h2 className="text-lg font-semibold mb-4">Popular Tags</h2>
      <TagCloud
        minSize={12}
        maxSize={24}
        tags={cloudData}
        renderer={customRenderer}
        colorOptions={{
          luminosity: 'dark',
          hue: 'blue'
        }}
      />
    </div>
  );
}