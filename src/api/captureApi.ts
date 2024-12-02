import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface CapturePayload {
  imageUrl: string;
  sourceUrl: string;
  title: string;
  userId: string;
  categoryId?: string;
  tags?: string[];
}

export async function createCaptureNote(payload: CapturePayload) {
  try {
    const note = {
      title: payload.title || 'Screen Capture',
      content: `# ${payload.title || 'Screen Capture'}\n\n![Screen Capture](${payload.imageUrl})\n\nCaptured from: [${payload.sourceUrl}](${payload.sourceUrl})`,
      userId: payload.userId,
      categoryId: payload.categoryId || 'uncategorized',
      tags: [...(payload.tags || []), '#screen-capture'],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isPinned: false,
      type: 'capture'
    };

    const docRef = await addDoc(collection(db, 'notes'), note);
    return { id: docRef.id, ...note };
  } catch (error) {
    console.error('Error creating capture note:', error);
    throw error;
  }
}