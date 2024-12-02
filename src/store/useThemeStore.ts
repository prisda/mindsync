import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { themes } from '../data/themes';

interface ThemeState {
  theme: string;
  setTheme: (theme: string) => void;
  getThemeColors: () => { primary: string; secondary: string };
}

const updateCSSVariables = (theme: string) => {
  const colors = themes.find(t => t.id === theme);
  if (colors) {
    const primaryRGB = hexToRGB(colors.primary);
    const secondaryRGB = hexToRGB(colors.secondary);
    if (primaryRGB && secondaryRGB) {
      document.documentElement.style.setProperty('--color-primary', primaryRGB);
      document.documentElement.style.setProperty('--color-secondary', secondaryRGB);
    }
  }
};

const hexToRGB = (hex: string): string | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? 
    `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}` : 
    null;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'rose',
      setTheme: (theme) => {
        set({ theme });
        updateCSSVariables(theme);
      },
      getThemeColors: () => {
        const theme = themes.find(t => t.id === get().theme);
        return {
          primary: theme?.primary || themes[0].primary,
          secondary: theme?.secondary || themes[0].secondary
        };
      }
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          updateCSSVariables(state.theme);
        }
      }
    }
  )
);