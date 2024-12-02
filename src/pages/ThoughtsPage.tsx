import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotesStore } from '../store/useNotesStore';
import ReactECharts from 'echarts-for-react';
import { removeStopwords } from 'stopword';
import { subDays } from 'date-fns';
import { useThemeStore } from '../store/useThemeStore';
import { Slider } from '../components/Slider';
import { tagColors } from '../utils/tagColors';

interface Node {
  id: string;
  name: string;
  value: number;
  category?: number;
  url?: string;
  itemStyle?: {
    color: string;
  };
  symbolSize?: number;
}

interface Link {
  source: string;
  target: string;
  value: number;
  lineStyle?: {
    color?: string;
    width?: number;
  };
}

export function ThoughtsPage() {
  const { notes, searchNotes } = useNotesStore();
  const { getThemeColors } = useThemeStore();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState(7);
  const [data, setData] = useState<{ nodes: Node[]; links: Link[] }>({ nodes: [], links: [] });

  // Memoize theme colors to prevent unnecessary re-renders
  const themeColors = useMemo(() => getThemeColors(), [getThemeColors]);

  const timeRangeOptions = [
    { value: 7, label: '7 days' },
    { value: 30, label: '30 days' },
    { value: 60, label: '60 days' },
    { value: 90, label: '90 days' }
  ];

  // Memoize filtered notes based on time range
  const filteredNotes = useMemo(() => {
    const cutoffDate = subDays(new Date(), timeRange);
    return notes.filter(note => new Date(note.updatedAt) > cutoffDate);
  }, [notes, timeRange]);

  // Process notes and update graph data
  useEffect(() => {
    // Extract keywords from each document
    const documentKeywords = filteredNotes.map(note => {
      const words = note.content
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 3);

      const keywords = removeStopwords(words);
      const wordFreq = keywords.reduce((acc: Record<string, number>, word) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
      }, {});

      const topKeywords = Object.entries(wordFreq)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([word]) => word);

      return {
        id: note.id,
        title: note.title || 'Untitled',
        keywords: topKeywords
      };
    });

    // Create nodes and links
    const nodes: Node[] = [];
    const links: Link[] = [];
    const usedNodeNames = new Set<string>();

    documentKeywords.forEach((doc, index) => {
      const nodeId = `doc-${doc.id}`;
      if (!usedNodeNames.has(doc.title)) {
        nodes.push({
          id: nodeId,
          name: doc.title,
          value: 1,
          symbolSize: 60,
          category: 0,
          url: `/view/${doc.id}`,
          itemStyle: {
            color: tagColors[index % tagColors.length].color || '#2563eb'
          }
        });
        usedNodeNames.add(doc.title);

        doc.keywords.forEach((keyword, keywordIndex) => {
          if (!usedNodeNames.has(keyword)) {
            const keywordNodeId = `keyword-${doc.id}-${keywordIndex}`;
            nodes.push({
              id: keywordNodeId,
              name: keyword,
              value: 1,
              symbolSize: 40,
              category: 1,
              itemStyle: {
                color: tagColors[(keywordIndex + 4) % tagColors.length].color || '#4ade80'
              }
            });
            usedNodeNames.add(keyword);

            links.push({
              source: nodeId,
              target: keywordNodeId,
              value: 1,
              lineStyle: {
                color: tagColors[index % tagColors.length].color || '#2563eb',
                width: 3,
                opacity: 0.6,
                curveness: 0.3
              }
            });
          }
        });
      }
    });

    setData({ nodes, links });
  }, [filteredNotes, themeColors]);

  // Memoize chart options to prevent unnecessary re-renders
  const option = useMemo(() => ({
    tooltip: {
      trigger: 'item', 
      formatter: (params: any) => {
        const data = params.data;
        return `<div class="font-sans p-2">
          <div class="font-medium">${data.name}</div>
          <div class="text-sm opacity-75">${data.category === 0 ? 'Note' : 'Keyword'}</div>
        </div>`;
      }
    },
    animation: true,
    legend: {
      data: ['Notes', 'Keywords'],
      orient: 'horizontal',
      left: 'center',
      top: 10,
      textStyle: {
        color: '#666'
      }
    },
    series: [{
      type: 'graph',
      layout: 'force',
      data: data.nodes,
      edges: data.links,
      roam: 'scale',
      draggable: true,
      force: {
        repulsion: 200,
        gravity: 0.1,
        edgeLength: 150,
        layoutAnimation: true
      },
      emphasis: {
        focus: 'adjacency',
        lineStyle: {
          width: 6
        }
      },
      lineStyle: {
        curveness: 0.3,
        opacity: 0.6,
        width: 2,
        color: 'source'
      },
      edgeSymbol: ['none', 'arrow'],
      edgeSymbolSize: [4, 10],
      label: {
        show: true,
        position: 'right',
        formatter: '{b}',
        fontSize: 14,
        color: '#666',
        fontWeight: 500
      },
      categories: [
        { 
          name: 'Notes',
          itemStyle: {
            color: tagColors[0].color
          }
        },
        { 
          name: 'Keywords',
          itemStyle: {
            color: tagColors[4].color
          }
        }
      ]
    }]
  }), [data]);

  const handleChartEvents = {
    'click': (params: any) => {
      if (params.data.url) {
        navigate(params.data.url);
      } else if (params.data.category === 1) {
        searchNotes(params.data.name);
        navigate('/notes');
      }
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">Thought Connections</h1>
          <div className="card p-4">
            <Slider
              value={timeRange}
              onChange={setTimeRange}
              options={timeRangeOptions}
            />
          </div>
        </div>

        <div className="card p-6" style={{ height: 'calc(100vh - 250px)' }}>
          <ReactECharts
            option={option}
            style={{ height: '100%', width: '100%' }}
            onEvents={handleChartEvents}
            opts={{ renderer: 'canvas' }}
            notMerge={true}
            lazyUpdate={true}
          />
        </div>
      </div>
    </div>
  );
}