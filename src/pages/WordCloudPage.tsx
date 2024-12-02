import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotesStore } from '../store/useNotesStore';
import { subMonths, format } from 'date-fns';
import { removeStopwords } from 'stopword';
import { useThemeStore } from '../store/useThemeStore';
import { Slider } from '../components/Slider';
import { scaleLinear, scaleOrdinal } from 'd3';
import cloud from 'd3-cloud';
import { tagColors } from '../utils/tagColors';

interface Word {
  value: string;
  count: number;
  size?: number;
  x?: number;
  y?: number;
  rotate?: number;
}

const colors = tagColors.map(t => t.color || '#000');
const colorScale = scaleOrdinal(colors);

export function WordCloudPage() {
  const { notes, searchNotes } = useNotesStore();
  const { getThemeColors } = useThemeStore();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState(30);
  const [layout, setLayout] = useState<Word[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const themeColors = getThemeColors();

  const words = useMemo(() => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - timeRange);
    
    const filteredNotes = notes.filter(note => 
      new Date(note.updatedAt) > cutoffDate
    );

    const allWords = filteredNotes
      .flatMap(note => {
        const text = note.content
          .toLowerCase()
          .replace(/[^\w\s]/g, '')
          .split(/\s+/)
          .filter(word => word.length > 3);
        return removeStopwords(text);
      });

    const wordFreq = allWords.reduce((acc: Record<string, number>, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(wordFreq)
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 50);
  }, [notes, timeRange]);

  const timeRangeOptions = [
    { value: 7, label: '7 days' },
    { value: 30, label: '30 days' },
    { value: 60, label: '60 days' },
    { value: 90, label: '90 days' }
  ];

  useEffect(() => {
    if (!containerRef.current || !words.length) return;

    const width = containerRef.current.offsetWidth;
    const height = containerRef.current.offsetHeight;

    // Scale word sizes
    const minCount = Math.min(...words.map(d => d.count));
    const maxCount = Math.max(...words.map(d => d.count));
    const sizeScale = scaleLinear()
      .domain([minCount, maxCount])
      .range([16, 64]);

    const layout = cloud()
      .size([width, height])
      .words(words.map(w => ({
        ...w,
        text: w.value,
        size: sizeScale(w.count)
      })))
      .padding(5)
      .rotate(() => (~~(Math.random() * 3) - 1) * 30)
      .fontSize(d => d.size!)
      .spiral('archimedean')
      .on('end', (words) => {
        setLayout(words.map(w => ({
          value: w.text!,
          count: w.count,
          size: w.size,
          x: w.x,
          y: w.y,
          rotate: w.rotate
        })));
      });

    layout.start();

    return () => {
      layout.stop();
    };
  }, [words]);

  const handleWordClick = (word: Word) => {
    searchNotes(word.value);
    navigate('/notes');
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Word Cloud</h1>
          <div className="card p-4 mt-4">
            <Slider
              value={timeRange}
              onChange={setTimeRange}
              options={timeRangeOptions}
            />
          </div>
        </div>

        <div className="card p-6 relative" style={{ height: '600px' }}>
          <div 
            ref={containerRef}
            className="w-full h-full relative"
            style={{ transform: 'translate(50%, 50%)' }}
          >
            {layout.map((word, index) => (
              <div
                key={`${word.value}-${index}`}
                className="absolute transform hover:scale-110 transition-transform cursor-pointer select-none"
                style={{
                  left: word.x,
                  top: word.y,
                  fontSize: word.size,
                  color: colorScale(index.toString()),
                  transform: `translate(-50%, -50%) rotate(${word.rotate}deg)`,
                  willChange: 'transform'
                }}
                onClick={() => handleWordClick(word)}
                title={`${word.value} (${word.count} occurrences)`}
              >
                {word.value}
              </div> 
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}