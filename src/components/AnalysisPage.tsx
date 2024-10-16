'use client';

import React, { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import ChatInterface from "./ChatInterface";
import DataPreview from "./DataPreview";
import VisualizationArea from "./VisualizationArea";
import CodeAndConsole from "./CodeAndConsole";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Dataset, getDatasetById } from "@/utils/datasetUtils";
import { AIResponse } from "@/utils/aiUtils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

const PyodideProvider = dynamic(() => import("@/components/PyodideProvider"), {
  ssr: false,
});

interface AnalysisResult {
  text: string;
  visualization?: {
    type: "line" | "bar" | "pie";
    data: Array<{ [key: string]: string | number }>;
    xKey: string;
    yKey: string;
    title: string;
  };
}

const AnalysisPage: React.FC = () => {
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [dataFrameInfo, setDataFrameInfo] = useState<string>('');
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null);
  const [isPyodideReady, setIsPyodideReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleNewChat = useCallback(() => {
    setAnalysisResults(null);
    // Reset any other state variables related to the current analysis
  }, []);

  const handlePyodideReady = useCallback(() => {
    setIsPyodideReady(true);
  }, []);

  useEffect(() => {
    const fetchDataset = async () => {
      const datasetId = searchParams.get("dataset");
      console.log('Fetching dataset with ID:', datasetId);
      if (datasetId) {
        const dataset = await getDatasetById(datasetId);
        if (dataset) {
          console.log('Dataset found:', dataset);
          setSelectedDataset(dataset);
        } else {
          console.error('Dataset not found for ID:', datasetId);
          setError("Dataset not found");
        }
      }
    };
  
    fetchDataset();
  }, [searchParams]);

  const handleDatasetSelect = useCallback(
    (dataset: Dataset, dataFrame: string) => {
      setSelectedDataset(dataset);
      setDataFrameInfo(dataFrame);
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("dataset", dataset.id);
      router.push(`/analyze?${newSearchParams.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const handleQuerySubmit = useCallback(async (query: string, aiResponse: AIResponse, executionResult: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      // Here you can process the AI response and execution result to create a more meaningful analysis result
      // For now, we'll use a simulated response
      const simulatedResponse: AnalysisResult = {
        text: `Analysis results for query: "${query}"\n\nAI Response: ${aiResponse.text}\n\nExecution Result: ${executionResult}`,
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
    } catch (err) {
      setError("Failed to process query. Please try again.");
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <PyodideProvider onReady={handlePyodideReady}>
      <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">Data Analysis</h1>
        {isPyodideReady ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-200px)]">
            <Card className="lg:col-span-1 flex flex-col shadow-lg">
              <CardContent className="p-6 flex-grow overflow-y-auto">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Available Datasets</h2>
                <DataPreview
                  onDatasetSelect={handleDatasetSelect}
                  selectedDatasetId={selectedDataset?.id || null}
                />
              </CardContent>
            </Card>
            <Card className="lg:col-span-2 shadow-lg">
              <CardContent className="p-6">
                <Tabs defaultValue="chat" className="flex-grow flex flex-col">
                  <TabsList className="mb-4">
                    <TabsTrigger value="chat" className="px-6 py-2">Chat</TabsTrigger>
                    <TabsTrigger value="visualization" className="px-6 py-2">Visualization</TabsTrigger>
                    <TabsTrigger value="code" className="px-6 py-2">Code</TabsTrigger>
                  </TabsList>
                  <div className="flex-grow overflow-y-auto bg-white rounded-lg shadow-inner">
                    <TabsContent value="chat" className="h-full p-4">
                      <ChatInterface 
                        onQuerySubmit={handleQuerySubmit} 
                        dataFrameInfo={dataFrameInfo}
                        onNewChat={handleNewChat}
                      />
                    </TabsContent>
                    <TabsContent value="visualization" className="h-full p-4">
                      <VisualizationArea results={analysisResults} isLoading={isLoading} />
                    </TabsContent>
                    <TabsContent value="code" className="h-full p-4">
                      <CodeAndConsole 
                        isPyodideReady={isPyodideReady} 
                        selectedDataset={selectedDataset}
                      />
                    </TabsContent>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow-md">
            <Loader2 className="mr-4 h-10 w-10 animate-spin text-blue-500" />
            <span className="text-lg text-gray-600">Loading Python environment...</span>
          </div>
        )}
      </div>
    </PyodideProvider>
  );
};

export default AnalysisPage;