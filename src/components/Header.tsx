import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogIn, User, LogOut, Search, X, Settings, Moon, Sun } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useNotesStore } from '../store/useNotesStore';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut, setShowAuthModal } = useAuthStore();
  const { searchNotes } = useNotesStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  const menuRef = useRef<HTMLDivElement>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length >= 3) {
      searchNotes(query);
      if (location.pathname !== '/notes') {
        navigate('/notes');
      }
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    searchNotes('');
  };

  const toggleTheme = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-b border-gray-200/10 dark:border-gray-700/10">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 max-w-xl">
            <div className="search-bar">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                placeholder="Search notes..."
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-10 py-2 bg-gray-100/50 dark:bg-gray-700/50 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[rgb(var(--color-primary))]"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="icon-btn"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            <div className="relative" ref={menuRef}>
              {user ? (
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName || user.email || 'Profile'} 
                      className="w-8 h-8 avatar"
                    />
                  ) : (
                    <div className="w-8 h-8 avatar-placeholder">
                      <span className="text-sm font-medium text-[rgb(var(--color-primary))]">
                        {user.displayName?.[0] || user.email?.[0] || 'U'}
                      </span>
                    </div>
                  )}
                  <span className="text-sm font-medium hidden sm:block">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="btn btn-primary flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </button>
              )}

              {showUserMenu && user && (
                <div className="absolute right-0 mt-2 w-48 card py-1">
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setShowUserMenu(false);
                    }}
                    className="menu-item w-full"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      navigate('/settings');
                      setShowUserMenu(false);
                    }}
                    className="menu-item w-full"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  <hr className="my-1 border-gray-200 dark:border-gray-700" />
                  <button
                    onClick={async () => {
                      await signOut();
                      setShowUserMenu(false);
                    }}
                    className="menu-item w-full text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}