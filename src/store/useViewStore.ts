import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ViewState {
  viewMode: 'card' | 'list';
  selectedNotes: Set<string>;
  isSelectionMode: boolean;
  setViewMode: (mode: 'card' | 'list') => void;
  toggleNoteSelection: (id: string) => void;
  clearSelection: () => void;
  setSelectionMode: (enabled: boolean) => void;
}

export const useViewStore = create<ViewState>()(
  persist(
    (set) => ({
      viewMode: 'card',
      selectedNotes: new Set(),
      isSelectionMode: false,
      setViewMode: (mode) => set({ viewMode: mode }),
      toggleNoteSelection: (id) => 
        set((state) => {
          const newSelection = new Set(state.selectedNotes);
          if (newSelection.has(id)) {
            newSelection.delete(id);
          } else {
            newSelection.add(id);
          }
          return { selectedNotes: newSelection };
        }),
      clearSelection: () => set({ selectedNotes: new Set() }),
      setSelectionMode: (enabled) => set((state) => ({ 
        isSelectionMode: enabled,
        selectedNotes: enabled ? state.selectedNotes : new Set()
      })),
    }),
    {
      name: 'view-storage',
      partialize: (state) => ({ 
        viewMode: state.viewMode,
        isSelectionMode: state.isSelectionMode
      })
    }
  )
);