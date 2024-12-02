import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { NotesPage } from './pages/NotesPage';
import { ViewNotePage } from './pages/ViewNotePage';
import { EditNotePage } from './pages/EditNotePage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { TagsPage } from './pages/TagsPage';
import { StarredPage } from './pages/StarredPage';
import { WordCloudPage } from './pages/WordCloudPage';
import { DashboardPage } from './pages/DashboardPage';
import { ThoughtsPage } from './pages/ThoughtsPage';
import { AuthModal } from './components/AuthModal';
import { ErrorDisplay } from './components/ErrorDisplay';
import { SystemModal } from './components/SystemModal';
import { useAuthStore } from './store/useAuthStore';
import { useNotesStore } from './store/useNotesStore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';

export default function App() {
  const { user, setUser } = useAuthStore();
  const { fetchNotes, subscribeToNotes } = useNotesStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        await fetchNotes();
        subscribeToNotes();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [setUser, fetchNotes, subscribeToNotes]);

  return (
    <Router>
      {user ? (
        <Layout>
          <Header />
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/notes" element={<NotesPage />} />
              <Route path="/view/:id" element={<ViewNotePage />} />
              <Route path="/edit/:id?" element={<EditNotePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/tags" element={<TagsPage />} />
              <Route path="/starred" element={<StarredPage />} />
              <Route path="/wordcloud" element={<WordCloudPage />} />
              <Route path="/thoughts" element={<ThoughtsPage />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
          <ErrorDisplay />
          <SystemModal />
        </Layout>
      ) : (
        <>
          <Routes>
            <Route path="*" element={<LandingPage />} />
          </Routes>
          <AuthModal />
        </>
      )}
    </Router>
  );
}