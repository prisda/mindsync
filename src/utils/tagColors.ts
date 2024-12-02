// Predefined colors for tags
export const tagColors = [
  { 
    bg: 'bg-red-100 dark:bg-red-900/30', 
    text: 'text-red-700 dark:text-red-300', 
    hover: 'hover:bg-red-200 dark:hover:bg-red-900/50',
    color: '#ef4444'
  },
  { 
    bg: 'bg-orange-100 dark:bg-orange-900/30', 
    text: 'text-orange-700 dark:text-orange-300', 
    hover: 'hover:bg-orange-200 dark:hover:bg-orange-900/50',
    color: '#f97316'
  },
  { 
    bg: 'bg-amber-100 dark:bg-amber-900/30', 
    text: 'text-amber-700 dark:text-amber-300', 
    hover: 'hover:bg-amber-200 dark:hover:bg-amber-900/50',
    color: '#f59e0b'
  },
  { 
    bg: 'bg-lime-100 dark:bg-lime-900/30', 
    text: 'text-lime-700 dark:text-lime-300', 
    hover: 'hover:bg-lime-200 dark:hover:bg-lime-900/50',
    color: '#84cc16'
  },
  { 
    bg: 'bg-emerald-100 dark:bg-emerald-900/30', 
    text: 'text-emerald-700 dark:text-emerald-300', 
    hover: 'hover:bg-emerald-200 dark:hover:bg-emerald-900/50',
    color: '#10b981'
  },
  { 
    bg: 'bg-cyan-100 dark:bg-cyan-900/30', 
    text: 'text-cyan-700 dark:text-cyan-300', 
    hover: 'hover:bg-cyan-200 dark:hover:bg-cyan-900/50',
    color: '#06b6d4'
  },
  { 
    bg: 'bg-violet-100 dark:bg-violet-900/30', 
    text: 'text-violet-700 dark:text-violet-300', 
    hover: 'hover:bg-violet-200 dark:hover:bg-violet-900/50',
    color: '#7c3aed'
  },
  { 
    bg: 'bg-fuchsia-100 dark:bg-fuchsia-900/30', 
    text: 'text-fuchsia-700 dark:text-fuchsia-300', 
    hover: 'hover:bg-fuchsia-200 dark:hover:bg-fuchsia-900/50',
    color: '#d946ef'
  }
];

export const getTagColors = (tag: string) => {
  // Use tag string to consistently select same color for each tag
  // Remove # prefix if present for consistent color assignment
  const cleanTag = tag.replace('#', '');
  
  // Create a more unique hash for the tag to avoid collisions
  const hash = cleanTag.split('').reduce((acc, char, i) => {
    return acc + char.charCodeAt(0) * (i + 1);
  }, 0);
  
  const index = hash % tagColors.length;
  return tagColors[index];
};