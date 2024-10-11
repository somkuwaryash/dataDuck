import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { executePythonCode } from '@/utils/pyodideUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Play, Copy } from 'lucide-react';
import Editor from '@monaco-editor/react';

interface CodePanelProps {
  code: string;
  onChange: (code: string) => void;
  onExecute: (output: string, executionResult: string) => void;
  title: string;
  isPyodideReady: boolean;
}

const CodePanel: React.FC<CodePanelProps> = ({ code, onChange, onExecute, title, isPyodideReady }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleExecute = async () => {
    if (!isPyodideReady) {
      console.log('Python environment not ready');
      onExecute('Python environment is not ready yet. Please wait and try again.', '');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      console.log('Executing code:', code);
      const { output, executionResult } = await executePythonCode(code);
      console.log('Execution result:', { output, executionResult });
      onExecute(output, executionResult);
    } catch (error) {
      console.error('Execution error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setError(errorMessage);
      onExecute(`Error: ${errorMessage}`, '');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <Card className="h-[600px] flex flex-col bg-gray-900 text-gray-100 border-gray-700">
      <CardHeader className="pb-2 flex flex-row items-center justify-between border-b border-gray-700">
        <CardTitle>{title}</CardTitle>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCopy} 
            className="bg-gray-800 text-gray-100 hover:bg-gray-700"
          >
            {isCopied ? 'Copied!' : <Copy className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExecute}
            disabled={isLoading || !isPyodideReady}
            className="bg-gray-800 text-gray-100 hover:bg-gray-700"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-4 flex flex-col">
      <CardContent className="flex-grow overflow-hidden p-0">
        <Editor
          height="100%"
          defaultLanguage="python"
          theme="vs-dark"
          value={code}
          onChange={(value) => onChange(value || '')}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </CardContent>
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