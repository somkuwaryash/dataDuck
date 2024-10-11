import React from 'react';
import Chart from './Chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

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
    plot?: string; // Base64 encoded image
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
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Analysis Results</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-auto">
        <ScrollArea className="h-full">
          <p className="mb-4 text-gray-700 dark:text-gray-300">{results.text}</p>
          {results.plot && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Generated Plot</h3>
              <img src={`data:image/png;base64,${results.plot}`} alt="Generated plot" className="max-w-full" />
            </div>
          )}
          {results.visualization && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Interactive Chart</h3>
              <div className="h-64 md:h-96">
                <Chart
                  type={results.visualization.type}
                  data={results.visualization.data}
                  xKey={results.visualization.xKey}
                  yKey={results.visualization.yKey}
                  title={results.visualization.title}
                />
              </div>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default VisualizationArea;