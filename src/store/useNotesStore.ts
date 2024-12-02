import { create } from 'zustand';
import { db, auth } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { Note } from '../types/note';

interface NotesState {
  notes: Note[];
  filteredNotes: Note[];
  loading: boolean;
  error: string | null;
  tagFilter: string | null;
  searchQuery: string;
  initialized: boolean;
  fetchNotes: () => Promise<void>;
  addNote: (note: Omit<Note, 'id'>) => Promise<Note>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  setTagFilter: (tag: string | null) => void;
  searchNotes: (query: string) => void;
  clearError: () => void;
  subscribeToNotes: () => () => void;
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  filteredNotes: [],
  loading: false,
  error: null,
  tagFilter: null,
  searchQuery: '',
  initialized: false,

  subscribeToNotes: () => {
    const user = auth.currentUser;
    if (!user) return () => {};

    const notesQuery = query(
      collection(db, 'notes'),
      where('userId', '==', user.uid),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(notesQuery, (snapshot) => {
      const notes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
      })) as Note[];

      set({ notes, initialized: true });
      // Apply existing filters
      const { searchQuery, tagFilter } = get();
      if (searchQuery || tagFilter) {
        get().searchNotes(searchQuery);
      }
    });

    return unsubscribe;
  },

  searchNotes: (query: string) => {
    const { notes, tagFilter } = get();
    set({ searchQuery: query });

    let filtered = [...notes];

    // Apply search query
    if (query) {
      const lowercaseQuery = query.toLowerCase();
      filtered = filtered.filter(note => 
        note.title.toLowerCase().includes(lowercaseQuery) ||
        note.content.toLowerCase().includes(lowercaseQuery) ||
        note.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
      );
    }

    // Apply tag filter
    if (tagFilter) {
      filtered = filtered.filter(note => 
        note.tags?.includes(tagFilter)
      );
    }

    set({ filteredNotes: filtered });
  },

  fetchNotes: async () => {
    try {
      set({ loading: true, error: null });
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const notesQuery = query(
        collection(db, 'notes'),
        where('userId', '==', user.uid),
        orderBy('updatedAt', 'desc')
      );

      const notesSnap = await getDocs(notesQuery);
      const notes = notesSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
      })) as Note[];

      set({ notes, filteredNotes: notes, loading: false, initialized: true });
    } catch (error) {
      console.error('Error fetching notes:', error);
      set({ error: (error as Error).message, loading: false });
    }
  },

  addNote: async (noteData) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Extract title from first line of content
      const firstLine = noteData.content.split('\n')[0];
      const title = firstLine.replace(/^#*\s*/, '').substring(0, 50);

      const note = {
        ...noteData,
        title,
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'notes'), note);
      const timestamp = new Date().toISOString();
      const newNote = { 
        ...note, 
        id: docRef.id,
        createdAt: timestamp,
        updatedAt: timestamp
      } as Note;
      
      set(state => ({
        notes: [newNote, ...state.notes]
      }));
      // Reapply search if active
      const { searchQuery } = get();
      if (searchQuery) {
        get().searchNotes(searchQuery);
      }

      return newNote;
    } catch (error) {
      console.error('Error adding note:', error);
      set({ error: (error as Error).message });
      throw error;
    }
  },

  updateNote: async (id, updates) => {
    try {
      set({ error: null });
      const noteRef = doc(db, 'notes', id);
      const updateData = {
        ...updates,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(noteRef, updateData);
      const timestamp = new Date().toISOString();
      
      set(state => ({
        notes: state.notes.map(note => 
          note.id === id ? { 
            ...note, 
            ...updates,
            updatedAt: timestamp
          } : note
        )
      }));
      // Reapply search if active
      const { searchQuery } = get();
      if (searchQuery) {
        get().searchNotes(searchQuery);
      }
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  deleteNote: async (id) => {
    try {
      set({ error: null });
      await deleteDoc(doc(db, 'notes', id));
      set(state => ({
        notes: state.notes.filter(note => note.id !== id)
      }));
      // Reapply search if active
      const { searchQuery } = get();
      if (searchQuery) {
        get().searchNotes(searchQuery);
      }
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  setTagFilter: (tag) => {
    set({ tagFilter: tag });
    const { searchQuery } = get();
    get().searchNotes(searchQuery);
  },
  
  clearError: () => set({ error: null })
}));