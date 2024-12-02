import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ThemeSelector } from '../components/ThemeSelector';
import { ProfileSettings } from '../components/ProfileSettings';

export function SettingsPage() {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="icon-btn"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>

        <div className="space-y-8">
          <ProfileSettings />
          
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4">Theme Colors</h2>
            <div className="max-w-md">
              <ThemeSelector />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}