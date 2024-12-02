import { useState, useCallback } from 'react';

interface CloudFile {
  id: string;
  name: string;
  modifiedAt: string;
}

export function useCloudStorage(provider: string | null) {
  const [files, setFiles] = useState<CloudFile[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [connections, setConnections] = useState<Record<string, boolean>>({});

  const connect = useCallback(async (providerId: string) => {
    alert('Cloud storage integration coming soon!');
    return false;
  }, []);

  const disconnect = useCallback(async (providerId: string) => {
    setConnections(prev => ({ ...prev, [providerId]: false }));
    setCurrentUser(null);
    setFiles([]);
  }, []);

  const listFiles = useCallback(async (providerId: string) => {
    setFiles([]);
  }, []);

  const getFileContent = useCallback(async (providerId: string, fileId: string) => {
    return null;
  }, []);

  const isConnected = useCallback((providerId: string) => {
    return connections[providerId] || false;
  }, [connections]);

  return {
    connect,
    disconnect,
    isConnected,
    listFiles,
    getFileContent,
    currentUser,
    files,
  };
}