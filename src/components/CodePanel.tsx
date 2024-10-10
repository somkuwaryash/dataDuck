import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { executePythonCode } from '@/utils/pyodideUtils';

interface CodePanelProps {
  code: string;
  onChange: (code: string) => void;
  onExecute: (output: string, plot?: string, plotlyData?: any) => void;
  title: string;
  isPyodideReady: boolean;  
}

const CodePanel: React.FC<CodePanelProps> = ({ code, onChange, onExecute, title, isPyodideReady }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExecute = async () => {
    if (!isPyodideReady) {
      console.log('Python environment not ready');
      onExecute('Python environment is not ready yet. Please wait and try again.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      console.log('Executing code:', code);
      const { output, plot } = await executePythonCode(code);
      console.log('Execution result:', { output, plotAvailable: !!plot });
      onExecute(output, plot);
    } catch (error) {
      console.error('Execution error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setError(errorMessage);
      onExecute(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <Textarea
          value={code}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter your Python code here..."
          className="flex-grow font-mono text-sm mb-4"
        />
        <Button 
          onClick={handleExecute} 
          disabled={isLoading || !isPyodideReady}
        >
          {isLoading ? 'Executing...' : (isPyodideReady ? 'Execute Code' : 'Initializing...')}
        </Button>
        {error && (
          <div className="mt-2 text-red-500">
            Error: {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CodePanel;