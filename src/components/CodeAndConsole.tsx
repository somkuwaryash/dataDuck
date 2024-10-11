// src/components/CodeAndConsole.tsx

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CodePanel from "./CodePanel";
import Console from "./Console";
import { Dataset } from "@/utils/datasetUtils";
import { useCodeSnippets } from "@/hooks/useCodeSnippets";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

interface CodeAndConsoleProps {
  isPyodideReady: boolean;
  selectedDataset: Dataset | null;
}

const CodeAndConsole: React.FC<CodeAndConsoleProps> = ({ isPyodideReady, selectedDataset }) => {
  const { codeSnippets, isLoading, error, handleCodeChange, handleExecute } = useCodeSnippets(selectedDataset);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        <span>Loading dataset...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Tabs defaultValue={codeSnippets[0].id} className="h-full flex flex-col">
      <TabsList className="mb-2">
        {codeSnippets.map(snippet => (
          <TabsTrigger key={snippet.id} value={snippet.id}>
            {snippet.title}
          </TabsTrigger>
        ))}
      </TabsList>
      <div className="flex-grow overflow-hidden">
        {codeSnippets.map(snippet => (
          <TabsContent key={snippet.id} value={snippet.id} className="h-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
              <CodePanel
                code={snippet.code}
                onChange={(newCode) => handleCodeChange(snippet.id, newCode)}
                onExecute={(output, plot, plotlyData) => handleExecute(snippet.id, output, plot, plotlyData)}
                title={`${snippet.title} Code`}
                isPyodideReady={isPyodideReady}
              />
              <Console
  output={snippet.output}
  plot={snippet.plot}
  title={`${snippet.title} Console`}
/>
            </div>
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
};

export default CodeAndConsole;