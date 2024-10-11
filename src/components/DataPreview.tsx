// src/components/DataPreview.tsx

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDatasets, getDatasetContent, Dataset } from '@/utils/datasetUtils';
import { executePythonCode } from '@/utils/pyodideUtils';

interface DataPreviewProps {
  onDatasetSelect: (dataset: Dataset, dataFrame: string) => void;
  selectedDatasetId: string | null;
}

const DataPreview: React.FC<DataPreviewProps> = ({ onDatasetSelect, selectedDatasetId }) => {
  const datasets = useDatasets();
  const [previewContent, setPreviewContent] = useState<string | null>(null);

  const handleDatasetSelect = useCallback(async (dataset: Dataset) => {
    const content = await getDatasetContent(dataset.fileName);
    setPreviewContent(content);
    const code = `
import pandas as pd
import io

data = """
${content}
"""

df = pd.read_csv(io.StringIO(data))
print(df.head())
print("\\nDataset Information:")
print(df.info())
    `;
    const { output } = await executePythonCode(code);
    onDatasetSelect(dataset, output);
  }, [onDatasetSelect]);

  useEffect(() => {
    if (selectedDatasetId) {
      const selectedDataset = datasets.find(d => d.id === selectedDatasetId);
      if (selectedDataset) {
        handleDatasetSelect(selectedDataset);
      }
    }
  }, [selectedDatasetId, datasets, handleDatasetSelect]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Available Datasets</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-[200px] mb-4">
          <ul className="space-y-2">
            {datasets.map((dataset) => (
              <li key={dataset.id}>
                <Button
                  variant={selectedDatasetId === dataset.id ? 'default' : 'outline'}
                  onClick={() => handleDatasetSelect(dataset)}
                  className="w-full justify-start text-left"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold">{dataset.name}</span>
                    <span className="text-sm text-gray-500 break-words">{dataset.description}</span>
                  </div>
                </Button>
              </li>
            ))}
          </ul>
        </ScrollArea>
        {previewContent && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Preview:</h3>
            <ScrollArea className="h-[200px]">
              <pre className="text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded whitespace-pre-wrap">
                {previewContent}
              </pre>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DataPreview;