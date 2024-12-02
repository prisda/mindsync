import React from 'react';
import { themes } from '../data/themes';
import { useThemeStore } from '../store/useThemeStore';

export function ThemeSelector() {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="grid grid-cols-5 gap-2">
      {themes.map((t) => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id)}
          className={`w-full aspect-square rounded-lg transition-all ${
            theme === t.id ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900' : ''
          }`}
          style={{ 
            background: `linear-gradient(135deg, ${t.primary}, ${t.secondary})`,
            boxShadow: theme === t.id ? `0 0 12px ${t.primary}40` : undefined
          }}
          title={t.name}
        />
      ))}
    </div>
  );
}