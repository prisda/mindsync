import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Menu } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen gradient-bg flex">
      <div className={`sidebar ${!isSidebarOpen ? 'sidebar-collapsed' : ''}`}>
        <Sidebar />
      </div>

      <div className="main-content flex-1 overflow-hidden">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="md:hidden fixed top-4 left-4 z-40 icon-btn bg-white dark:bg-gray-800 shadow-md"
        >
          <Menu className="w-5 h-5" />
        </button>
        {children}
      </div>
    </div>
  );
}