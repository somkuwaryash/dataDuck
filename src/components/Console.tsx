import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import dynamic from 'next/dynamic';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface ConsoleProps {
  output: string;
  plot?: string;
  plotlyData?: any;
  title: string;
}

const Console: React.FC<ConsoleProps> = ({ output, plot, plotlyData, title }) => {
  return (
    <div className="h-full flex flex-col">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="flex-grow overflow-auto bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
        <pre className="font-mono text-sm whitespace-pre-wrap text-gray-800 dark:text-gray-200">
          {output || 'No output yet. Execute some code to see the results.'}
        </pre>
        {plot && (
          <div className="mt-4">
            <h4 className="text-md font-semibold mb-2">Plot:</h4>
            <img src={plot} alt="Plot" className="max-w-full h-auto" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Console;
