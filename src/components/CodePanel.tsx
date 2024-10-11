import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { executePythonCode } from '@/utils/pyodideUtils';
import { PlotlyData } from '@/types/analysis';

interface CodePanelProps {
  code: string;
  onChange: (code: string) => void;
  onExecute: (output: string, plot?: string, plotlyData?: PlotlyData) => void;
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
      const { output, plot, plotlyData } = await executePythonCode(code);
      console.log('Execution result:', { output, plotAvailable: !!plot, plotlyDataAvailable: !!plotlyData });
      onExecute(output, plot, plotlyData as PlotlyData);
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
    <div className="h-full flex flex-col">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="flex-grow flex flex-col">
        <Textarea
          value={code}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter your Python code here..."
          className="flex-grow font-mono text-sm mb-2"
        />
        <Button 
          onClick={handleExecute} 
          disabled={isLoading || !isPyodideReady}
          className="w-full"
        >
          {isLoading ? 'Executing...' : (isPyodideReady ? 'Execute Code' : 'Initializing...')}
        </Button>
        {error && (
          <div className="mt-2 text-red-500">
            Error: {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default CodePanel;