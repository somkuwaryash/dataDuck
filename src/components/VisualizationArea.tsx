'use client';

import React from 'react';
import Chart from './Chart';

interface VisualizationAreaProps {
  results: {
    text: string;
    visualization?: {
      type: 'line' | 'bar' | 'pie';
      data: Array<{ [key: string]: string | number }>;
      xKey: string;
      yKey: string;
      title: string;
    };
  } | null;
}

const VisualizationArea: React.FC<VisualizationAreaProps> = ({ results }) => {
  if (!results) {
    return (
      <div className="h-full flex items-center justify-center text-center text-gray-500">
        No analysis results to display yet. Start a conversation to see visualizations here.
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <p className="mb-4 text-gray-700 dark:text-gray-300">{results.text}</p>
      {results.visualization && (
        <div className="flex-grow">
          <Chart
            type={results.visualization.type}
            data={results.visualization.data}
            xKey={results.visualization.xKey}
            yKey={results.visualization.yKey}
            title={results.visualization.title}
          />
        </div>
      )}
    </div>
  );
};

export default VisualizationArea;

