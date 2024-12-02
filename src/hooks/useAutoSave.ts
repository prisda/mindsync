import { useEffect, useRef } from 'react';
import { useNotesStore } from '../store/useNotesStore';

export function useAutoSave(noteId: string | null, content: string) {
  const { updateNote } = useNotesStore();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastSavedContent = useRef(content);

  useEffect(() => {
    if (!noteId || content === lastSavedContent.current) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        await updateNote(noteId, { content });
        lastSavedContent.current = content;
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, 2000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [noteId, content, updateNote]);

  const hasUnsavedChanges = content !== lastSavedContent.current;
  
  return { hasUnsavedChanges };
}