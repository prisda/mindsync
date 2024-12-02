import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotesStore } from '../store/useNotesStore';
import { DocumentGrid } from '../components/DocumentGrid';
import { Clock, Star, Hash, FileText } from 'lucide-react';

export function DashboardPage() {
  const { notes } = useNotesStore();
  const navigate = useNavigate();

  const stats = {
    total: notes.length,
    starred: notes.filter(note => note.isPinned).length,
    tags: [...new Set(notes.flatMap(note => note.tags || []))].length,
    recent: notes.filter(note => {
      const updatedAt = new Date(note.updatedAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return updatedAt > weekAgo;
    }).length,
  };

  const recentNotes = notes
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6);

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Notes</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Starred</p>
                <p className="text-2xl font-bold">{stats.starred}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Tags</p>
                <p className="text-2xl font-bold">{stats.tags}</p>
              </div>
              <Hash className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Recent (7d)</p>
                <p className="text-2xl font-bold">{stats.recent}</p>
              </div>
              <Clock className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Notes</h2>
            <button
              onClick={() => navigate('/notes')}
              className="text-sm text-rose-600 dark:text-rose-400 hover:underline"
            >
              View All
            </button>
          </div>
          <DocumentGrid
            notes={recentNotes}
            onNoteSelect={(id) => navigate(`/view/${id}`)}
            onToggleStar={async (noteId) => {
              const note = notes.find(n => n.id === noteId);
              if (note) {
                await useNotesStore.getState().updateNote(noteId, { isPinned: !note.isPinned });
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}