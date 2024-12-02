import { create } from 'zustand';
import { auth } from '../lib/firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updatePassword as firebaseUpdatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  signOut as firebaseSignOut,
  User
} from 'firebase/auth';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  showAuthModal: boolean;
  pendingSave: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  setUser: (user: User | null) => void;
  setShowAuthModal: (show: boolean) => void;
  setPendingSave: (pending: boolean) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: true,
      error: null,
      showAuthModal: false,
      pendingSave: false,

      signIn: async (email: string, password: string) => {
        try {
          set({ loading: true, error: null });
          const result = await signInWithEmailAndPassword(auth, email, password);
          set({ user: result.user, loading: false, showAuthModal: false });
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
          throw error;
        }
      },

      signUp: async (email: string, password: string) => {
        try {
          set({ loading: true, error: null });
          const result = await createUserWithEmailAndPassword(auth, email, password);
          set({ user: result.user, loading: false, showAuthModal: false });
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
          throw error;
        }
      },

      signInWithGoogle: async () => {
        try {
          set({ loading: true, error: null });
          const provider = new GoogleAuthProvider();
          const result = await signInWithPopup(auth, provider);
          set({ user: result.user, loading: false, showAuthModal: false });
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
          throw error;
        }
      },

      signOut: async () => {
        try {
          await firebaseSignOut(auth);
          set({ user: null, showAuthModal: false });
        } catch (error) {
          set({ error: (error as Error).message });
          throw error;
        }
      },

      updatePassword: async (currentPassword: string, newPassword: string) => {
        try {
          const user = auth.currentUser;
          if (!user || !user.email) throw new Error('No user logged in');

          const credential = EmailAuthProvider.credential(user.email, currentPassword);
          await reauthenticateWithCredential(user, credential);
          await firebaseUpdatePassword(user, newPassword);
        } catch (error) {
          set({ error: (error as Error).message });
          throw error;
        }
      },

      setUser: (user) => set({ user, loading: false }),
      setShowAuthModal: (show) => set({ showAuthModal: show }),
      setPendingSave: (pending) => set({ pendingSave: pending }),
      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);