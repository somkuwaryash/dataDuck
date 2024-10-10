// src/components/PyodideProvider.tsx

import React, { useEffect, useState } from 'react';
import { initializePyodide } from '@/utils/pyodideUtils';

interface PyodideProviderProps {
  children: React.ReactNode;
  onReady: () => void;
}

const PyodideProvider: React.FC<PyodideProviderProps> = ({ children, onReady }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPyodide = async () => {
      try {
        await initializePyodide();
        setIsLoading(false);
        onReady();
      } catch (error) {
        console.error('Failed to initialize Pyodide:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
        setIsLoading(false);
      }
    };

    loadPyodide();
  }, [onReady]);

  if (isLoading) {
    return <div>Loading Python environment...</div>;
  }

  if (error) {
    return <div>Error initializing Python environment: {error}</div>;
  }

  return <>{children}</>;
};

export default PyodideProvider;