// src/components/DataPreview.tsx

"use client";

import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDatasets, getDatasetContent, Dataset } from "@/utils/datasetUtils";
import { executePythonCode } from "@/utils/pyodideUtils";
import { Loader2, FileText } from "lucide-react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn } from "@/lib/utils";
import { writeFileToPyodideFS } from '@/utils/pyodideUtils';


interface DataPreviewProps {
  onDatasetSelect: (dataset: Dataset, dataFrame: string) => void;
  selectedDatasetId: string | null;
}

const DataPreview: React.FC<DataPreviewProps> = ({
  onDatasetSelect,
  selectedDatasetId,
}) => {
  const datasets = useDatasets();
  const [previewContent, setPreviewContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


const handleDatasetSelect = useCallback(async (dataset: Dataset) => {
  setIsLoading(true);
  setError(null);
  try {
    const content = await getDatasetContent(dataset.filename);
    const decoder = new TextDecoder('utf-8');
    const textContent = decoder.decode(content);
    setPreviewContent(textContent);

    // Write the data to a file in Pyodide's virtual filesystem
    writeFileToPyodideFS('/data.csv', textContent);

    const code = `
      import pandas as pd
      
      # Read the data from the file in Pyodide's filesystem
      df = pd.read_csv('/data.csv')
      print(df.head())
      print("\\nDataset Information:")
      print(df.info())
    `;
    const { output } = await executePythonCode(code);
    onDatasetSelect(dataset, output);
  } catch (error) {
    console.error('Error processing dataset:', error);
    setError('Failed to load dataset. Please try again.');
  } finally {
    setIsLoading(false);
  }
}, [onDatasetSelect]);

  return (
    <Card className="h-[600px] flex flex-col bg-gray-900 text-gray-100 border-gray-700">
      <CardHeader className="pb-2 flex-shrink-0 border-b border-gray-700">
        <CardTitle>Available Datasets</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0 flex flex-col">
        <ScrollArea className="flex-grow">
          <div className="p-4 space-y-2">
            {datasets.map((dataset) => (
              <button
                key={dataset.id}
                onClick={() => handleDatasetSelect(dataset)}
                className={cn(
                  "w-full text-left p-3 rounded-lg transition-all duration-200 ease-in-out",
                  "hover:bg-gray-800/50",
                  selectedDatasetId === dataset.id
                    ? "bg-gray-800 border-2 border-primary-500 shadow-md"
                    : "bg-gray-900 border border-gray-700"
                )}
              >
                <div className="flex items-center">
                  <FileText className="mr-3 h-5 w-5 text-primary-400" />
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">
                      {dataset.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      {dataset.filename}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
        <div className="border-t border-gray-700 p-4 flex-shrink-0">
          <h3 className="font-semibold mb-2">Preview:</h3>
          <ScrollArea className="h-[200px]">
            {isLoading && (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            )}
            {error && <div className="text-red-500">{error}</div>}
            {previewContent && !isLoading && (
              <SyntaxHighlighter
                language="json"
                style={vscDarkPlus}
                customStyle={{ background: "transparent" }}
                className="text-sm"
              >
                {previewContent}
              </SyntaxHighlighter>
            )}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataPreview;
