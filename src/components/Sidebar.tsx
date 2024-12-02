import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Clock, Hash, Star, PenSquare, ChevronRight, 
  Folder, LayoutDashboard, Cloud, Brain,
  FileText, Sparkles, Network, Bookmark
} from 'lucide-react';
import { useNotesStore } from '../store/useNotesStore';
import { PencilLogo } from './PencilLogo';
import { useThemeStore } from '../store/useThemeStore';

export function Sidebar() {
  const { notes, setTagFilter, tagFilter, searchNotes } = useNotesStore();
  const { theme } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Get recent notes
  const recentNotes = notes
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 4);
  // Get starred notes
  const starredNotes = notes
    .filter(note => note.isPinned)
    .slice(0, 4);

  const categories = [
    { id: 'nav-dashboard', name: 'Dashboard', icon: LayoutDashboard, color: 'text-blue-500', path: 'dashboard' },
    { id: 'nav-all', name: 'All Notes', icon: FileText, color: 'text-emerald-500', path: 'notes' },
    { id: 'nav-wordcloud', name: 'Word Cloud', icon: Cloud, color: 'text-purple-500', path: 'wordcloud' },
    { id: 'nav-thoughts', name: 'Thoughts', icon: Network, color: 'text-amber-500', path: 'thoughts' },
    { id: 'nav-tags', name: 'Tags', icon: Hash, color: 'text-pink-500', path: 'tags' },
    { id: 'nav-starred', name: 'Starred', icon: Star, color: 'text-yellow-500', path: 'starred' },
  ];

  const handleLogoClick = () => {
    setTagFilter(null);
    searchNotes('');
    navigate('/notes');
  };

  const handleCategoryClick = (id: string) => {
    switch (id) {
      case 'nav-dashboard':
        navigate('/dashboard');
        break;
      case 'nav-all':
        setTagFilter(null);
        searchNotes('');
        navigate('/notes');
        break;
      case 'nav-wordcloud':
        navigate('/wordcloud');
        break;
      case 'nav-thoughts':
        navigate('/thoughts');
        break;
      case 'nav-tags':
        navigate('/tags');
        break;
      case 'nav-starred':
        navigate('/starred');
        break;
    }
  };

  return (
    <div className="w-64 h-screen bg-white dark:bg-gray-800 shadow-lg flex flex-col fixed left-0">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={handleLogoClick}
          className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity"
        >
          <PencilLogo size="md" className={`text-[rgb(var(--color-primary))]`} />
          <h1 className="text-xl font-bold">Notes</h1>
        </button>
        <button
          onClick={() => navigate('/edit')}
          className="w-full btn btn-primary flex items-center justify-center gap-2"
        >
          <PenSquare className="w-4 h-4" />
          New Note
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <nav className="space-y-6">
          {/* Main Categories */}
          <div className="space-y-1">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = location.pathname === `/${category.path}`;
              return (
                <div key={category.id}>
                  <button
                    onClick={() => handleCategoryClick(category.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-[rgb(var(--color-primary))/10 text-[rgb(var(--color-primary))]'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${category.color}`} />
                    <span className="text-sm font-medium">{category.name}</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Recent Notes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Recent</span>
              <button
                onClick={() => navigate('/notes')}
                className="text-xs text-[rgb(var(--color-primary))] hover:underline"
              >
                View All
              </button>
            </div>
            <div className="space-y-1">
              {recentNotes.map(note => (
                <button
                  key={`recent-${note.id}`}
                  onClick={() => navigate(`/view/${note.id}`)}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {note.title || 'Untitled'}
                </button>
              ))}
            </div>
          </div>

          {/* Starred Notes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Starred</span>
              <button
                onClick={() => navigate('/starred')}
                className="text-xs text-[rgb(var(--color-primary))] hover:underline"
              >
                View All
              </button>
            </div>
            <div className="space-y-1">
              {starredNotes.map(note => (
                <button
                  key={`starred-${note.id}`}
                  onClick={() => navigate(`/view/${note.id}`)}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {note.title || 'Untitled'}
                </button>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}