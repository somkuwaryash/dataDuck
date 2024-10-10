'use client';

import React from 'react';
import Chart from './Chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface VisualizationAreaProps {
  results: {
    text: string;
    visualization?: {
      type: 'line' | 'bar' | 'pie';
      data: any[];
      xKey: string;
      yKey: string;
      title: string;
    };
  } | null;
}

const VisualizationArea: React.FC<VisualizationAreaProps> = ({ results }) => {
  if (!results) {
    return (
      <Card>
        <CardContent className="p-4 text-center text-gray-500">
          No analysis results to display yet. Start a conversation to see visualizations here.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analysis Results</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-gray-700 dark:text-gray-300">{results.text}</p>
        {results.visualization && (
          <div className="h-64 md:h-96">
            <Chart
              type={results.visualization.type}
              data={results.visualization.data}
              xKey={results.visualization.xKey}
              yKey={results.visualization.yKey}
              title={results.visualization.title}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VisualizationArea;