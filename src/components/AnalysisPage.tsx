"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import ChatInterface from "./ChatInterface";
import DataPreview from "./DataPreview";
import VisualizationArea from "./VisualizationArea";
import CodeAndConsole from "./CodeAndConsole";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

const PyodideProvider = dynamic(() => import("@/components/PyodideProvider"), {
  ssr: false,
});

interface AnalysisResult {
  text: string;
  visualization?: {
    type: "line" | "bar" | "pie";
    data: any[];
    xKey: string;
    yKey: string;
    title: string;
  };
}

const AnalysisPage: React.FC = () => {
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(
    null
  );
  const [consoleOutput, setConsoleOutput] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isPyodideReady, setIsPyodideReady] = useState(false);

  const handlePyodideReady = useCallback(() => {
    setIsPyodideReady(true);
  }, []);

  useEffect(() => {
    const datasetParam = searchParams.get("dataset");
    if (datasetParam) {
      setSelectedDataset(datasetParam);
    }
  }, [searchParams]);

  const handleDatasetSelect = useCallback(
    (datasetName: string) => {
      setSelectedDataset(datasetName);
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("dataset", datasetName);
      router.push(`/analyze?${newSearchParams.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const handleQuerySubmit = useCallback(
    async (query: string): Promise<AnalysisResult> => {
      // Simulate API call to backend for processing
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const simulatedResponse: AnalysisResult = {
        text: `Analysis results for query: "${query}" on dataset: ${selectedDataset}`,
        visualization: {
          type: "bar",
          data: [
            { name: "Category A", value: Math.random() * 100 },
            { name: "Category B", value: Math.random() * 100 },
            { name: "Category C", value: Math.random() * 100 },
          ],
          xKey: "name",
          yKey: "value",
          title: "Sample Visualization",
        },
      };

      setAnalysisResults(simulatedResponse);
      return simulatedResponse;
    },
    [selectedDataset]
  );

  return (
    <PyodideProvider onReady={handlePyodideReady}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Data Analysis</h1>
        {isPyodideReady ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
            <Card className="lg:col-span-1 flex flex-col">
              <CardContent className="p-4 flex-grow overflow-y-auto">
                <DataPreview
                  onDatasetSelect={handleDatasetSelect}
                  selectedDataset={selectedDataset}
                />
              </CardContent>
            </Card>
            <Card className="lg:col-span-2">
              <CardContent className="p-4">
                <Tabs defaultValue="chat" className="flex-grow flex flex-col">
                  <TabsList>
                    <TabsTrigger value="chat" className="flex-1">Chat</TabsTrigger>
                    <TabsTrigger value="visualization" className="flex-1">Visualization</TabsTrigger>
                    <TabsTrigger value="code" className="flex-1">Code</TabsTrigger>
                  </TabsList>
                  <div className="flex-grow overflow-y-auto">
                  <TabsContent value="chat" className="h-full">
                    <ChatInterface onQuerySubmit={handleQuerySubmit} />
                  </TabsContent>
                  <TabsContent value="visualization" className="h-full">
                    <VisualizationArea results={analysisResults} />
                  </TabsContent>
                  <TabsContent value="code" className="h-full">
                    <CodeAndConsole isPyodideReady={isPyodideReady} />
                  </TabsContent>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div>Loading Python environment...</div>
        )}
      </div>
    </PyodideProvider>
  );
};

export default AnalysisPage;
