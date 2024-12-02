import { create } from 'zustand';
import { db } from '../lib/firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  query,
  where
} from 'firebase/firestore';

interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: any;
  lastLogin: any;
}

interface AIConfig {
  id: string;
  model: string;
  apiKey: string;
  maxTokens: number;
  temperature: number;
}

interface AdminState {
  users: User[];
  aiConfig: AIConfig | null;
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  updateUser: (id: string, data: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  updateAIConfig: (config: Partial<AIConfig>) => Promise<void>;
  backupData: () => Promise<Blob>;
  restoreData: (backup: Blob) => Promise<void>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  users: [],
  aiConfig: null,
  loading: false,
  error: null,

  fetchUsers: async () => {
    try {
      set({ loading: true });
      const usersSnap = await getDocs(collection(db, 'users'));
      const users = usersSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];
      set({ users, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  updateUser: async (id: string, data: Partial<User>) => {
    try {
      set({ loading: true });
      await updateDoc(doc(db, 'users', id), data);
      set(state => ({
        users: state.users.map(user => 
          user.id === id ? { ...user, ...data } : user
        ),
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  deleteUser: async (id: string) => {
    try {
      set({ loading: true });
      await deleteDoc(doc(db, 'users', id));
      set(state => ({
        users: state.users.filter(user => user.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  updateAIConfig: async (config: Partial<AIConfig>) => {
    try {
      set({ loading: true });
      const configRef = doc(db, 'config', 'ai');
      await updateDoc(configRef, config);
      set({ aiConfig: { ...get().aiConfig, ...config } as AIConfig, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  backupData: async () => {
    try {
      set({ loading: true });
      const collections = ['notes', 'categories', 'users'];
      const backup: Record<string, any> = {};

      for (const collectionName of collections) {
        const snapshot = await getDocs(collection(db, collectionName));
        backup[collectionName] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      }

      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      set({ loading: false });
      return blob;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  restoreData: async (backup: Blob) => {
    try {
      set({ loading: true });
      const data = JSON.parse(await backup.text());
      
      // Implementation would need careful consideration of:
      // - Data validation
      // - Handling existing data
      // - Maintaining relationships
      // - Error recovery
      
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  }
}));