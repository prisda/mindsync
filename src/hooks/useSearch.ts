import { useState, useCallback } from 'react';
import Fuse from 'fuse.js';
import stringSimilarity from 'string-similarity';
import { useNotesStore } from '../store/useNotesStore';
import { marked } from 'marked';

interface SearchResult {
  id: string;
  title: string;
  content: string;
  matches: {
    indices: [number, number][];
    value: string;
    key: string;
  }[];
  score: number;
}

interface SimilarNote {
  id: string;
  title: string;
  similarity: number;
}

export function useSearch() {
  const { notes } = useNotesStore();
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [similarNotes, setSimilarNotes] = useState<SimilarNote[]>([]);

  // Initialize Fuse.js for fuzzy searching
  const fuse = new Fuse(notes, {
    keys: ['title', 'content'],
    includeMatches: true,
    threshold: 0.3,
    minMatchCharLength: 3,
  });

  const search = useCallback((query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const results = fuse.search(query);
    setSearchResults(results.map(result => ({
      id: result.item.id,
      title: result.item.title,
      content: result.item.content,
      matches: result.matches || [],
      score: result.score || 1,
    })));
  }, [notes]);

  const findSimilarNotes = useCallback((noteId: string) => {
    const currentNote = notes.find(note => note.id === noteId);
    if (!currentNote) return;

    // Convert markdown to plain text for better comparison
    const plainText = marked.parse(currentNote.content).replace(/<[^>]*>/g, '');

    const similarities = notes
      .filter(note => note.id !== noteId)
      .map(note => ({
        id: note.id,
        title: note.title,
        similarity: stringSimilarity.compareTwoStrings(
          plainText,
          marked.parse(note.content).replace(/<[^>]*>/g, '')
        ),
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5);

    setSimilarNotes(similarities);
  }, [notes]);

  const highlightText = useCallback((text: string, matches: [number, number][]) => {
    let lastIndex = 0;
    const parts: { text: string; highlight: boolean }[] = [];

    matches.forEach(([start, end]) => {
      if (lastIndex < start) {
        parts.push({
          text: text.slice(lastIndex, start),
          highlight: false,
        });
      }
      parts.push({
        text: text.slice(start, end + 1),
        highlight: true,
      });
      lastIndex = end + 1;
    });

    if (lastIndex < text.length) {
      parts.push({
        text: text.slice(lastIndex),
        highlight: false,
      });
    }

    return parts;
  }, []);

  return {
    searchResults,
    similarNotes,
    search,
    findSimilarNotes,
    highlightText,
  };
}