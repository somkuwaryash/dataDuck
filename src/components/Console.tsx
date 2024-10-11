// src/components/Console.tsx

import React from 'react';
import dynamic from 'next/dynamic';
import { PlotParams } from 'react-plotly.js';
import Plotly from 'plotly.js';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface ConsoleProps {
  output: string;
  plot?: string;
  title: string;
}

const Console: React.FC<ConsoleProps> = ({ output, plot, title }) => {
  const plotData: Partial<PlotParams> | null = plot
    ? {
        data: [{
          type: 'image' as const,
          source: `data:image/png;base64,${plot}`,
          x: [0, 1],
          y: [0, 1],
          z: [[0, 1], [0, 1]],  // Required for image type
          colormodel: 'rgba',   // Specify the color model
        } as Partial<Plotly.PlotData>],
        layout: {
          width: 600,
          height: 400,
          xaxis: { visible: false, range: [0, 1] },
          yaxis: { visible: false, range: [0, 1] },
        },
      }
    : null;

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="flex-grow overflow-auto bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
        <pre className="font-mono text-sm whitespace-pre-wrap text-gray-800 dark:text-gray-200">
          {output || 'No output yet. Execute some code to see the results.'}
        </pre>
        {plotData && (
          <div className="mt-4">
            <h4 className="text-md font-semibold mb-2">Plot:</h4>
            <Plot
              data={plotData.data || []}
              layout={plotData.layout || {}}
              config={{ responsive: true }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Console;