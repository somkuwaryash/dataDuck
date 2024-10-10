'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DataPreviewProps {
  onDatasetSelect: (datasetName: string) => void;
  selectedDataset: string | null;
}

const DataPreview: React.FC<DataPreviewProps> = ({ onDatasetSelect, selectedDataset }) => {
  // Mock data for demonstration
  const availableDatasets = ['Sales Data 2023', 'Customer Survey', 'Product Inventory'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Datasets</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {availableDatasets.map((dataset) => (
            <li key={dataset}>
              <Button
                variant={selectedDataset === dataset ? 'default' : 'outline'}
                onClick={() => onDatasetSelect(dataset)}
                className="w-full justify-start"
              >
                {dataset}
              </Button>
            </li>
          ))}
        </ul>
        {selectedDataset && (
          <div className="mt-4">
            <h3 className="font-semibold">Preview: {selectedDataset}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              (Preview data would be displayed here)
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DataPreview;