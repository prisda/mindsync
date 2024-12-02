import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Settings, Users, Database, Bot } from 'lucide-react';

export function AdminPanel() {
  const { user } = useAuthStore();
  const isAdmin = user?.email === 'admin@example.com'; // Replace with your admin check logic

  if (!isAdmin) return null;

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Admin Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* AI Configuration */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/50 rounded-lg">
          <div className="flex items-center mb-4">
            <Bot className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-2" />
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">AI Settings</h3>
          </div>
          <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Configure AI
          </button>
        </div>

        {/* User Management */}
        <div className="p-4 bg-green-50 dark:bg-green-900/50 rounded-lg">
          <div className="flex items-center mb-4">
            <Users className="w-6 h-6 text-green-600 dark:text-green-400 mr-2" />
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">Users</h3>
          </div>
          <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Manage Users
          </button>
        </div>

        {/* Backup & Restore */}
        <div className="p-4 bg-purple-50 dark:bg-purple-900/50 rounded-lg">
          <div className="flex items-center mb-4">
            <Database className="w-6 h-6 text-purple-600 dark:text-purple-400 mr-2" />
            <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100">Backup</h3>
          </div>
          <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            Backup Data
          </button>
        </div>

        {/* System Settings */}
        <div className="p-4 bg-orange-50 dark:bg-orange-900/50 rounded-lg">
          <div className="flex items-center mb-4">
            <Settings className="w-6 h-6 text-orange-600 dark:text-orange-400 mr-2" />
            <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100">Settings</h3>
          </div>
          <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
            System Config
          </button>
        </div>
      </div>
    </div>
  );
}