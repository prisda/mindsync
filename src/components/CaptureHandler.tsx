import React, { useEffect } from 'react';
import { useNotesStore } from '../store/useNotesStore';
import { useAuthStore } from '../store/useAuthStore';

export function CaptureHandler() {
  const { user } = useAuthStore();
  const { addNote } = useNotesStore();

  useEffect(() => {
    const handleCaptureMessage = async (event: MessageEvent) => {
      if (!user) return;

      try {
        // Validate the message origin and structure
        const { type, payload } = event.data;
        
        if (type !== 'SCREEN_CAPTURE' || !payload) return;

        const note = {
          title: payload.title || 'Screen Capture',
          content: `# ${payload.title || 'Screen Capture'}\n\n![Screen Capture](${payload.imageUrl})\n\nCaptured from: [${payload.sourceUrl}](${payload.sourceUrl})`,
          userId: user.uid,
          categoryId: payload.categoryId || 'uncategorized',
          tags: [...(payload.tags || []), '#screen-capture'],
          isPinned: false
        };

        await addNote(note);
      } catch (error) {
        console.error('Error handling capture:', error);
      }
    };

    if (user) {
      window.addEventListener('message', handleCaptureMessage);
      return () => window.removeEventListener('message', handleCaptureMessage);
    }
  }, [user, addNote]);

  return null;
}