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
  console.log('Console props:', { output, plotAvailable: !!plot, plotlyDataAvailable: !!plotlyData });
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-auto">
        <pre className="font-mono text-sm whitespace-pre-wrap bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-4 rounded-md mb-4">
          {output || 'No output yet. Execute some code to see the results.'}
        </pre>
        {plot && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Plot:</h3>
            <img src={plot} alt="Plot" className="max-w-full h-auto" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
export default Console;