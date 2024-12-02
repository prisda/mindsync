import React, { useState } from 'react';
import { X, Github, Cloud, LogOut } from 'lucide-react';
import { useCloudStorage } from '../hooks/useCloudStorage';

interface CloudStorageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileSelect: (content: string) => void;
}

export function CloudStorageModal({ isOpen, onClose, onFileSelect }: CloudStorageModalProps) {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const { 
    connect, 
    disconnect, 
    isConnected, 
    listFiles, 
    getFileContent,
    currentUser,
    files
  } = useCloudStorage(selectedProvider);

  if (!isOpen) return null;

  const providers = [
    { id: 'google', name: 'Google Drive', icon: Cloud },
    { id: 'onedrive', name: 'OneDrive', icon: Cloud },
    { id: 'dropbox', name: 'Dropbox', icon: Cloud },
    { id: 'github', name: 'GitHub', icon: Github },
  ];

  const handleProviderSelect = async (providerId: string) => {
    setSelectedProvider(providerId);
    if (!isConnected(providerId)) {
      await connect(providerId);
    }
    await listFiles(providerId);
  };

  const handleFileSelect = async (fileId: string) => {
    if (!selectedProvider) return;
    const content = await getFileContent(selectedProvider, fileId);
    if (content) {
      onFileSelect(content);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">Cloud Storage</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {providers.map((provider) => {
              const Icon = provider.icon;
              const connected = isConnected(provider.id);
              return (
                <button
                  key={provider.id}
                  onClick={() => handleProviderSelect(provider.id)}
                  className={`p-4 rounded-lg border ${
                    selectedProvider === provider.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                      : 'border-gray-200 dark:border-gray-700'
                  } hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Icon className="w-8 h-8" />
                    <span className="text-sm font-medium">{provider.name}</span>
                    {connected && (
                      <span className="text-xs text-green-600 dark:text-green-400">Connected</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {selectedProvider && isConnected(selectedProvider) && (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {currentUser && `Signed in as ${currentUser}`}
                </div>
                <button
                  onClick={() => disconnect(selectedProvider)}
                  className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700"
                >
                  <LogOut className="w-4 h-4" />
                  Disconnect
                </button>
              </div>

              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                {files.map((file) => (
                  <button
                    key={file.id}
                    onClick={() => handleFileSelect(file.id)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 border-b last:border-b-0 border-gray-200 dark:border-gray-700"
                  >
                    <span className="flex-1">{file.name}</span>
                    <span className="text-sm text-gray-500">{file.modifiedAt}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}