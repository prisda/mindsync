import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Key, Save } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, updatePassword, error, clearError } = useAuthStore();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState('');

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match');
      return;
    }

    setIsUpdating(true);
    clearError();
    try {
      await updatePassword(currentPassword, newPassword);
      setMessage('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setMessage('Failed to update password');
    } finally {
      setIsUpdating(false);
    }
  };

  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 p-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate(-1)}
              className="icon-btn"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-xl font-semibold">Profile Settings</h1>
          </div>

          {/* Profile Info */}
          <div className="card p-6 mb-6">
            <div className="flex items-center gap-4">
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName || 'Profile'} 
                  className="w-16 h-16 rounded-full"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                  <User className="w-8 h-8 text-rose-600 dark:text-rose-400" />
                </div>
              )}
              <div>
                <h2 className="font-medium text-lg">
                  {user.displayName || 'User'}
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </div>
              </div>
            </div>
          </div>

          {/* Password Change */}
          <div className="card p-6">
            <h3 className="font-medium mb-4 flex items-center gap-2">
              <Key className="w-4 h-4" />
              Change Password
            </h3>

            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input w-full"
                  required
                />
              </div>

              {(message || error) && (
                <p className={`text-sm ${error ? 'text-red-600' : 'text-green-600'}`}>
                  {message || error}
                </p>
              )}

              <button
                type="submit"
                disabled={isUpdating}
                className="btn btn-primary flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isUpdating ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}