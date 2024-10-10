import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CodePanel from "./CodePanel";
import Console from "./Console";

interface CodeSnippet {
    id: string;
    title: string;
    code: string;
    output: string;
    plot?: string;
    plotlyData?: any;
}  

interface CodeAndConsoleProps {
  isPyodideReady: boolean;
}

const CodeAndConsole: React.FC<CodeAndConsoleProps> = ({ isPyodideReady }) => {
  const [codeSnippets, setCodeSnippets] = useState<CodeSnippet[]>([
    {
      id: 'data-cleaning',
      title: 'Data Cleaning',
      code: '# Example data cleaning code\nimport pandas as pd\n\n# Load data\ndf = pd.DataFrame({"A": [1, 2, 3], "B": [4, 5, 6]})\n\n# Display data\nprint(df)',
      output: ''
    },
    {
      id: 'data-visualization',
      title: 'Data Visualization',
      code: `
      import matplotlib.pyplot as plt
      import numpy as np
      import io
      import base64
      
      # Create data
      x = np.linspace(0, 10, 100)
      y = np.sin(x)
      
      # Create plot
      plt.figure(figsize=(8, 6))
      plt.plot(x, y)
      plt.title("Sine Wave")
      plt.xlabel("X axis")
      plt.ylabel("Y axis")
      
      # Save to byte stream
      buf = io.BytesIO()
      plt.savefig(buf, format='png')
      buf.seek(0)
      img_str = base64.b64encode(buf.getvalue()).decode('utf-8')
      
      # Clear the current figure
      plt.clf()
      
      # Return the base64 string
      img_str
`,
      output: '',
      plot: '',
    },
    {
      id: 'data-analysis',
      title: 'Data Analysis',
      code: '# Example data analysis code\nimport numpy as np\n\n# Create sample data\ndata = np.random.normal(0, 1, 1000)\n\n# Perform analysis\nmean = np.mean(data)\nstd = np.std(data)\n\nprint(f"Mean: {mean:.2f}")\nprint(f"Standard Deviation: {std:.2f}")',
      output: ''
    },
  ]);

  const handleCodeChange = (id: string, newCode: string) => {
    setCodeSnippets((snippets) => 
      snippets.map(snippet =>
        snippet.id === id ? { ...snippet, code: newCode } : snippet
      )
    );
  };

  const handleExecute = (id: string, output: string, plot?: string, plotlyData?: any) => {
    setCodeSnippets(snippets =>
      snippets.map(snippet =>
        snippet.id === id ? { ...snippet, output, plot, plotlyData } : snippet
      )
    );
  };

  return (
    <Tabs defaultValue={codeSnippets[0].id} className="w-full">
      <TabsList className="mb-4 flex-wrap">
        {codeSnippets.map(snippet => (
          <TabsTrigger key={snippet.id} value={snippet.id}>
            {snippet.title}
          </TabsTrigger>
        ))}
      </TabsList>
      {codeSnippets.map(snippet => (
        <TabsContent key={snippet.id} value={snippet.id} className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
              plotlyData={snippet.plotlyData}
              title={`${snippet.title} Console`}
            />
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default CodeAndConsole;
