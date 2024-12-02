import React, { useState, useRef } from 'react';
import { User, Lock, Upload } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { storage } from '../lib/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';

export function ProfileSettings() {
  const { user } = useAuthStore();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    // Password change logic here
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      setUploading(true);
      const storageRef = ref(storage, `profile-pictures/${user.uid}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      await updateProfile(user, { photoURL: downloadURL });
      window.location.reload();
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="card p-6">
      <h2 className="text-lg font-semibold mb-6">Profile Settings</h2>

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            {user?.photoURL ? (
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
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 p-1.5 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700"
              disabled={uploading}
            >
              <Upload className="w-4 h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
          <div>
            <div className="font-medium">{user?.displayName || user?.email}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</div>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="input w-full"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="input w-full"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}